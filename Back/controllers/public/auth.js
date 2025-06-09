const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const utils = require('../../utils');
const App = require('../../models/App');
const License = require('../../models/License');
const SubUser = require('../../models/SubUser');
const User = require('../../models/User');

const checkUserBanned = async (ownerId) => {
    const user = await User.findOne({ id: ownerId });
    return user && user.banned;
};

const checkApp = async (req, res) => {
    const { name, ownerId, secret } = req.body;

    if (!name) return res.status(400).json({ message: 'App name is required.' });
    if (!ownerId) return res.status(400).json({ message: 'App ownerId is required.' });
    if (!secret) return res.status(400).json({ message: 'App secret is required.' });

    const app = await App.findOne({ name, ownerId, secret });
    if (!app) return res.status(404).json({ message: 'This app does not exist.' });

    return res.status(204).send(null);
};

const login = async (req, res) => {
    const { username, password, ownerId, license, hwid } = req.body;

    if (!ownerId) return res.status(400).json({ message: 'Owner id is required.' });

    if (await checkUserBanned(ownerId)) {
        return res.status(403).json({ message: 'Account suspended. Access denied.' });
    }

    if (license) {
        if (!hwid) return res.status(400).json({ message: 'Hwid is required.' });

        const userLicense = await License.findOne({ name: license, ownerId });
        if (!userLicense) return res.status(400).json({ message: 'This license is not valid.' });
        if (!userLicense.active) return res.status(403).json({ message: 'This license is currently inactive.' });

        const user = await SubUser.findOne({ licenseId: userLicense.id, ownerId });
        if (!user) return res.status(400).json({ message: 'This license is not valid.' });
        if (!user.active) return res.status(403).json({ message: 'This account is currently inactive.' });

        if (hwid !== user.hwid) return res.status(400).json({ message: 'The hwid is not the same as the one registered.' });

        return res.status(204).send(null);
    }

    if (!username) return res.status(400).json({ message: 'Username is required.' });
    if (!password) return res.status(400).json({ message: 'Password is required.' });

    const user = await SubUser.findOne({ username, ownerId });
    if (!user) return res.status(400).json({ message: 'Username or password is not valid.' });
    if (!user.active) return res.status(403).json({ message: 'This account is currently inactive.' });

    if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ message: 'Username or password is not valid.' });

    return res.status(204).send(null);
};

const register = async (req, res) => {
    const { username, password, license, ownerId, hwid } = req.body;

    if (!username) return res.status(400).json({ message: 'Username is required.' });
    if (!password) return res.status(400).json({ message: 'Password is required.' });
    if (!license) return res.status(400).json({ message: 'License is required.' });
    if (!hwid) return res.status(400).json({ message: 'Hwid is required.' });
    if (!ownerId) return res.status(400).json({ message: 'Owner id is required.' });

    if (await checkUserBanned(ownerId)) {
        return res.status(403).json({ message: 'Account suspended. Access denied.' });
    }

    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/;
    if (!usernameRegex.test(username)) return res.status(400).json({ message: 'The provided username is not valid.' });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(password)) return res.status(400).json({ message: 'The password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number and one special character.' });

    const userLicense = await License.findOne({ name: license, ownerId });

    if (!userLicense) return res.status(400).json({ message: 'This license is not valid.' });
    if (!userLicense.active) return res.status(403).json({ message: 'This license is currently inactive.' });
    if (userLicense.expiration < Date.now()) return res.status(400).json({ message: 'This license has expired.' });
    if (userLicense.used) return res.status(400).json({ message: 'This license is already used.' });

    const existingUsername = await SubUser.findOne({ username, ownerId: userLicense.ownerId });
    if (existingUsername) return res.status(400).json({ message: 'Username already in use.' });

    const id = crypto.randomUUID();
    const token = utils.generateString(56);

    userLicense.used = true;
    await userLicense.save();

    const user = new SubUser({ ownerId: userLicense.ownerId, appId: userLicense.appId, id, licenseId: userLicense.id, hwid, username, password: bcrypt.hashSync(password, 10), token });
    await user.save();

    return res.status(204).send(null);
};

module.exports = {
    checkApp,
    register,
    login
};
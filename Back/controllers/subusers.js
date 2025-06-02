const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const utils = require('../utils');
const App = require('../models/App');
const SubUser = require('../models/SubUser');

const getUsers = async (req, res) => {
    const { ownerId } = req.query;
    
    let users;
    if (req.user.isAdmin && ownerId) {
        users = await SubUser.find({ ownerId }) || [];
    } else if (req.user.isAdmin) {
        users = await SubUser.find() || [];
    } else {
        users = await SubUser.find({ ownerId: req.user.id }) || [];
    }

    return res.json(users.map(({ id, username, appId }) => ({ id, username, appId })));
};

const createUser = async (req, res) => {
    const { username, password, appId } = req.body;

    if (!username) return res.status(400).json({ message: 'Username is required.' });
    if (!password) return res.status(400).json({ message: 'Password is required.' });
    if (!appId) return res.status(400).json({ message: 'App id is required.' });

    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/;
    if (!usernameRegex.test(username)) return res.status(400).json({ message: 'The provided username is invalid.' });

    const existingUsername = await SubUser.findOne({ ownerId: req.user.id, username });
    if (existingUsername) return res.status(400).json({ message: 'Username already in use.' });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(password)) return res.status(400).json({ message: 'The password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number and one special character.' });

    const app = await App.findOne({ id: appId });
    if (!app) return res.status(400).json({ message: 'Invalid app id.' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = utils.generateString(56);

    const user = new SubUser({ ownerId: req.user.id, appId, id: crypto.randomUUID(), username, password: hashedPassword, token });
    await user.save();

    return res.json({ id: user.id, username, appId });
}

const deleteUser = async (req, res) => {
    const { userId } = req.params;

    const user = await SubUser.findOne({ id: userId });
    if (!user) return res.status(400).json({ message: 'The provided user doesn\'t exist.' });

    await user.deleteOne();

    return res.status(204).send(null);
};

module.exports = {
    getUsers,
    createUser,
    deleteUser
};
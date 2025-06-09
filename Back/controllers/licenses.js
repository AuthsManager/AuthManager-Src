const crypto = require('crypto');
const License = require('../models/License');
const App = require('../models/App');
const User = require('../models/User');

const checkUserBanned = async (userId) => {
    const user = await User.findOne({ id: userId });
    return user && user.banned;
};

const getLicenses = async (req, res) => {
    if (await checkUserBanned(req.user.id)) {
        return res.status(403).json({ message: 'Account suspended. Access denied.' });
    }

    const licenses = req.user.isAdmin ? await License.find({ }) || [] : await License.find({ ownerId: req.user.id }) || [];

    return res.json(licenses.map(({ user, used, ownerId, appId, id, createdAt, name, expiration }) => ({ user, used, ownerId, appId, id, createdAt, name, expiration })));
};

const createLicense = async (req, res) => {
    if (await checkUserBanned(req.user.id)) {
        return res.status(403).json({ message: 'Account suspended. Access denied.' });
    }

    const { name, expiration, appId } = req.body;

    if (!name) return res.status(400).json({ message: 'License name is required.' });
    if (!expiration) return res.status(400).json({ message: 'License expiration is required.' });
    if (!appId) return res.status(400).json({ message: 'App id is required.' });

    const nameRegex = /^[a-zA-Z0-9-]*$/;
    if (!nameRegex.test(name)) return res.status(400).json({ message: 'The provided license name is invalid.' });

    const already = await License.findOne({ name, ownerId: req.user.id });
    if (already) return res.status(400).json({ message: 'The provided license name already exist.' });

    if (isNaN(expiration) || expiration < Date.now()) return res.status(400).json({ message: 'The provided license expiration is invalid.' });

    const app = await App.findOne({ id: appId });
    if (!app) return res.status(400).json({ message: 'Invalid app id.' });
  
    const license = (await new License({
        ownerId: req.user.id,
        appId,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        name,
        expiration
    }).save()).toJSON();

    delete license._id;
    delete license.__v;
  
    return res.status(201).json(license);
};

const renewLicense = async (req, res) => {
    if (await checkUserBanned(req.user.id)) {
        return res.status(403).json({ message: 'Account suspended. Access denied.' });
    }

    const { licenseId } = req.params;

    const license = await License.findOne({ id: licenseId });
    if (!license) return res.status(400).json({ message: 'The provided license doesn\'t exist.' });

    license.expiration = (license.expiration > Date.now() ? license.expiration : Date.now()) + (license.expiration - license.createdAt);
    await license.save();

    const newLicense = license.toJSON();
    delete newLicense._id;
    delete newLicense.__v;

    return res.json(newLicense);
};

const deleteLicense = async (req, res) => {
    if (await checkUserBanned(req.user.id)) {
        return res.status(403).json({ message: 'Account suspended. Access denied.' });
    }

    const { licenseId } = req.params;

    const license = await License.findOne({ id: licenseId });
    if (!license) return res.status(400).json({ message: 'The provided license doesn\'t exist.' });

    await license.deleteOne();

    return res.status(204).send(null);
};
  
module.exports = {
    getLicenses,
    createLicense,
    renewLicense,
    deleteLicense
};
const crypto = require('node:crypto');
const App = require('../models/App');
const License = require('../models/License');
const SubUser = require('../models/SubUser');
const utils = require('../utils');

const createApp = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'App name is required.' });

    const apps = await App.find({ ownerId: req.user.id }) || [];
    if (req.user.subTier === 0 && apps.length >= 1) return res.status(400).json({ message: 'Your subscription tier limits you to only one application.' });

    const nameRegex = /^[a-zA-Z0-9-]*$/;
    if (!nameRegex.test(name)) return res.status(400).json({ message: 'The provided app name is invalid.' });

    const already = apps.find(app => app.name === name);
    if (already) return res.status(400).json({ message: 'The provided app name already exist.' });
  
    const app = (await new App({
        ownerId: req.user.id,
        id: crypto.randomUUID(),
        secret: utils.generateString(36),
        name
    }).save()).toJSON();

    delete app._id;
    delete app.__v;
  
    return res.status(201).json(app);
};

const editApp = async (req, res) => {
    const { appId } = req.params;
    const { newName } = req.body;

    if (!newName) return res.status(400).json({ message: 'App name is required.' });

    const nameRegex = /^[a-zA-Z0-9-]*$/;
    if (!nameRegex.test(newName)) return res.status(400).json({ message: 'The provided app name is invalid.' });

    const app = await App.findOne({ id: appId });
    if (!app) return res.status(400).json({ message: 'The provided app doesn\'t exist.' });

    if (newName === app.name) return res.status(400).json({ message: 'The new app name must be different from the old one.' });

    const already = await App.findOne({ name: newName, ownerId: req.user.id });
    if (already) return res.status(400).json({ message: 'The provided app name already exist.' });

    app.name = newName;
    await app.save();

    return res.status(204).send(null);
};

const deleteApp = async (req, res) => {
    const { appId } = req.params;

    const app = await App.findOne({ id: appId });
    if (!app) return res.status(400).json({ message: 'The provided app doesn\'t exist.' });

    await app.deleteOne();
    await License.deleteMany({ appId });
    await SubUser.deleteMany({ appId });

    return res.status(204).send(null);
};
  
module.exports = {
    createApp,
    editApp,
    deleteApp
};
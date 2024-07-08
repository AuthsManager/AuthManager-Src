const App = require('../models/App');

const getMe = async (req, res) => {
    const apps = req.user.isAdmin ? await App.find({ }) || [] : await App.find({ ownerId: req.user.id }) || [];

    return res.json({ ...req.user, applications: apps.map(({ ownerId, id, secret, name, version }) => ({ ownerId, id, secret, name, version })) });
}

module.exports = {
    getMe
};
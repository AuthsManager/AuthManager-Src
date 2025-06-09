const { Schema, model } = require('mongoose');

const subUserSchema = new Schema({
    ownerId: String,
    appId: String,
    licenseId: String,
    id: String,
    hwid: String,
    username: String,
    password: String,
    token: String,
    active: { type: Boolean, default: true }
});

module.exports = model('subUser', subUserSchema);
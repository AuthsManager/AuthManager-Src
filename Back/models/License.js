const { Schema, model } = require('mongoose');

const licenseSchema = new Schema({
    ownerId: String,
    appId: String,
    id: String,
    used: { type: Boolean, default: false },
    name: String,
    createdAt: Number,
    expiration: Number
});

module.exports = model('license', licenseSchema);
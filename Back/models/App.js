const { Schema, model } = require('mongoose');

const appSchema = new Schema({
    ownerId: String,
    id: String,
    secret: String,
    name: String,
    version: { type: String, default: '1.0.0' }
});

module.exports = model('App', appSchema);
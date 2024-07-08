const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    id: String,
    username: String,
    email: String,
    password: String,
    token: String,
    subTier: { type: Number, default: 0 }
});

module.exports = model('user', userSchema);
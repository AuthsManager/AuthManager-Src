const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    id: String,
    username: String,
    email: String,
    password: String,
    token: String,
    created_at: Number,
    subscription: {
        plan: { type: String, default: 'Starter' },
        expires: { type: Number, default: 0 }
    }
});

module.exports = model('user', userSchema);
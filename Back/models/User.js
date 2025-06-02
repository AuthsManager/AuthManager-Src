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
    },
    settings: {
        notifications: {
            updates: { type: Boolean, default: true },
            security: { type: Boolean, default: true },
            marketing: { type: Boolean, default: false }
        },
        theme: { type: String, default: 'dark' },
        language: { type: String, default: 'en' },
        twoFactor: { type: Boolean, default: false }
    }
});

module.exports = model('user', userSchema);
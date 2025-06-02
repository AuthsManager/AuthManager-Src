const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    id: String,
    username: String,
    email: String,
    password: String,
    token: String,
    created_at: Number,
    isVerified: { type: Boolean, default: false },
    otpCode: String,
    otpExpires: Number,
    subscription: {
        plan: { type: String, default: 'Starter' },
        expires: { type: Number, default: 0 }
    },
    settings: {
        twoFactor: { type: Boolean, default: false }
    }
});

module.exports = model('user', userSchema);
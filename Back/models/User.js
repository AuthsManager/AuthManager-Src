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
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: String,
    emailVerificationExpires: Number,
    passwordResetCode: String,
    passwordResetExpires: Number,
    subscription: {
        plan: { type: String, default: 'Starter' },
        expires: { type: Number, default: 0 }
    },
    settings: {
        twoFactor: { type: Boolean, default: false }
    },
    twoFactorAuth: {
        secret: String,
        backupCodes: [String],
        isEnabled: { type: Boolean, default: false },
        lastUsed: Number
    }
});

module.exports = model('user', userSchema);
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const utils = require('../utils');
const User = require('../models/User');
const { sendOTPEmail, sendPasswordReset } = require('../services/emailService');

const verifyTurnstileToken = async (token) => {
    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                secret: process.env.CLOUDFLARE_KEY,
                response: token
            })
        });
        
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return false;
    }
};

const register = async (req, res) => {
    const { username, email, password, confirmPassword, turnstileToken } = req.body;

    if (!username) return res.status(400).json({ message: 'Username is required.' });
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    if (!password) return res.status(400).json({ message: 'Password is required.' });
    if (!confirmPassword) return res.status(400).json({ message: 'You must confirm your password.' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords are not matching.' });
    if (!turnstileToken) return res.status(400).json({ message: 'CAPTCHA verification is required.' });

    const isTurnstileValid = await verifyTurnstileToken(turnstileToken);
    if (!isTurnstileValid) {
        return res.status(400).json({ message: 'CAPTCHA verification failed. Please try again.' });
    }

    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/;
    if (!usernameRegex.test(username)) return res.status(400).json({ message: 'The provided username is invalid.' });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: 'Username already in use.' });

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'The provided email is invalid.' });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({  message: 'Email already in use.' });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) return res.status(400).json({ message: 'The password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number and one special character.' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = utils.generateString(56);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    const user = new User({
        id: crypto.randomUUID(),
        username,
        email,
        created_at: Date.now(),
        password: hashedPassword,
        token,
        isVerified: false,
        otpCode,
        otpExpires
    });
    await user.save();

    const emailResult = await sendOTPEmail(email, otpCode, username);
    
    if (!emailResult.success) {
        await User.deleteOne({ id: user.id });
        return res.status(500).json({ message: 'Error while sending verification email.' });
    }

    return res.json({ 
        message: 'Account created successfully. Please check your email for the OTP code.',
        userId: user.id,
        requiresVerification: true
    });
}

const verifyOTP = async (req, res) => {
    const { userId, otpCode } = req.body;

    if (!userId) return res.status(400).json({ message: 'User ID required.' });
    if (!otpCode) return res.status(400).json({ message: 'OTP Code required.' });

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    if (user.isVerified) return res.status(400).json({ message: 'Account already verified.' });

    if (!user.otpCode || !user.otpExpires) {
        return res.status(400).json({ message: 'No waiting OTP code found.' });
    }

    if (Date.now() > user.otpExpires) {
        return res.status(400).json({ message: 'OTP Code expired.' });
    }

    if (user.otpCode !== otpCode) {
        return res.status(400).json({ message: 'Invalid OTP Code.' });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ 
        message: 'Successfully verified account !',
        token: user.token
    });
};

const resendOTP = async (req, res) => {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: 'User ID required.' });

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    if (user.isVerified) return res.status(400).json({ message: 'Account already verified.' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otpCode = otpCode;
    user.otpExpires = otpExpires;
    await user.save();

    const emailResult = await sendOTPEmail(user.email, otpCode, user.username);
    
    if (!emailResult.success) {
        return res.status(500).json({ message: 'Failed to send verification email.' });
    }

    return res.json({ message: 'New OTP code sent.' });
};

const login = async (req, res) => {
    const { email, password, turnstileToken } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required.' });
    if (!password) return res.status(400).json({ message: 'Password is required.' });
    if (!turnstileToken) return res.status(400).json({ message: 'CAPTCHA verification is required.' });

    const isTurnstileValid = await verifyTurnstileToken(turnstileToken);
    if (!isTurnstileValid) {
        return res.status(400).json({ message: 'CAPTCHA verification failed. Please try again.' });
    }

    const existing = await User.findOne({ email });

    if (!existing) return res.status(400).json({ message: 'Email or password is invalid.' });
    if (!existing.isVerified) return res.status(400).json({ message: 'Please verify your account before logging in.' });
    if (!bcrypt.compareSync(password, existing.password)) return res.status(400).json({  message: 'Email or password is invalid.' });

    return res.json({ token: existing.token });
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address.' });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.passwordResetCode = resetCode;
        user.passwordResetExpires = resetExpires;
        await user.save();

        const emailResult = await sendPasswordReset(email, resetCode, user.username);
        
        if (!emailResult.success) {
            return res.status(500).json({ message: 'Error while sending reset email.' });
        }

        return res.json({ message: 'Password reset code sent to your email.' });
    } catch (error) {
        console.error('Error in forgot password:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword, confirmPassword } = req.body;

        if (!email || !resetCode || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                message: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character.' 
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address.' });
        }

        if (!user.passwordResetCode || !user.passwordResetExpires) {
            return res.status(400).json({ message: 'No reset code found. Please request a new one.' });
        }

        if (Date.now() > user.passwordResetExpires) {
            return res.status(400).json({ message: 'Reset code has expired. Please request a new one.' });
        }

        if (user.passwordResetCode !== resetCode) {
            return res.status(400).json({ message: 'Invalid reset code.' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.password = hashedPassword;
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return res.json({ message: 'Password reset successfully!' });
    } catch (error) {
        console.error('Error in reset password:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    login,
    register,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword
};
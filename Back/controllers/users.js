const App = require('../models/App');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sendEmailVerification } = require('../services/emailService');
const crypto = require('crypto');

const getMe = async (req, res) => {
    const apps = req.user.isAdmin ? await App.find({ }) || [] : await App.find({ ownerId: req.user.id }) || [];
    
    const user = { ...req.user };
    delete user.isAdmin;
 
    return res.json({ ...user, applications: apps.map(({ ownerId, id, secret, name, version }) => ({ ownerId, id, secret, name, version })) });
}

const updateSettings = async (req, res) => {
    try {
        const { twoFactor } = req.body;
        const userId = req.user.id;

        if (twoFactor === undefined) {
            return res.status(400).json({ message: 'No valid settings provided' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { id: userId },
            { $set: { 'settings.twoFactor': twoFactor } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'Settings updated successfully', settings: updatedUser.settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.user.id;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingEmail = await User.findOne({ email, id: { $ne: userId } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { id: userId },
            { $set: { email } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'Profile updated successfully', email: updatedUser.email });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All password fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                message: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character' 
            });
        }

        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
        await User.findOneAndUpdate(
            { id: userId },
            { $set: { password: hashedNewPassword } }
        );

        return res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const sendEmailVerificationCode = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({ id: userId });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.emailVerificationCode = verificationCode;
        user.emailVerificationExpires = verificationExpires;
        await user.save();

        const emailResult = await sendEmailVerification(user.email, verificationCode, user.username);
        
        if (!emailResult.success) {
            return res.status(500).json({ message: 'Error while sending verification email' });
        }

        return res.json({ message: 'Verification code sent to your email' });
    } catch (error) {
        console.error('Error sending email verification:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const verifyEmailCode = async (req, res) => {
    try {
        const { verificationCode } = req.body;
        const userId = req.user.id;

        if (!verificationCode) {
            return res.status(400).json({ message: 'Verification code is required' });
        }

        const user = await User.findOne({ id: userId });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        if (!user.emailVerificationCode || !user.emailVerificationExpires) {
            return res.status(400).json({ message: 'No verification code found. Please request a new one.' });
        }

        if (Date.now() > user.emailVerificationExpires) {
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        if (user.emailVerificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        return res.json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getMe,
    updateSettings,
    updateProfile,
    changePassword,
    sendEmailVerificationCode,
    verifyEmailCode
};
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const utils = require('../../utils');
const User = require('../../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); 
        return res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Failed to fetch users.' });
    }
}

const createUser = async (req, res) => {
    const { username, email, password, expiration, isAdmin } = req.body;

    if (!username) return res.status(400).json({ message: 'Username is required.' });
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    if (!password) return res.status(400).json({ message: 'Password is required.' });
    if (!expiration) return res.status(400).json({ message: 'Expiration is required.' });
    if (typeof isAdmin !== 'boolean') return res.status(400).json({ message: 'IsAdmin is required.' });

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

    if (isNaN(expiration) || expiration < Date.now()) return res.status(400).json({ message: 'The provided expiration is invalid.' });
    console.log(expiration);

    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = utils.generateString(56);

    const user = new User({
        id: crypto.randomUUID(),
        username,
        email,
        created_at: Date.now(),
        password: hashedPassword,
        token,
        subscription: {
            plan: isAdmin ? 'Admin' : 'Starter',
            expires: expiration
        }
    });
    await user.save();

    const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        subscription: user.subscription,
        settings: user.settings
    };

    return res.json(userResponse);
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await User.deleteOne({ id: userId });
        
        return res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Failed to delete user.' });
    }
}

module.exports = {
    getUsers,
    createUser,
    deleteUser
};
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: 'Unauthorized.' });

    const [type, token] = authorization.split(' ');
    if (!type || !['Admin', 'User'].includes(type) || !token) return res.status(401).json({ message: 'Unauthorized.' });

    const user = await User.findOne({ token });
    if (!user) return res.status(401).json({ message: 'Unauthorized.' });

    if (req.url.startsWith('/api/v1/admin') && (type !== 'Admin' || !['Admin', 'Founder'].includes(user.subscription.plan))) return res.status(401).json({ message: 'Unauthorized.' });

    req.user = user.toJSON();
    req.user.isAdmin = type === 'Admin';

    delete req.user.token;
    delete req.user.password;
    delete req.user._id;
    delete req.user.__v;

    next();
}
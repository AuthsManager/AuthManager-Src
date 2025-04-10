const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '500mb' }));

app.use(cors({
    origin: ['http://localhost:5173', 'http://192.168.1.154:5173/'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`))

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to mongodb');
    })
    .catch(err => console.log(`Error to connect to mongodb: ${err}`));

app.use((req, res, next) => {
    console.log(req.method, req.url, req.body);
    next();
});

const base_route = '/api/v1';

const subusersRoutes = require('./routes/subusers');
const usersRoutes = require('./routes/users');
const appsRoutes = require('./routes/apps');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
app.use(base_route + '/subusers', subusersRoutes);
app.use(base_route + '/users', usersRoutes);
app.use(base_route + '/apps', appsRoutes);
app.use(base_route + '/auth', authRoutes);
app.use(base_route + '/admin', adminRoutes);

const publicRoutes = require('./routes/public/routes');
app.use('/auth', publicRoutes);

process
    .setMaxListeners(0)
    .on("uncaughtException", err => console.error(err))
    .on("unhandledRejection", err => console.error(err));
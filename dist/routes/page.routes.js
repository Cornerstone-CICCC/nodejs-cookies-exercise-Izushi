"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const auth_middleware_1 = require("../middleware/auth.middleware");
const pageRouter = (0, express_1.Router)();
const users = [
    { id: (0, uuid_1.v4)(), username: 'admin', password: 'admin12345' },
];
// Routes
// Home page
pageRouter.get('/', (req, res) => {
    res.status(200).render('index');
});
// Login page
pageRouter.get('/login', (req, res) => {
    res.status(200).render('login');
});
// Login logic
pageRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.status(404).redirect('/login');
        return;
    }
    res.cookie('isLoggedIn', true, {
        httpOnly: true,
        maxAge: 60 * 1000,
        signed: true
    });
    res.cookie('username', username, {
        httpOnly: true,
        maxAge: 60 * 1000,
        signed: true
    });
    res.status(201).redirect('/profile');
});
// Logout logic
pageRouter.get('/logout', (req, res) => {
    res.clearCookie('isLoggedIn');
    res.clearCookie('username');
    res.status(301).redirect('/login');
});
pageRouter.get('/check', (req, res) => {
    const { username } = req.signedCookies;
    res.status(200).json({ username });
});
// Protected Profile page
pageRouter.get('/profile', auth_middleware_1.checkAuth, (req, res) => {
    res.status(200).render('profile');
});
exports.default = pageRouter;

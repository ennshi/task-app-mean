const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/adminAuth');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail } = require('../emails/account');

router.get('/api/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.get('/api/users/all', auth, (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((e) => {
        res.status(500).send();
    });
});

router.post('/api/users', async (req, res) => {
    const user = new User(req.body);

    try {
        const token = await user.generateAuthToken();
        // sendWelcomeEmail(user.email, user.name);
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/api/users/login', async (req, res) => {
    try {
       const user = await User.findByCredentials(req.body.email, req.body.password);
       const token = await user.generateAuthToken();
       res.send({user, token});
    } catch(e) {
        res.status(400).send(e);
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|png|jpeg$)/)){
            return cb(new Error('Please upload right format.'))
        }
        cb(undefined, true);
    }
});

router.post('/api/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message});
});

router.post('/api/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/api/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

router.patch('/api/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const reqUpdates = Object.keys(req.body);
    const isValidUpdate = reqUpdates.every((field) => allowedUpdates.includes(field));
    if(!isValidUpdate) {
        return res.status(400).send({error: "Invalid updates"});
    }
    try {
        // const user = await User.findById(req.params.id);
        reqUpdates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.status(400).send();
    }
});

router.delete('/api/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch(e) {
        res.status(500).send();
    }
});

router.delete('/api/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = '';
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

router.delete('/api/admin/users/:id', authAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            throw new Error();
        }
        await user.remove();
        res.send(req.user);
    } catch(e) {
        res.status(404).send();
    }
});

router.get('/api/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch(e) {
        res.status(404).send();
    }
});

module.exports = router;

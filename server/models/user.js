const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email isn\'t valid');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be positive');
            }
        }
    },
    password: {
        type: String,
        minlength: 7,
        trim: true,
        required: true,
        validate(value) {
            if(value.toLowerCase() === 'password') {
                throw new Error('Password shouldnt be "password"');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    },
    role: {
        type: String,
        required: true,
        default: 'client'
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};


userSchema.methods.generateAuthToken = async function() {
    const expiration = 60*60*24;
    const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET, {expiresIn: expiration});

    this.tokens = this.tokens.concat({ token });

    await this.save();

    return {token, expiration};
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
};
//Hash the plain text password
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

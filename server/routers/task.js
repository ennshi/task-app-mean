const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth');

router.get('/api/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id});
        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(e) {
        res.status(500).send();
    }
});

//GET/tasks?limit=2&skip=0
//GET/tasks?sortBy=createdAt:desc
//GET/tasks?completed=false

router.get('/api/tasks', auth, async (req, res) => {
    //const tasks = await Task.find({ owner: req.user._id });
    const match = {};
    const sort = {};

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    if(req.query.completed) {
        match.completed = !!req.query.completed;
    }
    await req.user.populate(
        {
           path: 'tasks',
           match,
            options: {
               limit: parseInt(req.query.limit),
                skip:  parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
    try {
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send();
    }
});

router.get('/api/tasksNumber', auth, async (req, res) => {
  const match = {completed : false};
  await req.user.populate({
    path: 'tasks',
    match,
  }).execPopulate();
  try {
    res.send({noncompleted: req.user.tasks.length,
      urgent: req.user.tasks.filter(task => task.priority === 2).length});
  } catch(e) {
    res.status(500).send();
  }
});

router.post('/api/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.patch('/api/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed', 'priority'];
    const reqUpdates = Object.keys(req.body);
    const isValidUpdate = reqUpdates.every((field) => allowedUpdates.includes(field));
    if(!isValidUpdate) {
        return res.status(400).send({error: "Invalid updates"});
    }
    try{
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});
        if(!task) {
            return res.status(404).send();
        }
        reqUpdates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch(e) {
        res.status(400).send();
    }
});


router.delete('/api/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(e) {
        res.status(500).send();
    }
});

module.exports = router;

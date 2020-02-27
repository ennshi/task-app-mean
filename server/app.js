const express = require('express');
const bodyParser = require('body-parser');
require('./db/mongoose');
const path = require('path');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.static(path.join(__dirname, '../dist/mean-task-app')));

app.use(express.json());
app.use(bodyParser.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;

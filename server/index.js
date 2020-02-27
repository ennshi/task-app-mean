const app = require('./app');

const port = process.env.PORT;
//CORS Middleware
app.use(function (req, res, next) {
//Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
    next();
});

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});



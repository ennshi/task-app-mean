const auth = require('./auth');
const adminAuth = async (res, req, next) => {
    try {
        await auth(res, req, next).next(() => {
            if(req.user.role !== 'admin') {
                throw new Error();
            }
        });
        next();
    } catch (e) {
        res.status(401).send({error: 'Please authenticate as Admin'});
    }
};

module.exports = adminAuth;

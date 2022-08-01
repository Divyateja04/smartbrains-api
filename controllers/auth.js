const redisClient = require('./signin').redisClient;

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization){
        return res.status(400).json("Unauthorized");
    }

    return redisClient.get(authorization)
    .then(redisReply => {
        console.log("You shall pass");
        return next();
    })
    .catch(err => res.status(400).json(err))
}

module.exports = {
    requireAuth: requireAuth
}
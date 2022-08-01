const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis redisClient Error', err));

redisClient.connect()
.then(() => {
    console.log('Redis connected');
})
.catch(console.log)

// redisClient.set("test", "test")
// .then(() => {
//     console.log("Value Set :)");
// }).catch(console.log);

const handleSignin = (db, bcrypt, req, res) => {  
    const { email, password } = req.body;  
    if(!email || !password ){
        return Promise.reject("Incorrect format of credentials received");
    }   
    return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        // console.log(data[0]);
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid){
            return db.select('*').from("users").where('email', '=', email)
            .then(user => user[0])
            .catch(err => Promise.reject("Unable to get user"))
        } else {
            Promise.reject("Wrong Credentials");
        }
    })
    .catch(err => Promise.reject("Database Error"))
}

const signToken = (email) => {
    const jwtPayload = {email};
    return jwt.sign(jwtPayload, process.env.JWTSECRET, {
        expiresIn: '2 days'
    });
}

const setToken = (key, value) => {
    return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => { 
            return {success: 'true', userId: id, token: token} 
        })
        .catch(console.log)
}

const getAuthTokenId = (req, res) => {
    console.log("Getting Auth Token");
    const { authorization } = req.headers;
    redisClient.get(authorization)
    .then(result => res.json({id: result}))
    .catch(err => res.status(400).json(err))
}

const handleSignInAuth = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenId(req, res) : 
    handleSignin(db, bcrypt, req, res)
    .then(data =>{
        return data.id && data.name ? createSessions(data) : Promise.reject(data);
    })
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err))
}

module.exports = {
    handleSignin: handleSignin,
    handleSignInAuth: handleSignInAuth,
    redisClient: redisClient
 }
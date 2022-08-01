const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

require('dotenv').config()

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/auth');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: false
      // {
      //   rejectUnauthorized: false
      // },
    }
  });

const app = express();

// console.log(process.env)

app.use(morgan('combined'))
app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
   res.send("Success");
})

app.post('/signin', signin.handleSignInAuth(db, bcrypt));

app.post('/register', register.handleRegister(db, bcrypt));

app.get('/profile/:id', auth.requireAuth,  profile.handleProfile(db))

app.post('/profile/:id', auth.requireAuth, profile.handleProfileUpdate(db))

app.put('/image', auth.requireAuth, image.handleImage(db))

app.post('/imageurl', auth.requireAuth, (req, res) => {image.handleApiCall(req, res)})

app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`);
});

/*
/ --> res --> this is working
/signin --> POST --> success or failure
/register --> POST --> user object
/profile/:userid --> GET --> user
/image --> POST --> updates score and returns updated score
*/
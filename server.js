const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const PORT = process.env.PORT || 3000;

const db = knex({
    client: 'pg',
    connection: {
      host : 'postgresql-parallel-41136',
      port : 5432,
      user : 'postgres',
      password : 'password',
      database : 'smartbrains'
    }
  });

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
   res.send("Success");
})

app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', register.handleRegister(db, bcrypt));

app.get('/profile/:id', profile.handleProfile(db))

app.put('/image', image.handleImage(db))

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(PORT, ()=>{
    console.log(`app is running on port ${PORT}`);
});

/*
/ --> res --> this is working
/signin --> POST --> success or failure
/register --> POST --> user object
/profile/:userid --> GET --> user
/image --> POST --> updates score and returns updated score
*/
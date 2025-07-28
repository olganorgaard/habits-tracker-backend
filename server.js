const express = require('express');
const app = express();
const habitRoutes = require('./routes/HabitRoutes')
const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");

const mongoose = require('mongoose');
require('dotenv').config();

// CORS
const corsOptions = {
  origin: 'https://habits-tracker-app.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

// JWT Middleware to protect API
const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-u7wkmz1i4463mun8.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://my-habit-tracker-api', 
  issuer: 'https://dev-u7wkmz1i4463mun8.us.auth0.com/',
  algorithms: ['RS256'],
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.error('🔴 UnauthorizedError:', err.message);
    return res.status(401).send({ message: 'Unauthorized: Please log in.' });
  }
  next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Protected routes
app.use('/habits',checkJwt, habitRoutes);

// Optional root route
app.get('/', (req, res) => {
  if (req.oidc && req.oidc.isAuthenticated()) {
    res.send(`Hello, ${req.oidc.user.name}`);
  } else {
    res.send('Welcome! <a href="/login">Login</a>');
  }
});


// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose
.connect(process.env.MONGODB_LINK)
.then(() => console.log('We were connected to Mongo'))
.catch((err) =>console.log(err))

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`I am listening on PORT ${PORT}`)
})
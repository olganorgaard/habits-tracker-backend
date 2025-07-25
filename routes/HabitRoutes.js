const { Router } = require('express');

// const { auth } = require('express-openid-connect');
// const { auth: checkJwt } = require('express-oauth2-jwt-bearer');
// require('dotenv').config();
const router = Router();
// const requiresAuth = require('../middleware/requiresAuth');
const habitController = require('../controllers/HabitController');

//  middleware JWT
// const jwtCheck = checkJwt({
//   audience: process.env.AUTH0_AUDIENCE,
//   issuerBaseURL: process.env.AUTH0_DOMAIN,
//   tokenSigningAlg: 'RS256'
// });

// Get all habits for the logged-in user (JSON response)
// router.get('/', requiresAuth, habitController.getHabits);
router.get('/', habitController.getHabits);

// Create a new habit
// router.post('/', habitController.createHabit);
router.post('/', habitController.createHabit);
// router.post('/', requiresAuth, habitController.createHabit);
// router.post('/', jwtCheck, habitController.createHabit);

//Update Habit
// router.put('/:id', requiresAuth, habitController.updateHabit);
router.put('/:id', habitController.updateHabit);

// Mark a habit as completed for today
// router.post('/:id/check', requiresAuth, habitController.markHabitComplete);
router.post('/:id/check', habitController.markHabitComplete);

// Delete a habit
// router.delete('/:id', requiresAuth, habitController.deleteHabit);
router.delete('/:id', habitController.deleteHabit);


module.exports = router;
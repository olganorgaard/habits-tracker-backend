const { Router } = require('express');
const router = Router();
const habitController = require('../controllers/HabitController');

router.get('/', habitController.getHabits);
router.post('/', habitController.createHabit);

//Update Habit
router.put('/:id', habitController.updateHabit);

// Mark a habit as completed for today
router.post('/:id/check', habitController.markHabitComplete);

// Delete a habit
router.delete('/:id', habitController.deleteHabit);

module.exports = router;
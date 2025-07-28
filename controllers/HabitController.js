const HabitModel = require('../model/HabitModel');

// GET habits for the logged-in user (Auth0 user)
module.exports.getHabits = async (req, res) => {
  try {
    const userId = req.auth?.sub; // Auth0 user ID
    const habits = await HabitModel.find({ userId });
    res.send(habits);
  } catch (err) {
    console.error('Error fetching habits:', err);
    res.status(500).send({ error: 'Failed to fetch habits' });
  }
};

// POST a new habit
module.exports.createHabit = async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const { name, goal } = req.body;

    const newHabit = new HabitModel({
      userId,
      name,
      goal,
      history: [],
    });

    await newHabit.save();
    res.status(201).send(newHabit);
  } catch (err) {
    console.error('Error creating habit:', err);
    res.status(500).send({ error: 'Failed to create habit' });
  }
};

// PUT /habits/:id - Update habit name or goal
module.exports.updateHabit = async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const habitId = req.params.id;
    const { name, goal } = req.body;

    const updatedHabit = await HabitModel.findOneAndUpdate(
      { _id: habitId, userId },
      { $set: { name, goal } },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ message: 'Habit not found or not authorized' });
    }

    res.status(200).json(updatedHabit);
  } catch (err) {
    res.status(500).json({ message: 'Error updating habit', error: err });
  }
};

// Mark habit as completed for today
module.exports.markHabitComplete = async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const habit = await HabitModel.findOne({ _id: req.params.id, userId });

    if (!habit) return res.status(404).send({ error: 'Habit not found' });

    const today = new Date().toISOString().split('T')[0];
    const alreadyMarked = habit.history.find(entry => entry.date === today);

    if (!alreadyMarked) {
      habit.history.push({ date: today, completed: true });
      await habit.save();
    }

    res.send(habit);
  } catch (err) {
    console.error('Error updating habit:', err);
    res.status(500).send({ error: 'Failed to mark habit complete' });
  }
};

// Delete a habit
module.exports.deleteHabit = async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const result = await HabitModel.deleteOne({ _id: req.params.id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Habit not found or not authorized' });
    }

    res.send({ message: 'Habit deleted successfully' });
  } catch (err) {
    console.error('Error deleting habit:', err);
    res.status(500).send({ error: 'Failed to delete habit' });
  }
};

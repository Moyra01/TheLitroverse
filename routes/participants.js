const express = require('express');
const router = express.Router();

// Mock database (replace with actual database integration)
let participants = [];

// Route for registering a participant
router.post('/register', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    const newParticipant = { id: participants.length + 1, name, email };
    participants.push(newParticipant);
    res.status(201).json({ message: 'Participant registered successfully!', participant: newParticipant });
});

// Route for getting all participants
router.get('/participants', (req, res) => {
    res.json(participants);
});

module.exports = router;
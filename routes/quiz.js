const express = require('express');
const router = express.Router();

// Sample quiz questions
const questions = [
    { id: 1, question: 'What is the capital of France?', options: ['Paris', 'Rome', 'Berlin', 'Madrid'], answer: 'Paris' },
    { id: 2, question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: '4' },
    { id: 3, question: 'What is the capital of Japan?', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'], answer: 'Tokyo' }
];

// Get all questions
router.get('/questions', (req, res) => {
    res.json(questions);
});

// Check answer
router.post('/answer', (req, res) => {
    const { questionId, selectedOption } = req.body;
    const question = questions.find(q => q.id === questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    const isCorrect = question.answer === selectedOption;
    res.json({ correct: isCorrect });
});

// Calculate score
router.post('/score', (req, res) => {
    const { answers } = req.body; // answers should be an array of objects { questionId, selectedOption }
    let score = 0;
    answers.forEach(({ questionId, selectedOption }) => {
        const question = questions.find(q => q.id === questionId);
        if (question && question.answer === selectedOption) {
            score++;
        }
    });
    res.json({ score });
});

module.exports = router;
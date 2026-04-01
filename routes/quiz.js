const express = require('express');
const router = express.Router();

const questions = [
  // Easy to Go
  { id: 1, question: "Ezekiel saw visions of God by the river ______.", answer: "Chebar" },
  { id: 2, question: "Ezekiel was among the exiles in the land of the ______.", answer: "Chaldeans" },
  { id: 3, question: "Ezekiel was the son of ______.", answer: "Buzi" },
  { id: 4, question: "The creatures Ezekiel saw had the likeness of a ______.", answer: "Man" },
  { id: 5, question: "Each creature had ______ wings.", answer: "Four" },
  { id: 6, question: "The appearance of the creatures was like burning ______.", answer: "Coals of fire" },

  // Minimum Thinking
  { id: 7, question: "Each living creature had ______ faces.", answer: "Four" },
  { id: 8, question: "One face was the face of a man, another the face of a ______.", answer: "Lion" },
  { id: 9, question: "The creatures moved straight ______.", answer: "Forward" },
  { id: 10, question: "The spirit lifted Ezekiel up and he heard behind him the sound of a great ______.", answer: "Earthquake" },
  { id: 11, question: "Ezekiel was commanded to eat a ______.", answer: "Scroll" },
  { id: 12, question: "The scroll was written on the front and on the ______.", answer: "Back" },

  // Maximum Thinking
  { id: 13, question: "The likeness of the firmament above the heads of the living creatures was like the color of ______.", answer: "Crystal" },
  { id: 14, question: "The wheels were full of ______ all around.", answer: "Eyes" },
  { id: 15, question: "When Ezekiel ate the scroll, it was in his mouth as sweet as ______.", answer: "Honey" },
  { id: 16, question: "God made Ezekiel’s forehead harder than ______.", answer: "Flint" },
  { id: 17, question: "Ezekiel was told not to be afraid of their words or of their ______.", answer: "Looks" },
  { id: 18, question: "The Spirit entered into Ezekiel and set him upon his ______.", answer: "Feet" },

  // Crack My Head
  { id: 19, question: "The wheels beside the living creatures were described as a wheel within a ______.", answer: "Wheel" },
  { id: 20, question: "The sound of the wings of the living creatures was like the voice of ______.", answer: "The Almighty" },
  { id: 21, question: "The appearance of the throne was like ______.", answer: "Sapphire" },
  { id: 22, question: "Ezekiel sat overwhelmed among the exiles at Tel‑abib for ______ days.", answer: "Seven" },
  { id: 23, question: "Ezekiel was told he would be made dumb and unable to speak until God opened his ______.", answer: "Mouth" },
  { id: 24, question: "Ezekiel was commanded to speak only when given a ______.", answer: "Word" },

  // Granite Hard
  { id: 25, question: "The throne above the firmament had the appearance of ______.", answer: "Sapphire" },
  { id: 26, question: "The likeness seated upon the throne had the appearance of a ______.", answer: "Man" },
  { id: 27, question: "The brightness around the throne was like the appearance of a ______ in the clouds.", answer: "Rainbow" },
  { id: 28, question: "Ezekiel was appointed as a ______ to the house of Israel.", answer: "Watchman" },
  { id: 29, question: "If the watchman fails to warn the wicked, their blood will be required at the watchman’s ______.", answer: "Hand" },
  { id: 30, question: "Ezekiel was told he must not be rebellious like the ______.", answer: "House of Israel" }
];

// Get all questions
router.get('/questions', (req, res) => {
    res.json(questions);
});

// Check answer (case-insensitive, trims spaces)
router.post('/answer', (req, res) => {
    const { questionId, selectedOption } = req.body;
    const question = questions.find(q => q.id === questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    const isCorrect = question.answer.toLowerCase().trim() === selectedOption.toLowerCase().trim();
    res.json({ correct: isCorrect });
});

// Calculate score (case-insensitive, trims spaces)
router.post('/score', (req, res) => {
    const { answers } = req.body; // answers should be an array of objects { questionId, selectedOption }
    let score = 0;
    answers.forEach(({ questionId, selectedOption }) => {
        const question = questions.find(q => q.id === questionId);
        if (question && question.answer.toLowerCase().trim() === selectedOption.toLowerCase().trim()) {
            score++;
        }
    });
    res.json({ score });
});

module.exports = router;

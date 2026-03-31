-- ============================
-- Initial Database Schema
-- Project: Bible Quiz Website
-- ============================

-- Users table: quiz participants and admins
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'player', -- player, admin
    created_at TIMESTAMP DEFAULT NOW()
);

-- Questions table: Bible quiz questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50), -- e.g. Old Testament, Gospels
    difficulty VARCHAR(20), -- easy, medium, hard
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option CHAR(1) NOT NULL -- A, B, C, or D
);

-- Responses table: what each user answered
CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    chosen_option CHAR(1) NOT NULL,
    is_correct BOOLEAN,
    answered_at TIMESTAMP DEFAULT NOW()
);

-- Scores table: summary of quiz attempts
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    percentage NUMERIC(5,2),
    taken_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- Indexes for performance
-- ============================
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_responses_user_id ON responses(user_id);

-- ============================
-- Sample seed data (optional)
-- ============================
INSERT INTO users (username, email, password_hash, role)
VALUES ('moyra', 'moyra@example.com', 'hashed_password_here', 'admin');

INSERT INTO questions (category, difficulty, question_text, option_a, option_b, option_c, option_d, correct_option)
VALUES ('Gospels', 'easy', 'Who baptized Jesus in the Jordan River?', 
        'Peter', 'John the Baptist', 'Paul', 'Moses', 'B');

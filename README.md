# Bible Quiz Application

## Overview
The Bible Quiz Application is designed to help users enhance their knowledge of the Bible through interactive quizzes. It presents questions related to various biblical topics, allowing users to test and improve their understanding of scripture.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/Moyra01/TheLitroverse.git
   ```
2. Navigate to the project directory:
   ```bash
   cd TheLitroverse
   ```
3. Install the necessary dependencies:
   ```bash
   npm install
   ```
4. Set up the database:
   - Create a new PostgreSQL database.
   - Run the database migrations to set up the schema:  
     ```bash
     npm run migrate
     ```
5. Start the application:
   ```bash
   npm start
   ```

## Database Schema
The database consists of the following main tables:
- **Users**: Stores information about the users of the application, including username and hashed password.
- **Quizzes**: Contains the quizzes available to users, including title and description.
- **Questions**: Holds individual questions, linked to quizzes.
- **Answers**: Stores possible answers for each question, including the correct answer flag.

## Project Structure
```
TheLitroverse/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── tests/
├── config/
├── migrations/
└── package.json
```
- **src/**: Contains the core application logic.
- **tests/**: Includes test suites for the application.
- **config/**: Holds configuration files for different environments.
- **migrations/**: Contains database migration scripts.
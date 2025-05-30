# ThinkAI Platform

ThinkAI is an AI learning and challenge platform designed to help students and teams collaborate on AI projects and challenges.

## Features

- User authentication and role-based access control (admin, mentor, team)
- Challenge creation and management
- Team collaboration tools
- Project submission and validation

## Project Structure

The project is divided into two main parts:

- **Backend**: Node.js API with Express and MongoDB
- **Frontend**: React application with modern UI components

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration values

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Scripts

The repository contains several utility scripts in the `backend/src/scripts` directory:

- `createAdmin.js`: Creates an admin user
- `createMentor.js`: Creates mentor accounts from a CSV file
- `createTeams.js`: Creates team accounts from a CSV file

For security reasons, sensitive data files are not included in the repository. Template files are provided that show the required format.

## Configuration

All sensitive configuration is managed through environment variables. See `.env.example` for required variables.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

### Attribution Requirement

When using ThinkAI Platform for hackathons, events, or other public uses, attribution must be provided:

```
Powered by ThinkAI Platform - https://github.com/1337-Artificial-Intelligence/thinkai_main
```

This attribution must be visible in the user interface, documentation, and any promotional materials for the event or hackathon.

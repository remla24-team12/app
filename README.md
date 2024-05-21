# Project Setup and Run Guide

This project is a JavaScript application that uses npm and Vue.js. It is containerized using Docker and has a CI/CD pipeline set up using GitHub Actions.

## Prerequisites

- Docker installed on your machine.
- Node.js and npm installed on your machine.
- Git installed on your machine.

## Setup

1. Clone the repository to your local machine using Git:

```bash
git clone https://github.com/remla24-team12/app.git
```

2. Install NPM packages for fronted and backend. 

In the backend folder in .npmrc, replace the AUTH_TOKEN with the REMLA_SECRET from the repo

Run the following commands in the terminal inside the project directory:

```bash
cd frontend
npm install
```
   
```bash
cd backend
npm install
```

## Running the Application

1. Build and start the Docker containers:

```bash
docker-compose up --build -d
```

This command will build the Docker images if they don't exist and start the containers in detached mode.

2. You can check the running containers with:

```bash
docker ps
```

The application should now be running and accessible on the ports defined in the `docker-compose.yml` file.

Frontend: http://localhost:8080/

Backend: http://localhost:3000/

## GitHub Actions CI/CD

The project uses GitHub Actions for continuous integration. The workflow is defined in the `.github/workflows/ci.yml` file.

On every push or pull request to the `main` branch, the workflow:

- Checks out the code.
- Sets up Docker Buildx.
- Builds and runs the Docker Compose.
- Checks the running containers.
- Cleans up by bringing down the Docker Compose.

## Ignored Files

The `.gitignore` file specifies files that Git should ignore. In this project, IntelliJ IDEA project files (`*.iml`, `.idea`) are ignored.

Please note that you might need to adjust the setup and run instructions based on the specific requirements of your project.
# Backend Application - Auction System

This is the backend application for an auction system built with TypeScript and NestJS. It handles bid placement, real-time updates via WebSocket, and database interactions.

---

## Table of Contents
1. [Running the Application Locally](#running-the-application-locally)
2. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
3. [Approach to the Problem](#Approach-to-the-Problem)


---

## Running the Application Locally

Follow these steps to run the application locally:

## 1. Clone the Repository
Clone the repository to your local machine:

git clone https://github.com/saqibalimian/AUCTION-BACKEND.git
cd AUCTION-BACKEND

## Install Dependencies
npm install

### Set Up Environment Variables
API_URL=http://localhost:3000 # Backend API URL
WS_URL=wss://localhost:3000 # Backend websocket

Replace http://localhost:3000 with the actual URL of your backend API if it's hosted elsewhere.
The .env file is used to store sensitive or environment-specific configuration values.

### Start the Development Server
 npm start

Runs the app 
Open [http://localhost:3000] to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.





### Run with Docker 
Build the Docker image

docker build -t frontend-app .

Run the Docker container

docker run -p 80:80 frontend-app

Open http://localhost in your browser to access the app.


### CI/CD Pipeline Setup

The CI/CD pipeline automates testing, building, and deploying the frontend application. It uses GitHub Actions to:

Run tests.
Build a Docker image.
Push the image to Docker Hub.
Deploy the application to Render.

Steps to Run the Pipeline
1. Trigger the Pipeline
Push code to the main branch or open a pull request targeting main.

2. Pipeline Workflow
The pipeline consists of the following jobs:

Test Job : Runs Jest tests to ensure code quality.
Build Job : Builds a Docker image using the Dockerfile.
Deploy Job : Pushes the Docker image to Docker Hub and triggers a deployment on Render.
3. Deployment
The application is deployed to Render as a Docker-based service.
Render pulls the latest Docker image from Docker Hub and serves it.


### Approach to the Problem

## Optimistic Locking :
Why Optimistic Locking? : To handle concurrent bid placements efficiently, we implemented optimistic locking using a version column in the Item entity. This ensures that conflicts are detected and handled gracefully without blocking other transactions unnecessarily.

## Validation and Error Handling :
Input Validation : All inputs (e.g., bid amount) are validated before processing to ensure they meet the required criteria.
Error Handling : Centralized error handling ensures consistent responses and meaningful error messages for users

## Stateless Architecture :
The backend was designed to be stateless, ensuring it can scale horizontally by adding more instances behind a load balancer.

## Enhancement 
Reduce Database Load with Redis :Store the highest bid in Redis

Implement message queues (Kafka/RabbitMQ) for async processing. If there are thousands of bids per second, avoid processing each one synchronously.

Implement rate-limiting to prevent spam bids.

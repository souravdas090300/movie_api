Movie API - README
Overview
This is a simple Express.js-based REST API that provides information about top 10 movies and allows user management. The API includes movie details, genre and director information, as well as user registration and favorite movie tracking functionality.

Features
Movie Endpoints
GET / - Welcome message

GET /movies - Returns a list of all top 10 movies

GET /movies/:title - Returns detailed information about a specific movie

GET /movies/:title/image - Returns the image URL for a specific movie

GET /genres/:name - Returns all movies of a specific genre

GET /directors/:name - Returns all movies by a specific director

User Endpoints
POST /users - Register a new user

PUT /users/:username - Update user information

POST /users/:username/movies/:movieID - Add a movie to user's favorites

DELETE /users/:username/movies/:movieID - Remove a movie from user's favorites

DELETE /users/:username - Deregister a user

Technical Details
Dependencies
Express.js - Web framework

Morgan - HTTP request logger

Body-parser - Middleware for parsing request bodies

UUID - For generating unique identifiers

Data
The API comes pre-loaded with information about 10 highly-rated movies including:

Title

Release year

Director

Genre

Poster image URL

Error Handling
The API includes basic error handling for:

Missing required fields

Duplicate usernames

Non-existent resources (404 errors)

Server errors (500 errors)

Getting Started
Install dependencies:

bash
npm install express morgan body-parser uuid
Start the server:

bash
node index.js
The API will be available at http://localhost:8080

Example Requests
Get all movies: GET /movies

Get specific movie: GET /movies/The%20Shawshank%20Redemption

Register user:

json
POST /users
{
  "username": "newuser",
  "email": "souravdas090300@gmail.com",
  "password": "securepassword"
}
Note: This is a basic demonstration API and not suitable for production use without additional security measures and proper database integration.

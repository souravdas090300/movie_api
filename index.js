const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const app = express();

app.use(bodyParser.json());
app.use(morgan("common"));
app.use(express.static("public"));

// Movies data with image URLs
const top10Movies = [
  {
    id: uuid.v4(),
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    genre: "Drama",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
  },
  {
    id: uuid.v4(),
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    genre: "Crime",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
  },
  {
    id: uuid.v4(),
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    genre: "Action",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
  },
  {
    id: uuid.v4(),
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    genre: "Crime",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
  },
  {
    id: uuid.v4(),
    title: "Forrest Gump",
    year: 1994,
    director: "Robert Zemeckis",
    genre: "Drama",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
  },
  {
    id: uuid.v4(),
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    genre: "Sci-Fi",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
  },
  {
    id: uuid.v4(),
    title: "The Matrix",
    year: 1999,
    director: "Lana & Lilly Wachowski",
    genre: "Sci-Fi",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
  },
  {
    id: uuid.v4(),
    title: "Parasite",
    year: 2019,
    director: "Bong Joon Ho",
    genre: "Thriller",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
  },
  {
    id: uuid.v4(),
    title: "Interstellar",
    year: 2014,
    director: "Christopher Nolan",
    genre: "Sci-Fi",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
  },
  {
    id: uuid.v4(),
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    director: "Peter Jackson",
    genre: "Fantasy",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
  },
];

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to my API! Use /movies for movies or /students for student data."
  );
});

// === MOVIE ROUTES ===

// Return a list of all movies
app.get("/movies", (req, res) => {
  res.json(top10Movies);
});

// Return data (including image URL) for a specific movie by title
app.get("/movies/:title", (req, res) => {
  const movie = top10Movies.find((m) => m.title === req.params.title);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send("Movie not found");
  }
});

// Return just the image URL for a specific movie
app.get("/movies/:title/image", (req, res) => {
  const movie = top10Movies.find((m) => m.title === req.params.title);
  if (movie && movie.imageUrl) {
    res.json({ imageUrl: movie.imageUrl });
  } else {
    res.status(404).send("Movie image not found");
  }
});

// Get genre by name
app.get("/genres/:name", (req, res) => {
  const genreMovies = top10Movies.filter((m) => m.genre === req.params.name);
  if (genreMovies.length > 0) {
    res.json(genreMovies);
  } else {
    res.status(404).send("Genre not found");
  }
});

// Get director by name
app.get("/directors/:name", (req, res) => {
  const directorMovies = top10Movies.filter(
    (m) => m.director === req.params.name
  );
  if (directorMovies.length > 0) {
    res.json(directorMovies);
  } else {
    res.status(404).send("Director not found");
  }
});

// === USER ROUTES ===
let users = [];

// Register a new user
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (!newUser.username || !newUser.email) {
    return res.status(400).send("Username and email are required");
  }

  const existingUser = users.find((u) => u.username === newUser.username);
  if (existingUser) {
    return res.status(400).send("Username already exists");
  }

  newUser.id = uuid.v4();
  newUser.favoriteMovies = [];
  users.push(newUser);

  res.status(201).json(newUser);
});

// Update user info
app.put("/users/:username", (req, res) => {
  const user = users.find((u) => u.username === req.params.username);
  if (!user) {
    return res.status(404).send("User not found");
  }

  const updatedData = req.body;
  if (updatedData.username) user.username = updatedData.username;
  if (updatedData.email) user.email = updatedData.email;
  if (updatedData.password) user.password = updatedData.password;

  res.json(user);
});

// Add a movie to user's favorites
app.post("/users/:username/movies/:movieID", (req, res) => {
  const user = users.find((u) => u.username === req.params.username);
  if (!user) {
    return res.status(404).send("User not found");
  }

  const movie = top10Movies.find((m) => m.id === req.params.movieID);
  if (!movie) {
    return res.status(404).send("Movie not found");
  }

  if (user.favoriteMovies.includes(req.params.movieID)) {
    return res.status(400).send("Movie already in favorites");
  }

  user.favoriteMovies.push(req.params.movieID);
  res.json(user);
});

// Remove a movie from user's favorites
app.delete("/users/:username/movies/:movieID", (req, res) => {
  const user = users.find((u) => u.username === req.params.username);
  if (!user) {
    return res.status(404).send("User not found");
  }

  const movieIndex = user.favoriteMovies.indexOf(req.params.movieID);
  if (movieIndex === -1) {
    return res.status(404).send("Movie not in favorites");
  }

  user.favoriteMovies.splice(movieIndex, 1);
  res.json(user);
});

// Deregister a user
app.delete("/users/:username", (req, res) => {
  const userIndex = users.findIndex((u) => u.username === req.params.username);
  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }

  users.splice(userIndex, 1);
  res.send(`User ${req.params.username} was deregistered`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

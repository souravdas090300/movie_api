const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  mongoose = require("mongoose"),
  Models = require("./models.js");

const app = express();

app.use(bodyParser.json());
app.use(morgan("common"));
app.use(express.static("public"));

const Movies = Models.Movie;
const Users = Models.User;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to myFlix API! Use /movies for movies or /users for user operations."
  );
});

// === MOVIE ROUTES (MongoDB) ===

// Return all movies from MongoDB
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Return all genres from MongoDB
app.get("/genres", (req, res) => {
  Movies.distinct("Genre.Name")
    .then((genres) => {
      res.status(200).json(genres);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Return all directors from MongoDB
app.get("/directors", (req, res) => {
  Movies.distinct("Director.Name")
    .then((directors) => {
      res.status(200).json(directors);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Return all actors from MongoDB
app.get("/actors", (req, res) => {
  Movies.distinct("Actors")
    .then((actors) => {
      res.status(200).json(actors);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Return all actresses from MongoDB
app.get("/actresses", (req, res) => {
  Movies.distinct("Actresses")
    .then((actresses) => {
      res.status(200).json(actresses);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Get a movie by title from MongoDB
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      if (!movie) return res.status(404).send("Movie not found");
      res.json(movie);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Get movie image by title from MongoDB
app.get("/movies/:title/image", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      if (movie && movie.ImagePath) {
        res.json({ imageUrl: movie.ImagePath });
      } else {
        res.status(404).send("Movie image not found");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Get movies by genre name from MongoDB
app.get("/genres/:name", (req, res) => {
  Movies.find({ "Genre.Name": req.params.name })
    .then((movies) => {
      if (movies.length > 0) {
        res.json(movies);
      } else {
        res.status(404).send("Genre not found");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Get director info by name from MongoDB
app.get("/directors/:name", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.name })
    .then((movie) => {
      if (movie && movie.Director) {
        res.json(movie.Director);
      } else {
        res.status(404).send("Director not found");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// === USER ROUTES (MongoDB) ===

// Return all users from MongoDB
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Register a new user
app.post("/users", async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users.create({
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Get a user by username
app.get("/users/:Username", async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      if (!user) return res.status(404).send("User not found");
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Update user info
app.put("/users/:Username", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) return res.status(404).send("User not found");
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Add a movie to a user's list of favorites
app.post("/users/:Username/movies/:MovieID", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $addToSet: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) return res.status(404).send("User not found");
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Remove a movie from user's favorites
app.delete("/users/:Username/movies/:MovieID", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) return res.status(404).send("User not found");
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Delete a user by username
app.delete("/users/:Username", async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
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

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
  Movies.distinct("genre")
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
  Movies.distinct("director")
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
  Movies.distinct("actors")
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
  Movies.distinct("actresses")
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
  Movies.findOne({ "Title.Nmae": req.params.title })
    .then((movie) => {
      if (!movie) return res.status(404).send("Movie not found");
      res.json(movie);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Get a movie by title - Fixed
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      if (!movie) return res.status(404).send("Movie not found");
      res.json(movie);
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

app.get("/directors/:name", async (req, res) => {
  try {
    // Debug 1: Verify incoming parameter
    console.log(`Searching for director: "${req.params.name}"`);

    // Case-insensitive search with spaces handled
    const searchName = req.params.name.replace(/%20/g, " ");
    const regex = new RegExp(searchName, "i");

    // Debug 2: Show the actual query being sent to MongoDB
    console.log(`MongoDB query: { director: ${regex} }`);

    const movies = await Movies.find({ director: regex });

    // Debug 3: Show raw results from MongoDB
    console.log(`Found ${movies.length} movies`, movies);

    if (movies.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Director not found",
        attemptedSearch: searchName,
      });
    }

    // Return all movies by this director with consistent structure
    res.json({
      status: "success",
      director: movies[0].director, // Name from first result
      bio: movies[0].directorBio, // Bio from first result
      filmCount: movies.length,
      films: movies.map((movie) => ({
        title: movie.title,
        year: movie.releaseYear,
        image: movie.imageURL,
        genre: movie.genre,
      })),
    });
  } catch (error) {
    console.error("Full error stack:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.get("/directors/:name", async (req, res) => {
  try {
    const movies = await Movies.find({ director: req.params.name });

    if (movies.length === 0) {
      return res.status(404).json({ message: "Director not found" });
    }

    res.json({
      director: req.params.name,
      bio: movies[0].directorBio, // Assuming same bio across all movies
      movies: movies.map((movie) => ({
        title: movie.title,
        year: movie.releaseYear,
        imageUrl: movie.imageURL,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
  await Users.findOne({ username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
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

// Get a user by username - Fixed
app.get("/users/:username", async (req, res) => {
  await Users.findOne({
    $or: [{ username: req.params.username }, { Username: req.params.username }],
  })
    .then((user) => {
      if (!user) return res.status(404).send("User not found");
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Update user info - Fixed
app.put("/users/:username", async (req, res) => {
  await Users.findOneAndUpdate(
    {
      $or: [
        { username: req.params.username },
        { Username: req.params.username },
      ],
    },
    {
      $set: {
        Username: req.body.username || req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
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

// Add a movie to favorites - Fixed
app.post("/users/:username/movies/:MovieID", async (req, res) => {
  await Users.findOneAndUpdate(
    {
      $or: [
        { username: req.params.username },
        { Username: req.params.username },
      ],
    },
    {
      $addToSet: {
        FavoriteMovies: req.params.MovieID,
        favoriteMovies: req.params.MovieID,
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

// Remove a movie from favorites - Fixed
app.delete("/users/:username/movies/:MovieID", async (req, res) => {
  await Users.findOneAndUpdate(
    {
      $or: [
        { username: req.params.username },
        { Username: req.params.username },
      ],
    },
    {
      $pull: {
        FavoriteMovies: req.params.MovieID,
        favoriteMovies: req.params.MovieID,
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

// Delete a user by username - Fixed
app.delete("/users/:username", async (req, res) => {
  await Users.findOneAndRemove({
    $or: [{ username: req.params.username }, { Username: req.params.username }],
  })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + " was not found");
      } else {
        res.status(200).send(req.params.username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Start server
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

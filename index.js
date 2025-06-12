const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("./models.js");

// Import passport modules
const passport = require("passport");
require("./passport");

const app = express();

const { check, validationResult } = require('express-validator');
check([field in req.body to validate], [error message if validation fails]).[validation method]();
check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric()


const cors = require("cors");
app.use(cors());

// if you want only certain origins to be given access, you'll need to replace with app.use(cors()); with folloed code below.
/* let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
})); */

// Initialize auth module after app is created
let authModule = require("./auth")(app);

app.use(bodyParser.json());
app.use(morgan("common"));
app.use(express.static("public"));

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Authentication middleware
const auth = passport.authenticate("jwt", { session: false });

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to myFlix API! Use /movies for movies or /users for user operations."
  );
});

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Return all genres from MongoDB
app.get("/genres", auth, async (req, res) => {
  try {
    const genres = await Movies.distinct("Genre.Name");
    res.status(200).json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Return all directors from MongoDB
app.get("/directors", auth, async (req, res) => {
  try {
    const directors = await Movies.distinct("Director.Name");
    res.status(200).json(directors);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Return all actors from MongoDB
app.get("/actors", auth, async (req, res) => {
  try {
    const actors = await Movies.distinct("Actors");
    res.status(200).json(actors);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Get a movie by title from MongoDB
app.get("/movies/:title", auth, async (req, res) => {
  try {
    const movie = await Movies.findOne({ Title: req.params.title });
    if (!movie) return res.status(404).send("Movie not found");
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Get movie image by title from MongoDB
app.get("/movies/:title/image", auth, async (req, res) => {
  try {
    const movie = await Movies.findOne({ Title: req.params.title });
    if (movie && movie.ImagePath) {
      res.json({ imageUrl: movie.ImagePath });
    } else {
      res.status(404).send("Movie image not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Get movies by genre name from MongoDB
app.get("/genres/:name", auth, async (req, res) => {
  try {
    const movies = await Movies.find({ "Genre.Name": req.params.name });
    if (movies.length > 0) {
      res.json(movies);
    } else {
      res.status(404).send("Genre not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Get director info by name from MongoDB
app.get("/directors/:name", auth, async (req, res) => {
  try {
    const movie = await Movies.findOne({ "Director.Name": req.params.name });
    if (movie && movie.Director) {
      res.json(movie.Director);
    } else {
      res.status(404).send("Director not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// === USER ROUTES (MongoDB) ===

// Return all users from MongoDB (should be protected and admin-only in production)
app.get("/users", auth, async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

app.post("/users", 
  [
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Username', 'Username is required').notEmpty(),
    check('Password', 'Password is required').notEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
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

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // CONDITION TO CHECK ADDED HERE
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    // CONDITION ENDS
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Add a movie to a user's list of favorites
app.post("/users/:Username/movies/:MovieID", auth, async (req, res) => {
  try {
    // Verify the movie exists
    const movie = await Movies.findById(req.params.MovieID);
    if (!movie) return res.status(404).send("Movie not found");

    // Only allow user to update their own favorites
    if (req.user.Username !== req.params.Username) {
      return res
        .status(403)
        .send("Not authorized to update this user's favorites");
    }

    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $addToSet: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).send("User not found");
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// Remove a movie from user's favorites
app.delete("/users/:Username/movies/:MovieID", auth, async (req, res) => {
  try {
    // Only allow user to update their own favorites
    if (req.user.Username !== req.params.Username) {
      return res
        .status(403)
        .send("Not authorized to update this user's favorites");
    }

    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).send("User not found");
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// Delete a user by username
app.delete("/users/:Username", auth, async (req, res) => {
  try {
    // Only allow user to delete their own account or admin
    if (req.user.Username !== req.params.Username) {
      return res.status(403).send("Not authorized to delete this user");
    }

    const user = await Users.findOneAndRemove({
      Username: req.params.Username,
    });
    if (!user) {
      return res.status(404).send(req.params.Username + " was not found");
    }
    res.status(200).send(req.params.Username + " was deleted.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port);
});

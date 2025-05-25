const express = require("express"),
  morgan = require("morgan");

const app = express();

const top10Movies = [
  {
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
  },
  {
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
  },
  {
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
  },
  {
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
  },
  {
    title: "Forrest Gump",
    year: 1994,
    director: "Robert Zemeckis",
  },
  {
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
  },
  {
    title: "The Matrix",
    year: 1999,
    director: "Lana & Lilly Wachowski",
  },
  {
    title: "Parasite",
    year: 2019,
    director: "Bong Joon Ho",
  },
  {
    title: "Interstellar",
    year: 2014,
    director: "Christopher Nolan",
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    director: "Peter Jackson",
  },
];

app.use(morgan("common"));

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to my Movie API! Use the /movies endpoint to see my top 10 movies."
  );
});

// GET route for the movies endpoint
app.get("/movies", (req, res) => {
  res.json(top10Movies);
});

app.use(express.static("public"));

app.get("/secreturl", (req, res) => {
  res.send("This is a secret url with super top-secret content.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

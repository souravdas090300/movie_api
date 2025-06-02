const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const app = express();

app.use(bodyParser.json());
app.use(morgan("common"));
app.use(express.static("public"));

// Movies data with image URLs, descriptions, and features
const top10Movies = [
  {
    id: uuid.v4(),
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    genre: "Drama",
    imageUrl:
      "https://c8.alamy.com/comp/2JH2MYR/robbinsposter-the-shawshank-redemption-1994-2JH2MYR.jpg",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    features: [
      "Based on Stephen King novella",
      "IMDb Top Rated #1",
      "Prison escape theme",
      "Tim Robbins and Morgan Freeman star",
    ],
  },
  {
    id: uuid.v4(),
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    genre: "Crime",
    imageUrl:
      "https://media.newyorker.com/photos/594044d90c240c2a1fd678ce/master/pass/970324_ra409.jpg",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    features: [
      "Marlon Brando's iconic performance",
      "Academy Award winner",
      "Mafia family saga",
      "Part of trilogy",
    ],
  },
  {
    id: uuid.v4(),
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    genre: "Action",
    imageUrl:
      "https://images.moviesanywhere.com/bd47f9b7d090170d79b3085804075d41/c6140695-a35f-46e2-adb7-45ed829fc0c0.jpg",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    features: [
      "Heath Ledger's Oscar-winning Joker",
      "IMAX filming techniques",
      "Complex villain psychology",
      "Sequel to Batman Begins",
    ],
  },
  {
    id: uuid.v4(),
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    genre: "Crime",
    imageUrl:
      "https://alternativemovieposters.com/wp-content/uploads/2021/04/RuizBurgos_PulpFiction.jpg",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    features: [
      "Non-linear storytelling",
      "Iconic dialogue",
      "Cult following",
      "Palme d'Or winner",
    ],
  },
  {
    id: uuid.v4(),
    title: "Forrest Gump",
    year: 1994,
    director: "Robert Zemeckis",
    genre: "Drama",
    imageUrl:
      "https://shatpod.com/movies/wp-content/uploads/Forrest-Gump-Movie-Poster-1994.jpg",
    description:
      "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.",
    features: [
      "Tom Hanks Oscar winner",
      "Historical fiction",
      "Special effects breakthroughs",
      "Heartwarming story",
    ],
  },
  {
    id: uuid.v4(),
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    genre: "Sci-Fi",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    features: [
      "Dream within a dream concept",
      "Practical effects",
      "Hans Zimmer score",
      "Open-ended conclusion",
    ],
  },
  {
    id: uuid.v4(),
    title: "The Matrix",
    year: 1999,
    director: "Lana & Lilly Wachowski",
    genre: "Sci-Fi",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnpjdxi3kHUI9rTqML8O_7_Ve87-FHFNlLHg&s",
    description:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    features: [
      "Groundbreaking bullet time effects",
      "Philosophical themes",
      "Cyberpunk aesthetic",
      "Keanu Reeves star vehicle",
    ],
  },
  {
    id: uuid.v4(),
    title: "Parasite",
    year: 2019,
    director: "Bong Joon Ho",
    genre: "Thriller",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_.jpg",
    description:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    features: [
      "First Korean Palme d'Or winner",
      "Social commentary",
      "Genre-blending",
      "Academy Award Best Picture",
    ],
  },
  {
    id: uuid.v4(),
    title: "Interstellar",
    year: 2014,
    director: "Christopher Nolan",
    genre: "Sci-Fi",
    imageUrl:
      "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    features: [
      "Scientific accuracy consulted by Kip Thorne",
      "Emotional father-daughter story",
      "Practical effects for space scenes",
      "Hans Zimmer organ score",
    ],
  },
  {
    id: uuid.v4(),
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    director: "Peter Jackson",
    genre: "Fantasy",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/4/48/Lord_Rings_Return_King.jpg",
    description:
      "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    features: [
      "11 Academy Awards",
      "Epic battle scenes",
      "Conclusion to trilogy",
      "Extensive practical and digital effects",
    ],
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

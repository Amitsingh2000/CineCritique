const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to get the data file path
const getDataFilePath = (type) => path.join(__dirname, `assets/data/${type}-movies.json`);
const getUsersFilePath = () => path.join(__dirname, 'assets/data/user-login.json');

// Function to read data from a file
const readDataFromFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file at ${filePath}:`, err);
        reject(err);
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseErr) {
          console.error('Error parsing JSON data:', parseErr);
          reject(parseErr);
        }
      }
    });
  });
};

// Function to write data to a file
const writeDataToFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Endpoint to get all users
app.get('/users', async (req, res) => {
  const filePath = getUsersFilePath();

  try {
    const users = await readDataFromFile(filePath);
    if (users && users.length > 0) {
      res.json(users);
    } else {
      res.status(404).json({ error: 'No users found' });
    }
  } catch (err) {
    console.error('Error reading file:', err.message);
    res.status(500).json({ error: 'Error reading file' });
  }
});

// Endpoint to add a new user
app.post('/add-user', async (req, res) => {
  const newUser = req.body;
  const filePath = getUsersFilePath();

  try {
    let users = await readDataFromFile(filePath);

    // Check if the user already exists
    const userExists = users.some(user => user.username === newUser.username);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    users.push(newUser);
    await writeDataToFile(filePath, users);

    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error adding user' });
  }
});

// Endpoint to update a user
app.put('/update-user/:username', async (req, res) => {
  const { username } = req.params;
  const updatedUser = req.body;
  const filePath = getUsersFilePath();

  try {
    let users = await readDataFromFile(filePath);
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    await writeDataToFile(filePath, users);

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Endpoint to delete a user
app.delete('/users/:username', async (req, res) => {
  const { username } = req.params;
  const filePath = getUsersFilePath();

  try {
    let users = await readDataFromFile(filePath);
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove the user from the array
    users.splice(userIndex, 1);
    
    // Write the updated list of users back to the file
    await writeDataToFile(filePath, users);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Endpoint to get all movies by type
app.get('/movies/:type', async (req, res) => {
  const { type } = req.params;
  const filePath = getDataFilePath(type);

  try {
    const movies = await readDataFromFile(filePath);
    if (movies && movies.length > 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: 'Movies not found' });
    }
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ error: 'Error reading file' });
  }
});

// Endpoint to get a movie by type and id
app.get('/movies/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const filePath = getDataFilePath(type);

  try {
    const movies = await readDataFromFile(filePath);
    const movie = movies.find(movie => movie.id === parseInt(id));
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ error: 'Error reading file' });
  }
});

// Endpoint to update a movie
app.put('/movies/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const updatedMovie = req.body;
  const filePath = getDataFilePath(type);

  try {
    let movies = await readDataFromFile(filePath);
    const movieIndex = movies.findIndex(movie => movie.id === parseInt(id));

    if (movieIndex === -1) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    movies[movieIndex] = updatedMovie;
    await writeDataToFile(filePath, movies);

    res.json({ message: 'Movie updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error updating movie' });
  }
});

// Endpoint to add a new movie
app.post('/movies/:type', async (req, res) => {
  const { type } = req.params;
  const newMovie = req.body;
  const filePath = getDataFilePath(type);

  try {
    // Read the existing movies
    let movies = await readDataFromFile(filePath);

    // Generate a new id for the new movie
    const newId = movies.length > 0 ? Math.max(...movies.map(movie => movie.id)) + 1 : 1;
    newMovie.id = newId;

    // Add the new movie to the list
    movies.push(newMovie);

    // Write the updated list of movies to the file
    await writeDataToFile(filePath, movies);

    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
  } catch (err) {
    console.error('Error adding movie:', err);
    res.status(500).json({ error: 'Error adding movie' });
  }
});

// Endpoint to delete a movie
app.delete('/movies/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const filePath = getDataFilePath(type);

  try {
    let movies = await readDataFromFile(filePath);
    const movieIndex = movies.findIndex(movie => movie.id === parseInt(id));

    if (movieIndex === -1) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    movies.splice(movieIndex, 1);
    await writeDataToFile(filePath, movies);

    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json({ error: 'Error deleting movie' });
  }
});
// Fallback route for invalid requests
app.use((req, res, next) => {
  res.status(404).json({ error: 'Resource not found' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

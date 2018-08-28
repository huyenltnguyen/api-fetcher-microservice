import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://huyenltnguyen.github.io',
}));

dotenv.config();

app.post('/api', (req, res) => {
  const data = req.body;
  let apiUrl = '';

  /*
    The app expects two app names: 'weather app' and 'movie search app'.

    If the app is Weather App, it will proceed if the data from the POST request
    contains a latitude and a longitude.

    If the app is Movie Search App, there are two fetch operations, either the client
    asks for data of a specific movie or a list of movies whose title matches the user input.
    In the former case, the app expects a movie id in the request data.
    In the latter case, the app expects a movie title (it's actually the user input)
    in the request data.
  */

  if (data.appName === 'weather app') {
    if (!data.latitude || !data.longitude) {
      res.json({ message: 'Missing geolocation data.' });
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&units=metric&type=accurate&APPID=${process.env.WEATHER_APP_API_KEY}`;
    }
  } else if (data.appName === 'movie search app') {
    if (data.movieId) {
      apiUrl = `https://api.themoviedb.org/3/movie/${data.movieId}?&api_key=${process.env.MOVIE_SEARCH_API_KEY}`;
    } else if (data.movieTitle) {
      apiUrl = `https://api.themoviedb.org/3/search/movie?query=${data.movieTitle}&api_key=${process.env.MOVIE_SEARCH_API_KEY}`;
    } else {
      res.json({ message: 'Missing movie id or movie title.' });
    }
  } else {
    res.json({ message: 'App not found.' });
  }

  fetch(apiUrl)
    .then(resp => resp.json())
    .then(json => res.json({
      message: 'Data successfully fetched',
      data: json,
    }))
    .catch((error) => {
      console.error(error);
      res.json({ message: 'Something went wrong.' });
    });
});

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));

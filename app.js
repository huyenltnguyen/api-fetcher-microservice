import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import CircularJSON from 'circular-json';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api', (req, res) => {
  const data = req.body;
  let apiUrl = '';

  if (data.appName === 'weather app') {
    if (!data.latitude || !data.longitude) {
      res.json({ message: 'Missing geolocation data.' });
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&units=metric&type=accurate&APPID=${process.env.WEATHER_APP_API_KEY}`;
    }
  } else {
    res.json({ message: 'App not found.' });
  }

  axios.get(apiUrl)
    .then((d) => {
      // Use circular-json package to resolve
      // the 'Converting circular structure to JSON' error
      const json = CircularJSON.stringify(d);
      res.json({
        message: 'Data successfully fetched',
        data: json,
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({ message: 'Something went wrong.' });
    });
});

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));

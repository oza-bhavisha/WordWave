const express = require('express');
const app = express();
const fs = require('fs');
const csv = require('csv-parser');

app.use(express.json());

// Defining a POST endpoint for handling temperature requests
app.post('/temperature', (req, res) => {
  const { file, name, key } = req.body;

  if (!file) {
    return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
  }

  if (!fs.existsSync(`/etc/data/${file}`)) {
    return res.status(404).json({ file, error: 'File not found.' });
  }

  if (key === 'temperature') {
    const csvStream = fs.createReadStream(`/etc/data/${file}`)
      .pipe(csv({ columns: true }));

    const filteredData = [];

    csvStream.on('data', (row) => {
      if (row.name === name) {
        filteredData.push(row);
      }
    });

    csvStream.on('end', () => {
      // Check if no data was found for the specified user
      if (filteredData.length === 0) {
        return res.status(404).json({ file, error: 'User not found in the CSV.' });
      }

      const latestTemperature = filteredData[filteredData.length - 1];
      const response = {
        file,
        temperature: parseInt(latestTemperature.temperature),
      };
      res.json(response);
    });

    csvStream.on('error', (err) => {
      console.error(err);
      res.status(500).json({ file, error: 'Error reading the file.' });
    });
  } else {
    res.status(400).json({ file, error: 'Invalid key provided.' });
  }
});

const port = 6001;
app.listen(port, () => {
  console.log(`Container 2 listening on port ${port}`);
});

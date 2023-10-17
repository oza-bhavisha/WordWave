const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const csvParser = require('csv-parser');
const axios = require('axios');

app.use(bodyParser.json());

// Define a regular expression to match a CSV pattern with header
const csvFormatRegex = /^name,latitude,longitude,temperature(\r?\n|\n\r)?[\w\s]*,-?\d+\.\d+,-?\d+\.\d+,-?\d+/;

function isCsvFormat(filePath) {
 try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  console.log("Is Valid CSV Format new: ", csvFormatRegex.test(fileContent));
  return csvFormatRegex.test(fileContent);
 } catch (error) {
  return false;
 }
}

app.post('/user-info', (req, res) => {
 const { file, name, key } = req.body;

 // Test-case 3: If the file name is not provided, return an error message
 if (!file || file.trim() === '') {
  return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
 }

 // Check if the specified file exists in the mounted directory
 const filePath = `/etc/data/${file}`;
 if (!fs.existsSync(filePath)) {
  // Test-case 2: If the file is not found, return an error message
  return res.status(404).json({ file, error: 'File not found.' });
 }

  // Check if the file cannot be parsed as CSV, and return an error message if true
 if (!isCsvFormat(filePath)) {
  return res.status(400).json({ file, error: 'Input file not in CSV format.' });
 }

 if (key === 'location') {

  // Load and parse the CSV file
  const data = [];
  fs.createReadStream(filePath)
   .pipe(csvParser())
   .on('data', (row) => {
    data.push(row);
   })
   .on('end', () => {
    // Find the latest location for the specified name
    const userLocation = data.reduce((latestLocation, row) => {
     if (row.name === name) {
      const timestamp = new Date(row.timestamp).getTime();
      if (!latestLocation || timestamp > latestLocation.timestamp) {
       latestLocation = {
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
       };
      }
     }
     return latestLocation;
    }, null);

    if (!userLocation) {
     return res.status(404).json({ file, error: 'User not found in the CSV.' });
    }

    res.json({ file, ...userLocation });
   });
 } else if (key === 'temperature') {
  // Forward the request to Container 2
  axios
   .post('http://container2:6001/temperature', { file, name, key })
   .then((response) => {
    res.json(response.data);
   })
   .catch((error) => {
    res.status(500).json({ file, error: 'Error forwarding the request to Container 2.' });
   });
 } else {
  res.status(400).json({ file, error: 'Invalid key provided.' });
 }
});

const port = 6000;
app.listen(port, () => {
 console.log(`Container 1 listening on port ${port}`);
});
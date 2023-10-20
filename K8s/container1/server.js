const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const csvParser = require('csv-writer');
const csvWriter = csvParser.createArrayCsvWriter;
const axios = require('axios');
const { Console } = require("console");


// make a new logger
const myLogger = new Console({
  stdout: fs.createWriteStream("normalStdout.txt"),
  stderr: fs.createWriteStream("errStdErr.txt"),
});

app.use(bodyParser.json());


function createJson (data) {
  const rows = data.split("\n");
  const json = [];
  rows.map((e) => {
    json.push(e.split(",").map((i) => i.trim()));
  });
  return json.filter((e, i) => i !== 0);
}

app.post('/store-file', (req, res) => {
  const { file, data } = req.body;

  if (!file || file.trim() === '') {
    return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
  }
  
  const filePath = "/Bhavisha_PV_dir/" +file; 

  try {
    const writer = csvWriter({header:["name","latitude","longitude","temprature"],path:filePath})
    writer.writeRecords(createJson(data)).then(()=>{
      return  res.json({ file, message: 'Success.' });
    }).catch(error=>{
      res.status(500).json({ file, error: 'Error while storing the file to the storage.' });
    })
   
  } catch (error) {
    res.status(500).json({ file, error: 'Invalid JSON input.' });
  }
});

app.post('/get-temperature', (req, res) => {
  const { file, name } = req.body;

  if (!file) {
    return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
  }

  const filePath = "/Bhavisha_PV_dir/" +file; 
  if(!fs.existsSync(filePath)){
    return  res.json({ file, error: 'File not found.'});
  }

  // Adding testing comment

  axios
    .post('http://container1-service:7000/get-temp', { file, name, key: 'temperature' })
    .then((response) => {
      console.log(response.data)
      res.json(response.data);
    })
    .catch((error) => {
      myLogger.error(error);
      res.json({ file, error: 'File not found.'});
    });
 
});


const port = 6000;
app.listen(port, () => {
  console.log(`Container 1 listening on port ${port}`);
});
console.log("DD")

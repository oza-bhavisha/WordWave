require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();
const port = 80;

app.use(bodyParser.json());


AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    sessionToken: process.env.sessionToken,
  });

 
// All the S3 contents are referred from the URL: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
const s3 = new AWS.S3()

const s3BucketName = 'csci5409-a2-bucket';
const fileName = 'sample';

// First API: Define the /store-data route
app.post('/store-data', async (req, res) => {
  const requestData = req.body;

    const dataToStore = requestData.data;

  const s3Params = {
    Bucket: s3BucketName,
    Key: fileName,
    Body: dataToStore
  };

  try {
    await s3.putObject(s3Params).promise();

    // Generate the publicly readable URL for the file
    const s3uri = `https://${s3BucketName}.s3.amazonaws.com/${fileName}`;

    console.log('Uploaded to S3:', s3uri);

    res.status(200).json({ s3uri });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Second API: Define the /append-data route
app.post('/append-data', async (req, res) => {
    const requestData = req.body;
    const dataToAppend = requestData.data;
  
    try {
      
      const { Body } = await s3.getObject({ Bucket: s3BucketName, Key: fileName }).promise();
      const appendedData = `${Body.toString()}${dataToAppend}`;
      
      const result = await s3
        .putObject({
          Bucket: s3BucketName,
          Key: fileName,
          Body: appendedData
        })
        .promise();
      console.log('Appended to S3:', appendedData);
      console.log(result);
      
      res.status(200).json({ found: true, result: dataToAppend });
    } catch (error) {
      console.error('Error appending to S3:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Third API: Define the /search-data route
app.post('/search-data', async (req, res) => {
    const requestData = req.body;
    const regexPattern = requestData.regex;
  
    try {
      
      const { Body } = await s3.getObject({ Bucket: s3BucketName, Key: fileName }).promise();
  
      const fileContent = Body.toString();
      const lines = fileContent.split('\n');
  
      // Search for the first line that matches the regex
      let foundLine = null;
      for (const line of lines) {
        if (line.match(new RegExp(regexPattern))) {
          foundLine = line;
          break;
        }
      }
  
      if (foundLine) {
        res.status(200).json({ found: true, result: foundLine });
      } else {
        res.status(200).json({ found: false, result: '' });
      }
    } catch (error) {
      console.error('Error searching in S3:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });  

// Fourth API: Define the /delete-file route
app.post('/delete-file', async (req, res) => {
  const requestData = req.body;
  const s3Uri = requestData.s3uri;

  try {
    const s3UrlParts = s3Uri.split('/');   
    const s3Key = s3UrlParts.slice(3).join('/');

    await s3.deleteObject({ Bucket: s3BucketName, Key: s3Key }).promise();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
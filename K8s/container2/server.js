const express = require('express');
const app = express();
const fs = require('fs');
const csv = require('csv-parse');
const {parse} = csv;
const { Console } = require("console");


// make a new logger
const myLogger = new Console({
  stdout: fs.createWriteStream("/Bhavisha_PV_dir/normalStdout.txt"),
  stderr: fs.createWriteStream("/Bhavisha_PV_dir/errStdErr.txt"),
});


app.use(express.json());



app.post('/get-temp', (req, res) => {
  const { file, name, key } = req.body;
  if (!file) { 

    return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
  }
 console.log("D")
  try{
  const filePath = "/Bhavisha_PV_dir/" + file;

    let temp = 0;

    fs.createReadStream(filePath).pipe(parse()).on("error",(e)=>{
      console.log(e)
      myLogger.error(e);

      return res.json({
        file:file,
        error:"Input file not in CSV format."
      })
    }).on("data",(d)=>{
       
      if(d[0]==name){
       
        temp = d[3]
        
      }
    }).on('end',()=>{
      console.log("Comp")


      console.log({
        file:file,temperature:parseInt(temp)
      })

      return res.json({
        file:file,temperature:parseInt(temp)
      })
    })
    console.log(7)

  }
  catch(error){
    myLogger.error(error);
    res.json({file,error:error})
  }
});

const port = 7000;
app.listen(port, () => {
  console.log(`Container 2 listening on port ${port}`);
});
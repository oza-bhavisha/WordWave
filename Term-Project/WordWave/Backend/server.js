require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const Blogs = require("./blogs");
const Users = require("./user");

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

app.use("/blog", Blogs);
app.use("/user", Users);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

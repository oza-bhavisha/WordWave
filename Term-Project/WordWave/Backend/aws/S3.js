const AWS = require("./index");
const uuid = require("uuid");

const s3 = new AWS.S3();

const bucketName = "blg-images-bhavisha";

const storeFile = async (file) => {
  const ext = file.originalname.split(".");
  const extention = ext[ext.length - 1];
  const params = {
    Bucket: bucketName,
    Key: `${uuid.v4()}.${extention}`,
    Body: file.buffer,
  };

  return await s3.upload(params).promise();
};

module.exports = { storeFile };

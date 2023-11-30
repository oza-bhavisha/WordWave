const AWS = require("./index");

const docClient = new AWS.DynamoDB.DocumentClient();

const getUserByEmail = async (email) => {
  const params = {
    TableName: "users",
    FilterExpression: "email = :e",
    ExpressionAttributeValues: {
      ":e": email,
    },
  };
  const result = await docClient.scan(params).promise();

  if (result.Items.length > 0) {
    return result.Items[0];
  } else return null;
};

const createUser = async (data) => {
  const params = {
    TableName: "users",
    Item: {
      ...data,
    },
  };
  return await docClient.put(params).promise();
};

const getPosts = async () => {
  const params = {
    TableName: "blogs",
  };

  const result = await docClient.scan(params).promise();
  return result.Items;
};

const createPost = async (data) => {
  const params = {
    TableName: "blogs",
    Item: {
      ...data,
    },
  };

  return await docClient.put(params).promise();
};

module.exports = { getPosts, createPost, createUser, getUserByEmail };

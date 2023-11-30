const AWS = require("./index");

const lambda = new AWS.Lambda();

const functionName = "adsf"; // Replace with your Lambda function name

async function InvokeLambda(event) {
  const params = {
    FunctionName: functionName,
    InvocationType: "RequestResponse", // Use 'Event' for asynchronous invocation
    Payload: JSON.stringify(event),
  };

  return await lambda.invoke(params).promise();
}

module.exports = InvokeLambda;

const AWS = require("./index");

const lambda = new AWS.Lambda();

const functionName = "compherendProcessor";

async function InvokeLambda(event) {
  const params = {
    FunctionName: functionName,
    InvocationType: "RequestResponse", 
    Payload: JSON.stringify(event),
  };

  return await lambda.invoke(params).promise();
}

module.exports = InvokeLambda;

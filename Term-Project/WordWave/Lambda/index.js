const AWS = require("aws-sdk");

const comprehend = async (document) => {
  AWS.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAZZSAVDBKX5GFH3VT",
    secretAccessKey: "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",
  });

  const comprehend = new AWS.Comprehend();

  const params = {
    Text: document,
    LanguageCode: "en",
  };

  return await comprehend.detectKeyPhrases(params).promise();
};

const dynamoDB = async (id, values) => {
  AWS.config.update({
    region: "us-east-1",
    accessKeyId: "ASIA4I4RYHGWZWPDJWEZ",
    secretAccessKey: "knE7b5YhKf0akCOmpIae6WMeFr110SdLi0OCZsMv",
    sessionToken:
      "FwoGZXIvYXdzEJr//////////wEaDHzxp+KE/YG/R4ucbCLAAaC0qoWEIqeuyH6eQ/jBkizzfTknkmrdpJLZwoXlX+j/bl4217hd0EIFci2uG7hmC1C5dNz3r0eUniz9kzYP1/HL4wLf1X4yuybVNe+Qllu9dEDOJjDy5h6Eze4LvKxDqVDi4ctRRjuaTRAMWxqMrGZomPXWZpclMn7KJAgn09z9FHY8i39CGmjiYXljN62L0ak0vradZnpP/MvUXYokYFMcNFqnC0lC2VIQfwpgfIi2xCSdKhxbPtJX+fTtZipNxyjsp5+rBjItG1kZCv16mWxoSd/KxyW2JRD03M7ZNQUfFyE2nQtWYe1Z9bRVvDIeSW88kOnW",
  });

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: "blogs",
    Key: {
      id,
    },
    UpdateExpression: "SET #searchValues = :searchValues",
    ExpressionAttributeNames: {
      "#searchValues": "searchValues",
    },
    ExpressionAttributeValues: {
      ":searchValues": values,
    },
    ReturnValues: "ALL_NEW",
  };

  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.handler = async (event) => {
  try {
    const content = event.content;
    const id = event.id;
    const title = event.title;

    const { KeyPhrases } = await comprehend(content);
    const searchValues = KeyPhrases.map((val) => val.Text);

    await dynamoDB(id, [...searchValues, title]);

    return content;
  } catch (e) {
    console.log(e);
  }
};

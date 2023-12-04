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
    accessKeyId: "ASIA3JU43KBED7TWB7AC",
    secretAccessKey: "JXkk5wQRIqxgQm89KV7E35APwJwcxGUFYBl7T8i5",
    sessionToken:
      "FwoGZXIvYXdzEPz//////////wEaDBIpNG7q8RdCpfHAbyLAAW4qFkK2o/n5Py2WaEjZn/BNyyZhjOERPGL5NdGQOlZVpH5Gb6s9SH2gL78HCc6WW/gzwBDaqBv1FlC4PECBMITgPn2D6TddBHATANel3aFBdOMmMdi4/MyuHN8nPURCWfsdbBgNz1NV+adMTezQp7TL8EZZMnr+4Hp0bhFKpO3Hqv+8Qakz0LEy1jg9lwXFdVSvGVsBqRXSt/40lvyVRSY5gHBe4CPZRTzgdIp09gUuc8T+wAP5v3VabXwGwKruYiiu/bSrBjItSfar2K8qxBWej/RcYH0C80mC/cQPBFDHFQI6U6lkbBnYlRS+cwDgFmiJSooP",
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

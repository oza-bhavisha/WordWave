const AWS = require("./index.js");
const sns = new AWS.SNS();

async function generateTopic(email, name) {
  try {
    const params = {
      Name: name,
    };
    const a = await sns.createTopic(params).promise();
    const arn = a.TopicArn;

    const params2 = {
      Protocol: "email",
      TopicArn: arn,
      Endpoint: email,
    };
    const response = await sns.subscribe(params2).promise();

    console.log(response.SubscriptionArn);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function sendEmail(name, title) {
  try {
    const { Topics } = await sns.listTopics().promise();

    const targetTopic = Topics.find((topic) => topic.TopicArn.includes(name));

    const params = {
      Message:
        "Your post has been published successfully with the title: " + title,
      TopicArn: targetTopic.TopicArn,
    };

    await sns.publish(params).promise();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function sendAlert(email, ip) {
  try {
    const { Topics } = await sns.listTopics().promise();

    const targetTopic = Topics.find((topic) =>
      topic.TopicArn.includes("Alert")
    );

    const params = {
      Message:
        "Following email has tried multiple times to login with invalid credentials. Email: " +
        email +
        " IP: " +
        ip,
      TopicArn: targetTopic.TopicArn,
    };

    await sns.publish(params).promise();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { sendEmail, generateTopic, sendAlert };

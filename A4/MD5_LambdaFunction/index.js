const crypto = require('crypto');
const axios = require('axios');

exports.handler = async (event) => {
    const { course_uri, action, value } = event;
    const hashedValue = crypto.createHash('md5').update(value, 'utf8').digest('hex');
    const response = {
        banner: "B00935827",
        result: hashedValue,
        arn: "arn:aws:lambda:us-east-1:873869288865:function:MD5_LambdaFunction",
        action: action,
        value: value
    };
    console.log(response);
    
    await axios.post(course_uri, response);
    
    return { statusCode: 200, body: JSON.stringify(response) };
};

const axios = require('axios');
const blake2b = require('blake2b');


exports.handler = async (event) => {
    const { course_uri, action, value } = event;
    console.log(event);

    // Create BLAKE2 hash
    const dataToHash=value
    const inputBuffer = Buffer.from(dataToHash, 'utf8');
    const blake2Hash = blake2b(32).update(inputBuffer).digest('hex');
    
    console.log('BLAKE2b Hash:', blake2Hash);
    const response = {
        banner: "B00935827",
        result: blake2Hash,
        arn: "arn:aws:lambda:us-east-1:873869288865:function:BLAKE2_LambdaFunction",
        action: action,
        value: value
    };
    
    console.log(response);

    // Make a POST request using axios
    await axios.post(course_uri, response);
    
    console.log("After a");

    // Return the response as a JSON string
    return { statusCode: 200, body: JSON.stringify(response) };
};

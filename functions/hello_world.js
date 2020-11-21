// https://docs.netlify.com/functions/build-with-javascript/#synchronous-function-format
exports.handler = async (event, context) => {
    let name = event.queryStringParameters.name || "World";
    
    return {
        statusCode: 200,
        body: JSON.stringify(`Hello ${name}`)
    };
}
const http = require('http');
const url = require('url');
const redis = require('redis');

// Redis connection details
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;
const redisClient = redis.createClient({
  host: dbHost,
  port: dbPort,
  password: dbPassword,
  db: dbName,
});

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Parse the URL to get the "env" query parameter
  const queryObject = url.parse(req.url, true).query;
  const env = queryObject.env;

  // Retrieve values from the Redis list using LRANGE
  redisClient.lrange(env, 0, -1, (err, result) => {
    if (err) {
      res.statusCode = 500;
      res.end(`Error retrieving value from Redis: ${err}`);
    } else {
      // Send the JSON response
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    }
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on port 3000');
});

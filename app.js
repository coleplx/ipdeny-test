const http = require('http');
const url = require('url');
const redis = require('redis');

// Redis connection information
const redisUrl = 'redis://:t5iKM7G1jJjTUV0i@ipdenyresearch-vd9xw-redis-master.ipdenyresearch-vd9xw.svc.cluster.local:6379/0';

// Create a Redis client
const redisClient = redis.createClient(redisUrl);

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Parse the query parameters from the request URL
  const { query } = url.parse(req.url, true);
  const env = query.env;

  if (!env) {
    res.statusCode = 400;
    res.end('Missing "env" parameter');
  } else {
    // Retrieve the value of the "env" key from Redis
    redisClient.get(env, (err, result) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error retrieving value from Redis: ${err}`);
      } else {
        // Parse the Redis value as JSON
        let jsonResult;
        try {
          jsonResult = JSON.parse(result);
        } catch (e) {
          jsonResult = result;
        }
        // Send the JSON response
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(jsonResult));
      }
    });
  }
});

// Start the HTTP server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

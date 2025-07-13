const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

let redisClient;

const initializeRedis = async () => {
  redisClient = redis.createClient({
    url: process.env.REDIS_URI
  });

  redisClient.on('error', (err) => console.log('Redis Client Error', err));

  await redisClient.connect();
  console.log('Redis connected');
};

const getRedisClient = () => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
};

module.exports = { initializeRedis, getRedisClient };
// index.js

// Import required packages
const { Client } = require('pg');
const Redis = require('ioredis');

// PostgreSQL configuration
const pgClient = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',      // default from your docker-compose
  password: 'postgres',  // default from your docker-compose
  database: 'app',       // default from your docker-compose
});

// Redis configuration
const redis = new Redis({
  host: 'localhost',
  port: 6378, // mapped from 6379 in Docker
});

async function checkConnections() {
  try {
    await pgClient.connect();
    console.log(' Connected to PostgreSQL');
    const res = await pgClient.query('SELECT NOW()');
    console.log('PostgreSQL Time:', res.rows[0].now);
    await pgClient.end();
  } catch (err) {
    console.error('PostgreSQL connection error:', err.message);
  }

  try {
    await redis.set('healthcheck', 'ok');
    const value = await redis.get('healthcheck');
    console.log(' Connected to Redis, value:', value);
    redis.disconnect();
  } catch (err) {
    console.error(' Redis connection error:', err.message);
  }
}

checkConnections();

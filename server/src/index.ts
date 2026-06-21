import { keys } from './keys.js';

import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { Pool } from 'pg';
import redis from 'redis';

// Express App setup
const PORT = 5001;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgress Client setup
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: Number(keys.pgPort),
  ssl:
    process.env.NODE_ENV !== 'production'
      ? false
      : { rejectUnauthorized: false },
});

pgClient.on('connect', (client) => {
  client
    .query('CREATE TABLE IF NOT EXISTS indices (number INT)')
    .catch((err) => console.error(err));
});

pgClient.on('error', () => console.error('Lost PG Connection.'));

// Redis Client setup
const redisUrl =
  process.env.REDIS_URL || `redis://${keys.redisHost}:${keys.redisPort}`;
const isTls = redisUrl.startsWith('rediss://') as any;
const redisClient = redis.createClient({
  url: redisUrl,
  socket: {
    // host: keys.redisHost,
    // port: Number(keys.redisPort),
    tls: isTls,
    rejectUnauthorized: false,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error('Retry attempts exhausted');
      }
      return 1000;
    },
  },
});

const redisPublisher = redisClient.duplicate();
// with type: module in package.json, we can use await outside of async function
await redisClient.connect();
await redisPublisher.connect(); // Remember: v4 requires manual connection

// Express route handlers

app.get('/', (req, res) => {
  res.send('Hi, API service is up and running in: ' + process.env.NODE_ENV);
});

app.get('/api/indices/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from indices');
  const flatNumbers = values.rows.map((row) => row.number);
  res.send(flatNumbers);
});

app.get('/api/indices/values', async (req, res) => {
  const values = await redisClient.hGetAll('values');
  res.send(values);
});

app.post('/api/indices', async (req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }
  redisClient.hSet('values', index, '');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO indices(number) VALUES($1)', [index]);

  res.send({ message: 'Successful' });
});

app
  .listen(PORT, () => {
    console.log(`Server listening to port: ${PORT}`);
  })
  .on('error', (error) => {
    console.error(`Server failed to start: `, error);
  });

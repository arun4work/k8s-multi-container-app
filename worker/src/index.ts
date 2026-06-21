import { keys } from './keys.js';
import redis from 'redis';

/**** To deploy worker as webservice to Render, it needs to have a port assigned to it.
 * Creating a fake server with port for that.
 * We can deploy as background workder in Render but that's paid service.
 * */
// This satisfies Render's Port Scan
import http from 'http';
const PORT = process.env.PORT || 10000;
http
  .createServer((req: any, res: any) => {
    res.writeHead(200);
    res.end('Worker Is Alive');
  })
  .listen(PORT);

console.log(`Worker heartbeat listening on ${PORT}`);
/** End of the fake server and port creation block */

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
      return 1000; // reconnect after 1 second
    },
  },
});

const sub = redisClient.duplicate();
// with type: module in package.json, we can use await outside of async function
await redisClient.connect();
await sub.connect(); // Remember: v4 requires manual connection

function fib(index: number): number {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// sub.on('message', (channel: any, message: string) => {
//   redisClient.hSet('values', message, fib(parseInt(message)));
// });

// Provide the callback as the second argument
await sub.subscribe('insert', async (message, channel) => {
  console.log(`Received message: ${message} from ${channel}`);
  const index = parseInt(message);
  await redisClient.hSet('values', message, fib(index));
});

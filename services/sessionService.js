import { createClient } from 'redis';

const client = createClient(6379);

client.on('error', (err) => console.log('Redis Client Error', err));
import 'reflect-metadata';
import { Container } from 'typedi';
import { useContainer } from 'routing-controllers';
import http from 'http';
import { router } from './router';

useContainer(Container);

const server = http.createServer((req, res) => {
  router(req, res);
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

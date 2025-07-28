import { IncomingMessage, ServerResponse } from 'http';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './repository/customer.repository';
import { getValidId } from '../../../utils/httpHandlers/validateId';

const repository = new CustomerRepository();
const service = new CustomerService(repository);
const controller = new CustomerController(service);

export async function handleCustomerRoutes(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === 'GET' && req.url === '/customers') {
    (async () => {
      try {
        const customers = await controller.getAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(customers));
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ error: `Internal server error: ${error.message}` }),
        );
      }
    })();
    return;
  }

  if (req.method === 'GET' && req.url?.includes('/customers?')) {
    const id = getValidId(req, res);
    if (!id) return;

    (async () => {
      try {
        const customer = await controller.getById(id);
        if (!customer) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Customer not found' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(customer));
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ error: `Internal server error: ${error.message}` }),
        );
      }
    })();
    return;
  }

  if (req.method === 'POST' && req.url === '/customers') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      if (!body) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Empty or invalid body' }));
        return;
      }
      let customerDto;
      try {
        customerDto = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));
        return;
      }
      try {
        const result = await controller.create(customerDto);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ error: `Internal server error: ${error.message}` }),
        );
      }
    });
    return;
  }

  if (req.method === 'PATCH' && req.url?.startsWith('/customers')) {
    const id = getValidId(req, res);
    if (!id) return;
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      if (!body) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Empty or invalid body' }));
        return;
      }
      let customerDto;
      try {
        customerDto = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));
        return;
      }
      try {
        const result = await controller.update(id, customerDto);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error: any) {
        if (error.message?.includes('not found')) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        } else {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              error: `Internal server error: ${error.message}`,
            }),
          );
        }
      }
    });
    return;
  }

  if (req.method === 'DELETE' && req.url?.startsWith('/customers')) {
    const id = getValidId(req, res);
    if (!id) return;
    (async () => {
      try {
        await controller.delete(id);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
      } catch (error: any) {
        if (error.message?.includes('not found')) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        } else {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              error: `Internal server error: ${error.message}`,
            }),
          );
        }
      }
    })();
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
}

import { IncomingMessage, ServerResponse } from 'http';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './repository/customer.repository';

const repository = new CustomerRepository();
const service = new CustomerService(repository);
const controller = new CustomerController(service);

function handleValidId(req: IncomingMessage): number | undefined {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const idParam = url.searchParams.get('id');
  if (!idParam) return undefined;
  const id = parseInt(idParam);
  return !id || isNaN(id) ? undefined : id;
}

export async function handleCustomerRoutes(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === 'GET' && req.url === '/customers') {
    (async () => {
      const customers = await controller.getAll();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(customers));
    })();

    return;
  }

  if (req.method === 'GET' && req.url?.includes('/customers?')) {
    const id = handleValidId(req);

    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing id query parameter' }));

      return;
    }

    (async () => {
      const customer = await controller.getById(id);

      if (!customer) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Customer not found' }));

        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(customer));
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
        res.end(JSON.stringify({ error: 'JSON malformado' }));

        return;
      }

      const result = await controller.create(customerDto);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      // OBS: Seria interessante retornar somente os campos com dados inseridos e
      // a data de inserção do banco, a depender do contrato esperado no front
      res.end(JSON.stringify(result));
    });

    return;
  }

  if (req.method === 'PATCH' && req.url?.startsWith('/customers')) {
    const id = handleValidId(req);
    let body = '';

    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing id query parameter' }));

      return;
    }

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      if (!id || isNaN(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid or missing ID' }));

        return;
      }

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
      const result = await controller.update(id, customerDto);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      // OBS: Seria interessante retornar somente os campos modificados e
      // a data de atualização, a depender do contrato esperado no front
      res.end(JSON.stringify(result));
    });

    return;
  }

  if (req.method === 'DELETE' && req.url?.startsWith('/customers')) {
    const id = handleValidId(req);

    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ error: 'Missing or invalid id query parameter' }),
      );

      return;
    }

    (async () => {
      const customer = await controller.delete(id);

      if (!customer) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Customer not found' }));

        return;
      }

      res.writeHead(204, { 'Content-Type': 'application/json' });
      res.end();
    })();

    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
}

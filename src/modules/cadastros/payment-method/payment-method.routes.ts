import { IncomingMessage, ServerResponse } from 'http';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodRepository } from './repository/payment-method.repository';

const repository = new PaymentMethodRepository();
const service = new PaymentMethodService(repository);
const controller = new PaymentMethodController(service);

function handleValidId(req: IncomingMessage): number | undefined {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const idParam = url.searchParams.get('id');
  if (!idParam) return undefined;
  const id = parseInt(idParam);
  return !id || isNaN(id) ? undefined : id;
}

export async function handlePaymentMethodRoutes(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === 'GET' && req.url === '/payment-methods') {
    (async () => {
      const paymentMethods = await controller.getAll();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(paymentMethods));
    })();

    return;
  }

  if (req.method === 'GET' && req.url?.includes('/payment-methods?')) {
    const id = handleValidId(req);

    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing id query parameter' }));

      return;
    }

    (async () => {
      const paymentMethod = await controller.getById(id);

      if (!paymentMethod) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'PaymentMethod not found' }));

        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(paymentMethod));
    })();

    return;
  }

  if (req.method === 'POST' && req.url === '/payment-methods') {
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

      let paymentMethodDto;

      try {
        paymentMethodDto = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'JSON malformado' }));

        return;
      }

      const result = await controller.create(paymentMethodDto);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });

    return;
  }

  if (req.method === 'PATCH' && req.url?.startsWith('/payment-methods')) {
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

      let paymentMethodDto;

      try {
        paymentMethodDto = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));

        return;
      }
      const result = await controller.update(id, paymentMethodDto);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });

    return;
  }

  if (req.method === 'DELETE' && req.url?.startsWith('/payment-methods')) {
    const id = handleValidId(req);

    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ error: 'Missing or invalid id query parameter' }),
      );

      return;
    }

    (async () => {
      const paymentMethod = await controller.delete(id);

      if (!paymentMethod) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'PaymentMethod not found' }));

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

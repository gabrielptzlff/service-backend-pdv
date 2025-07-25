import { IncomingMessage, ServerResponse } from 'http';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SalesRepository } from './repository/sales.repository';
import { ProductRepository } from '../cadastros/product/repository/product.repository';
import { SalesProductRepository } from './repository/sales-product.repository';
import { PaymentMethodRepository } from '../cadastros/payment-method/repository/payment-method.repository';
import { CustomerRepository } from '../cadastros/customer/repository/customer.repository';

const salesRepository = new SalesRepository();
const productRepository = new ProductRepository();
const salesProductRepository = new SalesProductRepository();
const paymentMethodRepository = new PaymentMethodRepository();
const customerRepository = new CustomerRepository();
const service = new SalesService(
  salesRepository,
  customerRepository,
  salesProductRepository,
  productRepository,
  paymentMethodRepository,
);
const controller = new SalesController(service);

function handleValidId(req: IncomingMessage): number | undefined {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const idParam = url.searchParams.get('id');
  if (!idParam) return undefined;
  const id = parseInt(idParam);
  return !id || isNaN(id) ? undefined : id;
}

export async function handleSalesRoutes(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === 'GET' && req.url === '/sales') {
    (async () => {
      const sales = await controller.getAll();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sales));
    })();

    return;
  }

  if (req.method === 'GET' && req.url?.includes('/sales?')) {
    const id = handleValidId(req);

    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing id query parameter' }));

      return;
    }

    (async () => {
      const sales = await controller.getById(id);

      if (!sales) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Sales not found' }));

        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sales));
    })();

    return;
  }

  if (req.method === 'POST' && req.url === '/sales') {
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

      let sales;

      try {
        sales = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));

        return;
      }

      const result = await controller.create(sales);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });

    return;
  }

  if (req.method === 'PATCH' && req.url?.startsWith('/sales')) {
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
      let salesDto;
      try {
        salesDto = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));
        return;
      }
      const result = await controller.update(id, salesDto);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
    return;
  }

  if (req.method === 'DELETE' && req.url?.startsWith('/sales')) {
    const id = handleValidId(req);

    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ error: 'Missing or invalid id query parameter' }),
      );

      return;
    }

    (async () => {
      const sales = await controller.delete(id);

      if (!sales) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Sales not found' }));

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

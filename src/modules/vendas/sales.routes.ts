import { IncomingMessage, ServerResponse } from 'http';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SalesRepository } from './repository/sales.repository';
import { ProductRepository } from '../cadastros/product/repository/product.repository';
import { SalesProductRepository } from './repository/sales-product.repository';
import { PaymentMethodRepository } from '../cadastros/payment-method/repository/payment-method.repository';
import { CustomerRepository } from '../cadastros/customer/repository/customer.repository';
import { getValidId } from '../../utils/httpHandlers/validateId';

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
    const id = getValidId(req, res);

    if (!id) return;

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
      let updateSalesDto;
      try {
        updateSalesDto = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));
        return;
      }

      try {
        const result = await controller.update(id, updateSalesDto);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error: any) {
        if (error.message === `Sale with id ${id} not found`) {
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

  if (req.method === 'DELETE' && req.url?.startsWith('/sales')) {
    const id = getValidId(req, res);

    if (!id) return;

    (async () => {
      try {
        await controller.delete(id);

        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
      } catch (error: any) {
        if (error.message === 'Sale not found') {
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

import { IncomingMessage, ServerResponse } from 'http';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repository/product.repository';
import { getValidId } from '../../../utils/httpHandlers/validateId';

const repository = new ProductRepository();
const service = new ProductService(repository);
const controller = new ProductController(service);

export async function handleProductRoutes(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === 'GET' && req.url === '/products') {
    (async () => {
      try {
        const products = await controller.getAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ error: `Internal server error: ${error.message}` }),
        );
      }
    })();
    return;
  }

  if (req.method === 'GET' && req.url?.includes('/products?')) {
    const id = getValidId(req, res);
    if (!id) return;

    (async () => {
      try {
        const product = await controller.getById(id);
        if (!product) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Product not found' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(product));
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ error: `Internal server error: ${error.message}` }),
        );
      }
    })();
    return;
  }

  if (req.method === 'POST' && req.url === '/products') {
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
      let productDto;
      try {
        productDto = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));
        return;
      }
      try {
        const result = await controller.create(productDto);
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

  if (req.method === 'PATCH' && req.url?.startsWith('/products')) {
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
      let productDto;
      try {
        productDto = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));
        return;
      }
      try {
        const result = await controller.update(id, productDto);
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

  if (req.method === 'DELETE' && req.url?.startsWith('/products')) {
    const id = getValidId(req, res);
    if (!id) return;
    (async () => {
      try {
        await controller.delete(id);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
      } catch (error: any) {
        if (error.message?.includes('associated with sales')) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        } else if (error.message?.includes('not found')) {
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

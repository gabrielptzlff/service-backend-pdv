import { IncomingMessage, ServerResponse } from 'http';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repository/product.repository';

const repository = new ProductRepository();
const service = new ProductService(repository);
const controller = new ProductController(service);

function handleValidId(req: IncomingMessage): number | undefined {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const idParam = url.searchParams.get('id');
  if (!idParam) return undefined;
  const id = parseInt(idParam);
  return !id || isNaN(id) ? undefined : id;
}

export async function handleProductRoutes(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === 'GET' && req.url === '/products') {
    (async () => {
      const products = await controller.getAll();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(products));
    })();

    return;
  }

  if (req.method === 'GET' && req.url?.includes('/products?')) {
    const id = handleValidId(req);

    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing id query parameter' }));

      return;
    }

    (async () => {
      const product = await controller.getById(id);

      if (!product) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product not found' }));

        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(product));
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
        res.end(JSON.stringify({ error: 'JSON malformado' }));

        return;
      }

      const result = await controller.create(productDto);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });

    return;
  }

  if (req.method === 'PATCH' && req.url?.startsWith('/products')) {
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

      let productDto;

      try {
        productDto = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));

        return;
      }
      const result = await controller.update(id, productDto);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });

    return;
  }

  if (req.method === 'DELETE' && req.url?.startsWith('/products')) {
    const id = handleValidId(req);

    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ error: 'Missing or invalid id query parameter' }),
      );

      return;
    }

    (async () => {
      const product = await controller.delete(id);

      if (!product) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product not found' }));

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

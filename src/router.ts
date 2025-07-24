import { IncomingMessage, ServerResponse } from 'http';
import { handleCustomerRoutes } from './modules/cadastros/customer/customer.routes';
import { handleProductRoutes } from './modules/cadastros/product/product.routes';
import { handlePaymentMethodRoutes } from './modules/cadastros/payment-method/payment-method.routes';

type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

const routes: { [key: string]: RouteHandler } = {
  '/customers': handleCustomerRoutes,
  '/products': handleProductRoutes,
  '/payment-methods': handlePaymentMethodRoutes,
};

export function router(req: IncomingMessage, res: ServerResponse) {
  const urlBase = req.url?.split('?')[0] || '';

  for (const route in routes) {
    if (urlBase.startsWith(route)) {
      return routes[route](req, res);
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
}

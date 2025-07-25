import {
  up as upCustomers,
  down as downCustomers,
} from './001-create-customers-table';
import {
  up as upProducts,
  down as downProducts,
} from './002-create-products-table';
import {
  up as upPaymentMethods,
  down as downPaymentMethods,
} from './003-create-payment-methods-table';
import { up as upSales, down as downSales } from './004-create-sales-table';
import {
  up as upSalesProducts,
  down as downSalesProducts,
} from './005-create-sales-products-table';

async function run() {
  const direction = process.argv[2]; // 'up' ou 'down'
  if (direction === 'up') {
    await upCustomers();
    await upProducts();
    await upPaymentMethods();
    await upSales();
    await upSalesProducts();
  } else if (direction === 'down') {
    await downSalesProducts();
    await downSales();
    await downPaymentMethods();
    await downProducts();
    await downCustomers();
  } else {
    console.log('Use: npm run migrate up | down');
  }
  process.exit();
}

run();

import {
  up as upCustomers,
  down as downCustomers,
} from './001_create_customers_table';
import {
  up as upProducts,
  down as downProducts,
} from './002_create_products_table';

async function run() {
  const direction = process.argv[2]; // 'up' ou 'down'
  if (direction === 'up') {
    await upCustomers();
    await upProducts();
  } else if (direction === 'down') {
    await downProducts();
    await downCustomers();
  } else {
    console.log('Use: npm run migrate up | down');
  }
  process.exit();
}

run();

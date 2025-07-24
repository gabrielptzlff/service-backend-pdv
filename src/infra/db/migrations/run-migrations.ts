import { up, down } from './001_create_customers_table';

async function run() {
  const direction = process.argv[2]; // 'up' ou 'down'
  if (direction === 'up') {
    await up();
  } else if (direction === 'down') {
    await down();
  } else {
    console.log('Use: npm run migrate up | down');
  }
  process.exit();
}

run();

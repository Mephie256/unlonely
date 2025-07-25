const { execSync } = require('child_process');

try {
  console.log('Setting up database...');
  
  // Generate Prisma client
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push database schema
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('Database setup complete!');
} catch (error) {
  console.error('Database setup failed:', error.message);
  // Don't fail the build if database setup fails
  process.exit(0);
}

const { execSync } = require('child_process');

console.log('Setting up database...');

try {
  // Try to generate Prisma client
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully');

  // Only try to push database schema in development with local database
  if (process.env.NODE_ENV !== 'production' &&
      process.env.DATABASE_URL &&
      process.env.DATABASE_URL.includes('file:')) {
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('Database schema pushed successfully');
    } catch (pushError) {
      console.warn('Database push failed, but continuing:', pushError.message);
    }
  } else {
    console.log('Skipping database push (production or no local database)');
  }

  console.log('Database setup complete!');
} catch (error) {
  console.warn('Database setup failed, app will use client-side storage fallback');
  console.warn('Error details:', error.message);
  // Don't fail the build - app will gracefully fall back to client storage
}

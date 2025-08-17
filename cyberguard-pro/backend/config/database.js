// Database configuration - In production, use PostgreSQL
async function initializeDatabase() {
  console.log('Database initialized (using in-memory for demo)');
  return Promise.resolve();
}

module.exports = { initializeDatabase };

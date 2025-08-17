function setupCronJobs(io) {
  console.log('Cron jobs initialized');
  
  // In production, set up scheduled scans, cleanup, etc.
  setInterval(() => {
    console.log('Performing periodic cleanup...');
  }, 60000); // Every minute for demo
}

module.exports = { setupCronJobs };

import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { initReminderScheduler } from './jobs/reminderJob.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Start background cron jobs
    initReminderScheduler();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  🚀 Libratech Server running on port ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Health: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

startServer();

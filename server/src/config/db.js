import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_library';

  try {
    if (uri === 'memory') {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      console.log(`[Database] Starting in-memory MongoDB at: ${memoryUri}`);
      await mongoose.connect(memoryUri);
      console.log('[Database] Connected to in-memory MongoDB successfully');
      return mongoose.connection;
    }

    console.log(`[Database] Connecting to MongoDB at: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log('[Database] MongoDB connected successfully');
    return mongoose.connection;
  } catch (err) {
    console.error(`[Database Error] Could not connect to MongoDB: ${err.message}`);
    
    // In development mode, if local MongoDB is not available, try MongoMemoryServer as fallback
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Attempting MongoMemoryServer fallback for local development...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const fallbackUri = memoryServer.getUri();
        await mongoose.connect(fallbackUri);
        console.log(`[Database] Connected to in-memory MongoDB fallback at: ${fallbackUri}`);
        return mongoose.connection;
      } catch (memoryErr) {
        console.warn(`[Database] Memory server fallback unavailable (${memoryErr.message}).`);
      }
    }

    console.warn(`
========================================================================
[MONGODB SETUP NOTICE]
MongoDB could not be reached at: ${uri}
The server will continue running and auto-retry connecting in the background.
Please make sure:
1. Local MongoDB service is running (e.g. mongod or net start MongoDB)
   OR
2. Provide a valid MongoDB Atlas connection string in server/.env:
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_library
========================================================================
`);
    
    // Background automatic reconnect loop every 5 seconds
    const retryInterval = setInterval(async () => {
      try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
        console.log('✅ [Database] MongoDB connected successfully in background!');
        clearInterval(retryInterval);
      } catch (e) {
        // Silently retry in background
      }
    }, 5000);

    return null;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('[Database Disconnect Error]', err);
  }
};

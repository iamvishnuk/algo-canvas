import app from './app';
import { connectDB } from './shared/config/DatabaseConfig';
import { EnvConfig } from './shared/config/EnvConfig';
import { logger } from './shared/utils/Logger';

const startServer = async () => {
  try {
    const server = app.listen(EnvConfig.PORT, () => {
      logger.info(
        `Server is running on port http://localhost:${EnvConfig.PORT}${EnvConfig.API_PREFIX} on ${EnvConfig.NODE_ENV} mode`
      );
    });

    await connectDB();

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any, _: Promise<any>) => {
      console.error('💥 UNHANDLED REJECTION! Shutting down...');
      console.error('Reason:', reason);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

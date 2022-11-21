import app from './app';
import prisma from './client';

const PORT = process.env.PORT ?? 3000;

prisma
  .$connect()
  .then(async () => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running at PORT: ${PORT}`);
    });
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  });

process.on('SIGTERM', () => {
  prisma
    .$disconnect()
    .then(() => {
      console.log('Database disconnected');
      process.exit(0);
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
});

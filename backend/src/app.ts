import 'dotenv/config';
import express, { type Application } from 'express';
import { connectToDB } from './libs/db';
import { globalErrorMiddleware, notFoundMiddleware } from './middlewares/base-middleware';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import https from 'https';

const app: Application = express();

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/myits-lapor';

// ------------
// SECURE SETUP
// ------------
const keyPath = path.join(__dirname, '../certs/server.key');
const certPath = path.join(__dirname, '../certs/server.crt');
const isSecure = process.env.IS_SECURE === 'true';

// ------------------
// GLOBAL MIDDLEWARES
// ------------------
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ---------------
// REGISTER ROUTES
// ---------------
import authRouter from './http/auth-http';
import reportRouter from './http/report-http';

app.use('/auth', authRouter);
app.use('/reports', reportRouter);

// --------------------
// GLOBAL ERROR HANDLER
// --------------------
app.use(notFoundMiddleware);
app.use(globalErrorMiddleware);

connectToDB(DATABASE_URL, (error) => {
  if (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
  console.log('Connected to the database successfully');

  if (isSecure) {
    const privateKey = fs.readFileSync(keyPath, 'utf8');
    const certificate = fs.readFileSync(certPath, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    https.createServer(credentials, app).listen(PORT, HOST, () => {
      console.log(`[HTTPS] Secure server is running at https://${HOST}:${PORT}`);
    });
  } else {
    app.listen(PORT, HOST, () => console.log(`[HTTP] Server is running at http://${HOST}:${PORT}`));
  }
});

process.on('SIGINT', () => {
  process.exit(0);
});

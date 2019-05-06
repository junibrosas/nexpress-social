import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import postRoutes from './routes/post.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

// Configs
const corsConfig = {
  'allowedHeaders': ['sessionId', 'Content-Type', 'Authorization', 'Accept'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTION',
  'credentials': true,
  'preflightContinue': false,
  'origin': ['http://localhost:3000']
}

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

app.use(bodyParser.json()); // parse body params and attache them to req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet()); // secure apps by setting various HTTP headers
app.use(cors(corsConfig)); // enable CORS - Cross Origin Resource Sharing

app.use('/api', postRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);

export default app;
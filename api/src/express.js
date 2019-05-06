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
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

app.use(bodyParser.json()); // parse body params and attache them to req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(cors()); // secure apps by setting various HTTP headers
app.use(helmet()); // enable CORS - Cross Origin Resource Sharing
app.use(allowCrossDomain);

app.use('/api', postRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);

export default app;
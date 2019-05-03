import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import postRoutes from './routes/post.routes';

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

app.use(bodyParser.json()); // parse body params and attache them to req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(cors()); // secure apps by setting various HTTP headers
app.use(helmet()); // enable CORS - Cross Origin Resource Sharing

app.use('/api', postRoutes);

export default app;
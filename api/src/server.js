import config from '../config/config';
import mongoose from 'mongoose';
import app from './express';

// Connection URL
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri);
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }

  console.log('Server started on port %s.', config.port);
})

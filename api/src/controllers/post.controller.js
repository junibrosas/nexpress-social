import formidable from 'formidable';
import Post from '../models/post.model';
import errorHandler from '../helpers/dbErrorHandler';
import fs from 'fs';

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    let post = new Post(fields);

    if(files.photo){
      post.photo.data = fs.readFileSync(files.photo.path)
      post.photo.contentType = files.photo.type
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }

      res.json(result);
    });
  });
}

const photo = (req, res) => {
  res.set("Content-Type", req.post.photo.contentType)
  return res.send(req.post.photo.data)
}

const postByID = (req, res, next, id) => {
  Post.findById(id).populate('postedBy', '_id name').exec((err, post) => {
    if (err || !post) {
      return res.status('400').json({
        error: 'Post not found'
      });
    }

    req.post = post;
    next();
  });
}

export default {
  create,
  postByID,
  photo
}
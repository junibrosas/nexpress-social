import express from 'express';
import postCtrl from '../controllers/post.controller';

const router = express.Router();

router.route('/posts/new').post(postCtrl.create);

router.route('/posts/photo/:postId').get(postCtrl.photo);

router.param('postId', postCtrl.postByID);

export default router;

import express from 'express';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';
import postCtrl from '../controllers/post.controller';

const router = express.Router();

router.route('/posts/new/:userId').post(authCtrl.requireSignin, postCtrl.create);
router.route('/posts/photo/:postId').get(postCtrl.photo);
router.route('/posts/by/:userId').get(authCtrl.requireSignin, postCtrl.listByUser);
router.route('/posts/feed/:userId').get(authCtrl.requireSignin, postCtrl.listNewsFeed);
router.route('/posts/like').put(authCtrl.requireSignin, postCtrl.like);
router.route('/posts/unlike').put(authCtrl.requireSignin, postCtrl.unlike);
router.route('/posts/comment').put(authCtrl.requireSignin, postCtrl.comment);
router.route('/posts/uncomment').put(authCtrl.requireSignin, postCtrl.uncomment);
router.route('/posts/:postId').delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove);

router.param('userId', userCtrl.userByID);
router.param('postId', postCtrl.postByID);

export default router;

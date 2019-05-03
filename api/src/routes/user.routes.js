import express from 'express'
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/users')
  .get(userCtrl.list)
  .post(userCtrl.create);
router.route('/users/photo/:userId').get(userCtrl.photo, userCtrl.defaultPhoto);
router.route('/users/defaultphoto').get(userCtrl.defaultPhoto);
router.route('/users/follow').put(authCtrl.requireSignin, userCtrl.addFollowing, userCtrl.addFollower);
router.route('/users/unfollow').put(authCtrl.requireSignin, userCtrl.removeFollowing, userCtrl.removeFollower);
router.route('/users/findpeople/:userId').get(authCtrl.requireSignin, userCtrl.findPeople);
router.route('/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router.param('userId', userCtrl.userByID);

export default router;

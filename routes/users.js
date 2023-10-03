const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const User = require('../models/User');
const auth = require('../middleware/auth')();
const userController = require('../controllers/userController');
const singleUpload = upload.single('image');

/* GET users listing. */
router.get('/users', auth.authenticate(), userController.users_get);
router.get('/users/:id', auth.authenticate(), userController.user_get);
router.post('/users/usernames', userController.users_username_check);
router.post('/avatar/:id', auth.authenticate(), function (req, res) {
  singleUpload(req, res, async function (err) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: 'Image Upload Error', detail: err.message }],
      });
    }
    try {
      const userDoc = await User.findByIdAndUpdate(req.params.id, {
        $set: { avatar: req.file.location },
      });
      if (userDoc) {
        return res.json({ imageUrl: req.file.location }).status(200);
      } else {
        return res.status(404);
      }
    } catch (error) {
      throw new Error(error);
    }
  });
});
router.put('/users/:id', auth.authenticate(), userController.user_put);

module.exports = router;

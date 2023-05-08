const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth')();
/* GET users listing. */
router.get('/messages', auth.authenticate(), messageController.get_messages);
router.get('/messages/:id', auth.authenticate(), messageController.get_message);
router.delete(
  '/messages/:id',
  auth.authenticate(),
  messageController.delete_message
);
router.put('/messages/:id', auth.authenticate(), messageController.put_message);

module.exports = router;

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

/* GET users listing. */
router.get('/messages', messageController.get_messages);
router.get('/messages/:id', messageController.get_message);
router.delete('/messages/:id', messageController.delete_message);
router.put('/messages/:id', messageController.put_message);

module.exports = router;

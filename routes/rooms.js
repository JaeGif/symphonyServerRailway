const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const upload = require('../middleware/uploads');
const Room = require('../models/Room');

const singleUpload = upload.single('image');

/* GET users listing. */
router.get('/rooms', roomController.rooms_get);
router.get('/rooms/:id', roomController.room_get);
router.post('/rooms', roomController.room_post);
router.post('/rooms/avatar/:id', function (req, res) {
  singleUpload(req, res, async function (err) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: 'Image Upload Error', detail: err.message }],
      });
    }
    try {
      const roomDoc = await Room.findByIdAndUpdate(req.params.id, {
        $set: { avatar: req.file.location },
      });
      if (roomDoc) {
        return res.json({ imageUrl: req.file.location }).status(200);
      } else {
        return res.status(404);
      }
    } catch (error) {
      throw new Error(error);
    }
  });
});
router.put('/rooms/:id', roomController.room_put);

module.exports = router;

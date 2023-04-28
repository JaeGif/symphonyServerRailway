const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk'),
  { S3 } = require('@aws-sdk/client-s3');
const config = require('../utilities/config');
const sharp = require('sharp');

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region: 'us-east-1',
});

const s3 = new S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'jaesymphonyreal',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}${file.originalname}`);
    },
    contentType: function (req, file, cb) {
      cb(null, file.mimetype);
    },
    transforms: [
      {
        id: 'original',
        key: function (req, file, cb) {
          cb(null, `${file.originalname}`);
        },
        transform: function (req, file, cb) {
          //Perform desired transformations
          cb(
            null,
            sharp(file)
              .resize(300, 300, {
                fit: 'inside',
              })
              .jpeg({ quality: 50 })
          );
        },
      },
    ],
  }),
});

module.exports = upload;

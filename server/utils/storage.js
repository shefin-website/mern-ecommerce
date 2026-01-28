const cloudinary = require('cloudinary').v2;
const keys = require('../config/keys');

const AWS = require('aws-sdk');

cloudinary.config({
  cloud_name: keys.cloudinary.cloudName,
  api_key: keys.cloudinary.apiKey,
  api_secret: keys.cloudinary.apiSecret
});

exports.cloudinaryUpload = async image => {
  try {
    let imageUrl = '';
    let imageKey = '';

    if (!keys.cloudinary.apiKey) {
      console.warn('Missing Cloudinary keys');
    }

    if (image) {
      const cloudinaryUpload = await cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            throw new Error(error);
          }
          imageUrl = result.secure_url;
          imageKey = result.public_id;
        }
      );

      const stream = cloudinaryUpload(image.buffer);
      stream.end(image.buffer);
    }

    return { imageUrl, imageKey };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return { imageUrl: '', imageKey: '' };
  }
};

exports.s3Upload = async image => {
  try {
    let imageUrl = '';
    let imageKey = '';

    if (!keys.aws.accessKeyId) {
      console.warn('Missing aws keys');
    }

    if (image) {
      const s3bucket = new AWS.S3({
        accessKeyId: keys.aws.accessKeyId,
        secretAccessKey: keys.aws.secretAccessKey,
        region: keys.aws.region
      });

      const params = {
        Bucket: keys.aws.bucketName,
        Key: image.originalname,
        Body: image.buffer,
        ContentType: image.mimetype
      };

      const s3Upload = await s3bucket.upload(params).promise();

      imageUrl = s3Upload.Location;
      imageKey = s3Upload.key;
    }

    return { imageUrl, imageKey };
  } catch (error) {
    return { imageUrl: '', imageKey: '' };
  }
};

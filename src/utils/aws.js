const AWS = require('aws-sdk');
const { accessId, accessKey, region, bucket } = require('../config/config').awsconfig;

// Configure AWS to use promise
AWS.config.update({
  accessKeyId: accessId,
  secretAccessKey: accessKey,
  region: region,
});

// Create an s3 instance
const s3 = new AWS.S3();

exports.imageUpload = async(file, fileName) => {
  try{
    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: file,
      // ACL: 'public-read'
      // ContentType: file.mimetype
    }
    const {Location, Key} = await s3.upload(params).promise();
    return Location;
  }catch(error){
    console.log("🚀 ~ exports.imageUpload=async ~ error:", error)
    throw error;
  }
};
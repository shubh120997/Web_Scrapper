const {
  PORT, MONGO_URI, S3_ACCESS_ID, S3_ACCESS_KEY,
  S3_REGION, S3_BUCKET
} = process.env;

console.log(S3_ACCESS_ID, S3_ACCESS_KEY,
  S3_REGION, S3_BUCKET);
if (!PORT || !MONGO_URI || !S3_ACCESS_ID || !S3_ACCESS_KEY || !S3_REGION || !S3_BUCKET) {
  throw new Error('Missing required environment variables.');
}

module.exports = {
  port: PORT,
  mongo_uri: MONGO_URI,
  awsconfig: {
    accessId: S3_ACCESS_ID,
    accessKey: S3_ACCESS_KEY,
    region: S3_REGION,
    bucket: S3_BUCKET
  }
};
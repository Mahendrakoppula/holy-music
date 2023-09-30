import mongoose from 'mongoose';
import { logger } from '@/utils/color-logger';
import { DB_NAME, MONGODB_URI } from '@/config';
const mongodb = require("mongodb");
import { MongoClient } from "mongodb";

// const dbName = 'app';
const client = new MongoClient(MONGODB_URI);
const db = client.db(DB_NAME);
const bucket = new mongodb.GridFSBucket(db, { bucketName: "songs" });

const videoBucket = new mongodb.GridFSBucket(client.db(), {
  bucketName: "videos",
});

const connection = async (uri: string, options?: mongoose.ConnectOptions) => {
  try {
    await mongoose.connect(uri, options);
    logger('success','[monogo]')(`Connected To Database`);
    // logger('error','[monogo]')(`Connected To Database`);
    // logger('success',)('Red')
    // logger('warning',)('Orange')
    // logger('error',)('Red')
  } catch (error) {
    logger('error','[monogo]')(error);
  }
};

export { connection,client,bucket, videoBucket };
// const bucket = new mongo.GridFSBucket(db, { bucketName: "songs" });

export default connection;

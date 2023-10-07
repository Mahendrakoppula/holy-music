import { MONGODB_URI } from "@config";
import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";


// Define the mongoose schema for songs

const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth() + 1;
const currentDate = date.getDate();
const currentMillis = date.getMilliseconds()+1;

// Generate a 5-digit random number
const randomNumber = Math.floor(Math.random() * 100000);

// Combine all the values into a single string
const randomValue = `${currentYear}-${currentMonth}-${currentDate}-${currentMillis}-${randomNumber}`;


// Define the GridFsStorage for audio files
export const audio = new GridFsStorage({
  url: MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = randomValue+file.originalname;
      console.log(filename);
      const fileInfo = {
        filename: filename,
        filePath: file.filename,
        bucketName: "audio",
      };
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error("File size should be less than 10MB."));
      } else {
        resolve(fileInfo);
      }
    });
  },
});

const songSchema = new mongoose.Schema({
  songname:String,
  title: String,
  artist: String,
  language: String,
  category: String,
  file: String,
  image:String,
  lyrics:String,
});

const Audio = mongoose.model('audio', songSchema); // 'Song' is the model name
export default Audio;
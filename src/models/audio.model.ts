// import { MONGODB_URI } from "@config";
// import mongoose from "mongoose";
// import { GridFsStorage } from "multer-gridfs-storage";

// export const audio = new GridFsStorage({
//     url: MONGODB_URI,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         const filename = file.originalname;
//         console.log(filename);
//         const fileInfo = {
//           filename: filename,
//           filePath : file.filename,
//           bucketName: "songs",
//           metadata: {
//             data: req.body,
//             playedAt: Date.now()
//           },
//         };
//         if (file.size > 10 * 1024 * 1024) {
//           reject(new Error("File size should be less than 10MB."));
//         } else {
//           resolve(fileInfo);
//         }
//       });
//     },
//   });

import { MONGODB_URI } from "@config";
import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import path from "path";

// Define the GridFsStorage for audio files
export const audio = new GridFsStorage({
  url: MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      console.log(filename);
      const fileInfo = {
        filename: filename,
        filePath: file.filename,
        bucketName: "songs",
        metadata: {
          data: req.body,
          // uploadedAt: Date.now(),
        },
      };
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error("File size should be less than 10MB."));
      } else {
        resolve(fileInfo);
      }
    });
  },
});

// Define the mongoose schema for songs
const songSchema = new mongoose.Schema({
  audioPath: {
    type: String,
    default: path.join(__dirname, './readFrom/GridFSSample.ogg'),
  },

  title: String,
  artist: String,
  language: String,
  category: String,
});

const Song = mongoose.model('Song', songSchema); // 'Song' is the model name
export default Song;

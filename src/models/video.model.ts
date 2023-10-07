import {videoBucket} from "@/databases/index"
import mongoose from "mongoose";



export const uploadVideo = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No video file uploaded." });
      }
  
      console.log("SUCCESS");
  
      const name = req.file?.originalname;
      const buffer = req.file?.buffer;
  
      if (!name?.match(/\.(mp4|avi|mkv|mov)$/i)) {
        return res.status(400).json({ error: "Unsupported file format." });
      }
   
  
      const start = buffer.indexOf(Buffer.from("mvhd")) + 17;
      const timeScale = buffer.readUInt32BE(start, 4);
      const _d = buffer.readUInt32BE(start + 4, 4);
      const _a = Math.floor((_d / timeScale) * 1000) / 1000;
       
      const duration = Number(_a)
  
      if(duration > 15 && duration < 50){
  
        console.log('DONE ')
      }else{
        res.status(500).send('Hey reduce the video duration')
      }
  
      const writeStream = await videoBucket.openUploadStream(name);
  
      writeStream.write(buffer);
      writeStream.end();
  
      writeStream.on("finish", async () => {
        const videoId = writeStream.id.toString();
  
        console.log(videoId);
        res.send({ ...req.body, ...req.file, buffer: undefined });
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };



  const videoSchema = new mongoose.Schema({
    title: String,
    artist: String,
    language: String,
    category: String,
  });
  
  const video = mongoose.model('video', videoSchema); // 'Song' is the model name
  
  export default video;
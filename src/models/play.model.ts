import mongoose from "mongoose";

const playSchema = new mongoose.Schema({
    userId: String,
    song: String,
    timestamp: Date,
   
  });
  
  const Play = mongoose.model('play', playSchema);
  export default  Play;
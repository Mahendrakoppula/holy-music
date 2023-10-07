import mongoose from "mongoose";

const playSchema = new mongoose.Schema({
    userId: String,
    songId: String,
    image:String,
    timestamp: Date,
   
  });
  
  const Play = mongoose.model('recentlyplayeds', playSchema);
  export default  Play;
import mongoose from "mongoose";

const favSchema = new mongoose.Schema({
    userId: String,
    songId: String,
    image:String,
    timestamp: Date,
  });
  
  const Fav = mongoose.model('favourite', favSchema);
  export default  Fav;
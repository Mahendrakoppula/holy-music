import mongoose from "mongoose";

const favSchema = new mongoose.Schema({
    userId: String,
    songId: String,
    image:String,
    timestamp: Date,
  });

  // favSchema.index({userId: 1, songId: 1}, {unique: true});
  
  const Fav = mongoose.model('favourite', favSchema);
  export default  Fav;
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'audio' }, 
    likes: 
      {
       type: Number,
       default:1,
      }
  });
  
  const Like = mongoose.model('like', likeSchema);
  export default  Like;
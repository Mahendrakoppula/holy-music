import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    userId: String,
    playlist1: [String], // An array of strings for playlist1
    playlist2: [String], // An array of strings for playlist2
    playlist3: [String],
    song: String,
    timestamp: Date,
  });
  
  const Playlist = mongoose.model('playlist', playlistSchema);
  export default  Playlist;
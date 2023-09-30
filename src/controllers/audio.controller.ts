import { MongoClient } from "mongodb";
import { getRandomValues } from "crypto";
import { client, bucket } from "@/databases/index";
import mongodb from "mongodb";
import mongoose from "mongoose";
import Song from "@/models/audio.model";
import Play from "@/models/play.model";
import user from "@/models/users/user.model";
import User from "@/models/users/user.model";




export const success = (req, res) => {
  console.log(req.files)  // Array 
  if (req.file) {
    // The file has been successfully uploaded and stored
    return res.status(200).json({ message: "File uploaded successfully" });
  } else {
    // No file was uploaded
    return res.status(400).json({ error: "File not uploaded." });
  }
}

// export const songStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './storesongs/songs/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + path.extname(file.originalname));
//     },
//   });


// Get All Songs Showing only text format
export const getAllSongs = async (req, res) => {
  try {
    const songs = await bucket.find({}).toArray();
    res.status(200).json(songs);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while fetching songs." });
  }
};


// Get Id By Song Showing only text format
export const songByID = async (req, res) => {
  try {
    const id = req.params.id;
    const songs = await bucket
      .find({
        _id: new mongoose.Types.ObjectId(id),
      })
      .toArray();
    if (songs.length === 0) {
      // Handle the case when no song is found with the provided _id
      return res.status(404).json({ error: "Song not found." });
    }
    console.log(songs);
    res.status(200).json({songs});
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while fetching songs." });
  }
};


//  Get Id By Song With Play Song
export const songByIDPlay = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid song ID format" });
    }
    const songStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(id)
    );
    res.setHeader("Content-Type", "audio/mpeg");
    songStream.pipe(res);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while fetching songs." });
  }
};



// Getting Random 5 Songs
export const randomsongs = async (req, res) => {
  try {
    const songs = await bucket.find({}).toArray();
    const random = getRandomItems(songs, 5);
    console.log(random);
    res.status(200).json(random);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs." });
  }
};
function getRandomItems(array, count) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}


// Getting Recently Played Songs
export const getrecentlyplayedsongs = async (req, res) => {
  try {
    const songs = await bucket
      .find({})
      .sort({ "metadata.playedAt": -1 })
      .toArray();
    res.status(200).json(songs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while featching recently played songs",
    });
  }
};



const recentsongs = [];

// export const playSong = async (req, res) => {
//   try {
//     const songId = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(songId)) {
//       return res.status(400).json({ error: 'Invalid song ID format' });
//     }

//     // Use findById method to directly fetch the song by ID
//     const song = await bucket.find({ _id: new mongoose.Types.ObjectId(songId) }).toArray();

//     if (song.length === 0) {
//       return res.status(404).json({ error: 'Song not found' });
//     }

//     res.status(200).json("song played"); // Assuming song is an array, return the first song found

//     recentsongs.push(song)
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     res.status(500).json({ error: 'An error occurred while fetching the song.' });
//   }
// };


export const recentlyplaySong = async (req, res) => {
  if (recentsongs.length == 0) {
    res.json("no recently played songs")
  } else {
    // recentsongs.forEach((object) => {
    //     console.log(object);
    //     res.json(object)
    //   });
    res.status(200).json(recentsongs)
  }
};






// Getting Song By Name (Full Song Name)
export const songByName = async (req, res) => {
  try {
    const name = req.params.filename;
    console.log(name);

    const songs = await bucket
      .find({
        filename: name,
      })
      .toArray();
    if (songs.length === 0) {
      // Handle the case when no song is found with the provided _id
      return res.status(404).json({ error: "Song not found." });
    }
    console.log(songs);
    res.status(200).json(songs);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while fetching songs." });
  }
};

// Getting Song By Name Only
export const songByWord = async (req, res) => {
  try {
    const name = req.params.filename.toLowerCase();
    const songs = await bucket.find({}).toArray();

    const filenames = songs.map((song) => song.filename);
    // console.log(filenames);
   
    if (songs.length > 0) {
      res.status(200).json(filenames);
    } else {
      res.status(200).json({ message: `${name} Song not found.` });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs." });
  }
};



export const playsong = async (req, res) => {
  try {
    const { userId, song } = req.body;

    const userexist=await User.findById(userId);
    // Log the recently played song
    const timestamp = new Date();
    const newSong = new Play({ userId, song, timestamp });
    await newSong.save();
    res.status(200).json({ message: "Song played" });
  } catch (error) {
    res.status(500).json({ error: "Error logging the song" });
  }
};

// Getting Audio and Video Songs with Play using filenames
export const getAllSongsPlay = async (req, res) => {
  try {
    // Retrieve all songs from GridFS
    const songs = await bucket.find({}).toArray();
const links=songs.map((song)=>{
      return{
        link:`http://localhost:8080/songsplay/${song._id}`
      }
    })
    res.send(links)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the songs.' });
  }
};
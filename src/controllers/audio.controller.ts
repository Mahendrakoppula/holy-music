import { bucket } from "@/databases/index";
import mongoose from "mongoose";
import Like from "@/models/like.model";
import {AudioUrlBase} from "@/config/index"
import Audio from "@/models/audio.model";


export const success = async (req, res) => {
  const {songname, title, artist, language, category } = req.body;
  const file =AudioUrlBase+ "audio/songByNamePlay/" + req.files['file'][0].filename; // Assuming 'file' is the name attribute in your form
  const image = AudioUrlBase+ "audio/songByNamePlay/" + req.files['image'][0].filename;
  console.log(req.files); // Array
  try{
    const audio = Audio.create({
      songname,title, artist, language, category, file, image
    });
    (await audio).save();
    return res.status(200).json("Details uploaded successfully");
       
  }catch(error){
    return res.status(400).json({ error: "Details not uploaded." });
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

export const playSong = async (req, res) => {
  try {
    const songId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ error: "Invalid song ID format" });
    }

    // Use findById method to directly fetch the song by ID
    const song = await bucket
      .find({ _id: new mongoose.Types.ObjectId(songId) })
      .toArray();

    if (song.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.status(200).json("song played"); // Assuming song is an array, return the first song found

    recentsongs.push(song);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while fetching the song." });
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


export const getAllSongsPlay = async (req, res) => {
  try {
    const songs =await Audio.find({});
    res.status(200).json(songs)
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the songs." });
  }
};

export const likesongs = async (req, res) => {
  try {
    const { songId, userId } = req.body;

    // Find the Like document for the given songId
    const existing = await Like.findOne({ songId });

    if (existing) {
      // Check if the user has already liked the song
      const userIndex = existing.userId.indexOf(userId);

      if (userIndex !== -1) {
        // Remove the userId from the existing document's userId array
        existing.userId.splice(userIndex, 1);
        existing.likes -= 1;
        await existing.save();
        res.status(200).json({ message: "Unliked song." });
      } else {
        // Add the userId to the existing document's userId array
        existing.userId.push(userId);
        existing.likes += 1;
        await existing.save();
        res.status(200).json({ message: "Liked song." });
      }
    } else {
      // Create a new Like document for the song and add the user's userId
      const newSong = new Like({
        userId: [userId], // Create an array with the user's userId
        songId,
      });
      await newSong.save();
      res.status(200).json({ message: "Liked song." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error toggling the like status." });
  }
};

export const Trendingsongs = async (req, res) => {
  try {
    const trendingSongs = await Like.find({ likes: { $gt: 2 } });

    // Use the map function to extract songIds and create song links
    const songLinks = trendingSongs.map((song) => {
      return `http://localhost:8080/songsplay/${song.songId}`;
    });

    res.status(200).json(songLinks);
  } catch (error) {
    res.status(500).json({ error: "Error logging the song." });
  }
};

export const songByNamePlay = async (req, res) => {
  try {
    const filename = req.params.filename;
    // console.log(name);

    // 2. validate the filename
    if (!filename) {
      res.send("Song not found");
    }

    const files = await bucket.find({ filename }).toArray();


    console.log(files);
    if (!files.length) {
      res.send("ERROR");
    }
    // 3. get file data
    const file = files.at(0)!;

    // 4. get the file contents as stream
    // Force the type to be ReadableStream since NextResponse doesn't accept GridFSBucketReadStream
    const stream = bucket.openDownloadStreamByName(filename);

    res.setHeader("Content-Type", file.contentType!);
    stream.pipe(res);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while fetching songs." });
  }
};

export const songByWord = async (req, res) => {
  try {
    const name = req.params.filename.toLowerCase();
    const songs = await bucket.find({}).toArray();
    const filenames = songs.map((song) => song.filename.toLowerCase());
    console.log(filenames);

    let foundFilenames = [];
    for (const filename of filenames) {
      if (filename.includes(name)) {
        foundFilenames.push(filename);
      }
    }
    if (foundFilenames.length > 0) {
      res.status(200).json(foundFilenames);
    } else {
      res.status(200).json({ message: `${name} Song not found.` });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs." });
  }
};
import mongoose from "mongoose";
import { bucket } from "@/databases/index";



//  Get Id By Video With Play Video
export const videoByIDPlay = async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid song ID format" });
      }
      const songStream = bucket.openDownloadStream(
        new mongoose.Types.ObjectId(id)
      );
      res.setHeader("Content-Type", "video/mp4");
      songStream.pipe(res);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "An error occurred while fetching songs." });
    }
  };
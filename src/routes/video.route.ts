import {videoByIDPlay} from "@/controllers/video.controller";
import express from "express";
import multer from "multer";
import {uploadVideo} from "@/models/video.model";
const router = express.Router();

const storage = multer.memoryStorage();
const uploadvideo = multer({ storage });

router.post("/uploadvideo", uploadvideo.single("file") ,uploadVideo);

router.get('/videoplay/:id',videoByIDPlay)
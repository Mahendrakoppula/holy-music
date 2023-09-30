import multer from "multer";
import express from "express";
import { success, getAllSongs, songByID, songByName, songByWord, songByIDPlay,  getAllSongsPlay} from "@/controllers/audio.controller";
import {randomsongs, getrecentlyplayedsongs, recentlyplaySong,playsong} from "@/controllers/audio.controller";
import {audio } from "@/models/audio.model"
const router = express.Router();

// const upload = multer({ storage: songStorage }); //folder
const uploadaudio = multer({ storage: audio }); //db


// router.post('/upload',[upload.single("file")],suc);

router.post("/audioupload", [uploadaudio.single("file")] ,success);

router.get('/getall',getAllSongs )

router.get('/songs/:id',songByID)

router.get('/random',randomsongs)

router.get('/song/:filename',songByName)

router.get('/songword/:filename',songByWord)

router.get('/recentlyplayedsongs',getrecentlyplayedsongs)

router.get('/songsplay/:id',songByIDPlay)

router.get('/getallplay',getAllSongsPlay )

router.get('/playsong',playsong)
router.get('/api/recentlyplayedsongs', recentlyplaySong);


export default router;

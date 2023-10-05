import multer from "multer";
import express from "express";
import { success, songByName, songByWord, songByNamePlay,  getAllSongsPlay} from "@/controllers/audio.controller";
import {randomsongs, getrecentlyplayedsongs, playSong, songByIDPlay, likesongs, fav,favPlayed, addplaylist,
    follower,  getallplaylist, Trendingsongs} from "@/controllers/audio.controller";
import {audio } from "@/models/audio.model"
const router = express.Router();


const uploadaudio = multer({ storage: audio }); //db


router.post("/audioupload",  [uploadaudio.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }])] ,success);
//1)post completed
router.get('/random',randomsongs)
//2)get completed
router.get('/trendingsongs',Trendingsongs)
//3)get completed
router.put('/like', likesongs)
//4)put completed
router.post('/playsong',playSong)
//5)get completed
router.get('/song/:filename',songByName)
//6)get completed
router.get('/songword/:filename',songByWord)
//7)get completed
router.get('/recentlyplayedsongs',getrecentlyplayedsongs)
//8)get completed
router.get('/songByNamePlay/:filename',songByNamePlay)
//9)get completed
router.get('/songsplay/:id',songByIDPlay)
//10)get completed
router.get('/getall',getAllSongsPlay )
// 11)get completed


router.post('/fav', fav)

router.get('/favsongs/:userId', favPlayed)

router.post('/playlist', addplaylist)

router.get('/playlists/:userId', getallplaylist)

router.post('/follower',follower)


export default router;

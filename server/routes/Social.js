import express from 'express';
import {postInstagram, addInstaHandler} from '../controllers/Social.js';

const router = express.Router();

router.post("/insta", postInstagram );
router.post("/add-insta-account/:userId", addInstaHandler);


export default router;
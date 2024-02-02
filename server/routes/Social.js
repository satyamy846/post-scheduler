import express from 'express';
import {postInstagram} from '../controllers/Social.js';

const router = express.Router();

router.post("/insta", postInstagram );


export default router;
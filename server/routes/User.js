import express from 'express';

const router = express.Router();
import {addUser} from '../controllers/User.js';

router.post("/signup", addUser);

export default router;
import express from 'express'
import auth from '../middlewares/auth.js';
import { generateStory } from '../controller/story.js';

const router=express.Router();

router.post('/generate',auth,generateStory)

export default router
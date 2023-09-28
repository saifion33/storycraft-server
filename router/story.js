import express from 'express'
import auth from '../middlewares/auth.js';
import { generateStory, getAllStories } from '../controller/story.js';

const router=express.Router();

router.post('/generate',auth,generateStory)
router.get('/all',getAllStories)

export default router
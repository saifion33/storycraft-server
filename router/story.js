import express from 'express'
import auth from '../middlewares/auth.js';
import { deleteStory, generateStory, getAllStories, getSavedStories, saveStory, upvoteStory } from '../controller/story.js';

const router=express.Router();

router.post('/generate',auth,generateStory)
router.patch('/save',auth,saveStory)
router.get('/all',getAllStories)
router.get('/getSaved',auth,getSavedStories)
router.patch('/upvote',auth,upvoteStory)
router.delete('/delete/:storyId',auth,deleteStory)
export default router
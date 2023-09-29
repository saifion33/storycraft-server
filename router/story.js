import express from 'express'
import auth from '../middlewares/auth.js';
import { deleteStory, generateStory, getAllStories, getSavedStories, getStoryById, saveStory, upvoteStory } from '../controller/story.js';

const router=express.Router();

router.get('/all',getAllStories)
router.patch('/save',auth,saveStory)
router.patch('/upvote',auth,upvoteStory)
router.post('/generate',auth,generateStory)
router.get('/getSaved',auth,getSavedStories)
router.get('/:storyId',getStoryById)
router.delete('/delete/:storyId',auth,deleteStory)


export default router
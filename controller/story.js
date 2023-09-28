import User from '../models/user.js';
import Story from '../models/story.js';
import { openai } from '../index.js';

const generateStoryAi = async (userPrompt) => {
    // "prompt":"generate a short story with a title, about a smart hacker."
    //  'Title: Breaking the Firewall\n' +
    // '\n' +
    // '\n' +
    // '\n' +
    // 'John had been fascinated by computers since he was a young boy. He was a natural with computers, much better than the average person. He constantly tinkered and experimented with programs, learning and mastering the technical knowledge he needed to become a successful hacker.\n' +
    // '\n' +
    // 'John had earned quite a few proud moments from his successful hacks, all the while managing'
    const response = await openai.completions.create({ model: 'text-davinci-003', max_tokens: 100, prompt: userPrompt })
    const story = response.choices[0]
    return story
}

const getTitleAndStory = (str) => {
    const endInd = str.indexOf('\n', 2)
    const title = str.slice(2, endInd).replace(/[^\w.'\s]+/g, ' ').replace('Title', '').trim()
    const story = str.slice(endInd).trim()
    return { title, story }
}

export const generateStory = async (req, res) => {
    const { prompt } = req.body
    const userId = req.userId;
    if (!prompt) {
        return res.status(401).json({ message: 'Please provide prompt.' })
    }
    if (prompt.length < 10) {
        return res.status(401).json({ message: 'Please provide a detailed prompt.' })
    }
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User account not found.' })
        }
        const genStory = await generateStoryAi(`generate a story in 40-50 words with a title. Ensure that the story is complete and should be captivating and full of intrigue, about ${prompt}|`)

        const story = {
            ...getTitleAndStory(genStory.text),
            prompt,
            author: {
                name: user.name,
                _id: user._id
            }
        }
        const fullStory = await Story.create(story)
        user.noOfStories += 1;
        user.save();
        res.status(200).json({ message: 'Story generated successfully.', story: fullStory });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getAllStories = async (req, res) => {
    try {
        const stories = await Story.find()
        res.status(200).json({ message: 'get all stories successfully.', stories });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

import User from '../models/user.js';
import Story from '../models/story.js';
import { openai } from '../index.js';

let str1 = '\n' +
    '\n' +
    'The Hacker\n' +
    '\n' +
    'When Emily thought of herself, she always associated it with being smart. As Emily grew older, she discovered a passion for technology and soon found a way to make money doing what she loves. She got her A+ certification and started hacking into computer systems for private companies and government entities. Her goal was to expose injustices and uncover evidence of corruption. \n' +
    '\n' +
    'Her'

let str2 = '\n' +
    '\n' +
    'Title: The Hacker Who Outsmarted Them All\n' +
    '\n' +
    'Joseph was a brilliant hacker, renowned throughout the Internet for his ingenuity. He worked tirelessly, seeking out vulnerabilities in digital networks and exploiting them. His creativity allowed him to outsmart even the most sophisticated security systems.\n' +
    '\n' +
    'When a high-stakes contest was announced with a million-dollar jackpot, Joseph was eager to compete.'
const str3 = '\n' +
    '\n' +
    'Title: "The Misadventures of a Smart Hacker"\n' +
    '\n' +
    'James was an ambitious hacker who thought he could outsmart anyone he came across. He was always looking for new hacking challenges and loved the thrill of outwitting cyber security experts. One day, his curiosity and ambition lead him to try and hack into a highly complex and secure government system. Little did he know that the'
const str4 = '\n' +
    '\n' +
    'Title: Outsmarting the System \n' +
    '\n' +
    'Raymond was a brilliant hacker, always staying one step ahead of the latest security measures. His skills were known by various government agencies, making him a sought after expert. Recently, he had been employed by a shady organization to retrieve information from a highly secure database.\n' +
    '\n' +
    'Despite the advanced security system, a few helpful exploits that Raymond had'
const str5 = '\n' +
    '\n' +
    'The Smart Hacker\n' +
    '\n' +
    'Felix was a true genius. Obsessed with computers and technology, he had become a master hacker by the age of just twenty-two. Nothing seemed impossible to Felix as soon as he figured out one puzzle, he moved onto the next, ever striving to test his knowledge and his skill. \n' +
    '\n' +
    'His employers treated him like royalty and paid him handsome'

const generateStoryAi = async (userPrompt) => {
    // "prompt":"generate a short story with a title, about a smart hacker."
    //  'Title: Breaking the Firewall\n' +
    // '\n' +
    // '\n' +
    // '\n' +
    // 'John had been fascinated by computers since he was a young boy. He was a natural with computers, much better than the average person. He constantly tinkered and experimented with programs, learning and mastering the technical knowledge he needed to become a successful hacker.\n' +
    // '\n' +
    // 'John had earned quite a few proud moments from his successful hacks, all the while managing'
    const response = await openai.completions.create({ model: 'text-davinci-003', max_tokens: 80, prompt: userPrompt })
    console.log(response)
    const story = response.choices[0]
    return story
}

const getTitleAndStory = (str) => {
    const endInd = str.indexOf('\n', 2)
    const title = str.slice(2, endInd).replace(/[^\w.'\s]+/g, ' ').replace('Title', '').trim()
    const story = str.slice(endInd).replace(/[^\w.'\s]+/g, ' ').trim()
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
        const genStory = await generateStoryAi(`generate a very short story with a title, about ${prompt}|`)

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
import mongoose from 'mongoose'

const storySchema=mongoose.Schema({
    title:{type:String, required:true},
    story:{type:String, required:true},
    prompt:{type:String, required:true},
    createdAt:{type:Date, default:Date.now},
    upVotes:{type:[String],default:[]},
    author:{
        name:{type:String, required:true},
        _id:{type:String, required:true}
    }
})

export default mongoose.model('Story',storySchema)
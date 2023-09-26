import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    noOfStories: { type: Number, default: 0 },
    noOfVotes: { type: Number, default: 0},
    joindedAt: { type: Date, default: Date.now },
})

export default mongoose.model('User',userSchema)
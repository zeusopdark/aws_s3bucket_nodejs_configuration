import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    originalName: {
        type: String,
    },
    filename: {
        type: String
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });
const imgModel = mongoose.model("Image", imageSchema);
export default imgModel;
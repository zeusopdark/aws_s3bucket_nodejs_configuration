import express from "express"
import multer from "multer"
import cors from "cors"
import morgan from "morgan";
import dotenv from "dotenv"
import { getObjectUrl, putObjectUrl } from "./s3.js"
import mongoose from "mongoose";
import imgModel from "./model/image.model.js";
const app = express();
const port = 8000;
dotenv.config();
const upload = multer({ dest: "uploads/" });
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));

app.get("/getImage/:id", async (req, res) => {
    console.log(req.params.id);
    try {
        const image = await imgModel.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "File not found", success: false });
        }
        const data = await getObjectUrl(`uploadedImage/${image.filename}`);
        res.status(200).json({ message: "Successful", success: true, data });
    } catch (err) {
        res.status(500).json({ message: "Some problem occured", success: false, err })
    }

})

app.post("/images", upload.single('image'), async (req, res) => {
    const file = req.file;
    try {
        const newData = {
            originalName: file.originalname,
            filename: file.filename,
            description: req.body.description
        }
        const newImage = new imgModel(newData);
        const imaged = await newImage.save();

        const key = `uploadedImage/${file.filename}`;
        const presignedUrl = await putObjectUrl(key, file.mimetype);
        res.status(200).json({ message: "Presigned URL generated successfully", success: true, data: presignedUrl, imaged });
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        res.status(500).json({ message: "Failed to generate presigned URL", success: false });
    }
});

mongoose.connect("mongodb+srv://ankit:zeusdark@cluster0.qbv9zzo.mongodb.net/AWSImage?retryWrites=true&w=majority");
mongoose.connection.once("open", () => {
    app.listen(port, () => { console.log("Connected to MongoDB", port) })
})
mongoose.connection.on("error", (err) => {
    console.log("An error occured", err);
})
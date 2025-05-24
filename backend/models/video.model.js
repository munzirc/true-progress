import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: Number, required: true }, // in seconds
});
const Video = mongoose.model("Video", videoSchema);
export default Video;

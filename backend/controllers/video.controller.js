import Video from "../models/video.model.js";

const addVideo = async (req, res) => {
  try {
    const { title, url, duration } = req.body;

    if (!title || !url || !duration) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newVideo = await Video.create({ title, url, duration });
    res.status(201).json({ message: "Video added successfully", video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add video" });
  }
};

const removeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const deleted = await Video.findByIdAndDelete(videoId);
    if (!deleted) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete video" });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({});
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error.message);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};


export default {
  addVideo,
  removeVideo,
  getAllVideos
};

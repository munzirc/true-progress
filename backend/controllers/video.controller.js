import Progress from "../models/progress.model.js";
import Video from "../models/video.model.js";

const addVideo = async (req, res) => {
  try {
    const { title, url, duration, thumbnail } = req.body;

    if (!title || !url || !duration || !thumbnail) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newVideo = await Video.create({ title, url, duration, thumbnail });
    res
      .status(201)
      .json({ message: "Video added successfully", video: newVideo });
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

const getVideosWithProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const videos = await Video.aggregate([
      {
        $lookup: {
          from: "progresses",
          let: { videoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$video", "$$videoId"] },
                    { $eq: ["$user", userId] },
                  ],
                },
              },
            },
            {
              $project: {
                intervals: 1,
                lastPosition: 1,
              },
            },
          ],
          as: "progress",
        },
      },
      {
        $unwind: {
          path: "$progress",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const result = videos.map((video) => {
      const intervals = video.progress?.intervals || [];
      const watched = intervals.reduce((sum, [s, e]) => sum + (e - s), 0);
      const percent = Math.min((watched / video.duration) * 100, 100).toFixed(
        2
      );

      return {
        _id: video._id,
        title: video.title,
        url: video.url,
        duration: video.duration,
        thumbnail: video.thumbnail,
        progress: {
          intervals,
          lastPosition: video.progress?.lastPosition || 0,
          percent,
        },
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    let progress = await Progress.findOne({
      user: req.user._id,
      video: video._id,
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user.id,
        video: video._id,
        intervals: [],
        lastPosition: 0,
      });
    }

    const{intervals, lastPosition, ...rest} = progress._doc;

    res.json({ ...video.toObject(), progress : {intervals, lastPosition} });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export default {
  addVideo,
  removeVideo,
  getVideosWithProgress,
  getVideoById,
};









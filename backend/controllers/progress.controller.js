import Progress from "../models/progress.model.js";
import Video from "../models/video.model.js";

const mergeIntervals = (intervals) => {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
};

const calculateWatchedTime = (intervals) =>
  intervals.reduce((sum, [s, e]) => sum + (e - s), 0);

const updateProgress = async (req, res) => {
  try {
    const { videoId, start, end, currentTime } = req.body;
    const userId = req.user.id;

    if (start >= end) {
      return res.status(400).json({ message: "Invalid interval" });
    }

    const existing = await Progress.findOne({ user: userId, video: videoId });

    let updatedIntervals;

    if (!existing) {
      updatedIntervals = [[start, end]];
      await Progress.create({
        user: userId,
        video: videoId,
        intervals: updatedIntervals,
        lastPosition: currentTime,
      });
    } else {
      updatedIntervals = mergeIntervals([...existing.intervals, [start, end]]);
      await Progress.findOneAndUpdate(
        { user: userId, video: videoId },
        {
          $set: { intervals: updatedIntervals, lastPosition: currentTime },
        },
        { new: true }
      );
    }

    const video = await Video.findById(videoId);
    const totalWatched = calculateWatchedTime(updatedIntervals);
    const percent = Math.min(
      (totalWatched / video.duration) * 100,
      100
    ).toFixed(2);

    const updatedVideo = {
      _id: video._id,
      title: video.title,
      url: video.url,
      duration: video.duration,
      thumbnail: video.thumbnail,
      progress: {
        intervals: updatedIntervals,
        lastPosition: currentTime,
        percent,
      },
    };

    res.json(updatedVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update progress" });
  }
};



export default {
  updateProgress,
};

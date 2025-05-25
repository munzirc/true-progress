import React, { useEffect, useState } from "react";
import { getAllVideos } from "../api/video.api";
import VideoList from "../components/VideoList";
import VideoPlayer from "../components/VideoPlayer";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";

const LecturerVideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [videoId, setVideoId] = useState(localStorage.getItem("lastPlayedVideoId") || null);
  const [progress, setProgress] = useState(0);

  const videoProps = {
    videoId,
    setVideos,
  };

  const vidListProps = {
    videos,
    setVideoId,
  };

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await getAllVideos();
      setVideos(data);
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    if (videos.length === 0) return;

    const totalDuration = videos.reduce(
      (sum, video) => sum + video.duration,
      0
    );
    const totalWatched = videos.reduce((sum, video) => {
      const percent = parseFloat(video.progress?.percent || "0");
      return sum + (video.duration * percent) / 100;
    }, 0);

    const overall =
      totalDuration > 0 ? (totalWatched / totalDuration) * 100 : 0;
    setProgress(overall.toFixed(2));
  }, [videos]);


  return (
    <main className="bg-gray-100">
      <header>
        <Header />
      </header>
      <div className="p-4 min-h-[calc(100vh-64px)] relative flex flex-col">
        <div className="w-full bg-white p-4 rounded-t-lg shadow-md border-b border-gray-300">
          <ProgressBar progress={progress} />
        </div>
        <div className="flex flex-1 bg-white shadow-lg relative rounded-b-lg max-h-[calc(100vh-133px)]">
          <VideoPlayer {...videoProps} />
          <VideoList {...vidListProps} />
        </div>
      </div>
    </main>
  );
};

export default LecturerVideoPage;

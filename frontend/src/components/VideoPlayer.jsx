import React, { useEffect, useRef, useState } from "react";
import { getVideoById } from "../api/video.api";
import { updateProgress } from "../api/progress.api";

const VideoPlayer = ({ videoId, setVideos }) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [video, setVideo] = useState({});
  const videoRef = useRef(null);
  const startTimeRef = useRef(0);
  const lastTrackedTimeRef = useRef(0);
  const isSeekingRef = useRef(false);

  // Fetch video
  useEffect(() => {
    const fetchVideo = async () => {
      if (videoId) {
        const data = await getVideoById(videoId);
        setVideo(data);
      }
    };
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    if (video?.progress?.lastPosition && videoRef.current) {
      videoRef.current.currentTime = video.progress.lastPosition;
      startTimeRef.current = video.progress.lastPosition;
    }

    if (video?._id) {
      localStorage.setItem("lastPlayedVideoId", video._id);
    }

    const resumeVideo = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch((err) => {
          console.warn("Playback failed:", err);
        });
      }
      document.removeEventListener("click", resumeVideo);
    };

    document.addEventListener("click", resumeVideo);

    return () => document.removeEventListener("click", resumeVideo);
  }, [video]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case "ArrowRight":
          videoRef.current.currentTime += 5;
          break;
        case "ArrowLeft":
          videoRef.current.currentTime -= 5;
          break;
        case " ":
          e.preventDefault();
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Progress update
  const handleProgressUpdate = async (from, to, currentTime, source) => {
    if (!video?._id || from >= to) return;

    try {
      const updated = await updateProgress(
        {
          videoId: video._id,
          start: from,
          end: to,
          currentTime,
        },
        source
      );

      setVideos((prev) =>
        prev.map((v) => (v._id === updated._id ? updated : v))
      );
    } catch (err) {
      console.error("Progress update failed:", err);
    }
  };

  // Pause
  const handlePause = () => {
    isSeekingRef.current = true;
    const current = videoRef.current?.currentTime ?? 0;
    if (startTimeRef.current < current - 2) {
      handleProgressUpdate(
        startTimeRef.current,
        lastTrackedTimeRef.current,
        current,
        "pause"
      );
    }
    startTimeRef.current = current;
    isSeekingRef.current = false;
  };

  const handleSeeking = () => {
    isSeekingRef.current = true;
  };

  const handleSeeked = () => {
    const seekedTo = videoRef.current?.currentTime ?? 0;
    if (
      lastTrackedTimeRef.current > startTimeRef.current &&
      lastTrackedTimeRef.current - startTimeRef.current > 2
    ) {
      handleProgressUpdate(
        startTimeRef.current,
        lastTrackedTimeRef.current,
        seekedTo,
        "seeked"
      );
    }
    startTimeRef.current = seekedTo;
    isSeekingRef.current = false;
  };

  const handleTimeUpdate = (e) => {
    if(videoRef.current?.paused) {
       isSeekingRef.current = true;
    }
    const current = e.target.currentTime;
    if (!isSeekingRef.current && !videoRef.current?.paused) {
      lastTrackedTimeRef.current = current;
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      const current = videoRef.current?.currentTime ?? 0;

      if (startTimeRef.current < current - 2) {
        const payload = {
          videoId: video._id,
          start: startTimeRef.current,
          end: current,
          currentTime: current,
        };

        const blob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });

        navigator.sendBeacon(`${baseURL}/api/progress/update`, blob);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [video]);

  if (!video || !video.url) {
    return (
      <div className="flex-2 p-4 flex items-center justify-center text-gray-500 w-full">
        Select a video to play
      </div>
    );
  }

  return (
    <div className="flex-2 p-4 w-full flex flex-col">
      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          key={video._id}
          ref={videoRef}
          controls
          src={video.url}
          poster={video.thumbnail}
          className="w-full h-full object-contain"
          onPause={handlePause}
          onSeeking={handleSeeking}
          onSeeked={handleSeeked}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-gray-800">
        {video.title}
      </h2>
    </div>
  );
};

export default VideoPlayer;

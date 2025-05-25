import React from "react";

const VideoList = ({ videos, setVideoId }) => {

  

  return (
    <div className="flex-1 border-l border-gray-300 rounded-br-lg p-4 overflow-y-scroll space-y-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
      {videos.map((video) => (
        <div
          key={video._id}
          onClick={() => setVideoId(video._id)}
          className="bg-white rounded-xl shadow-md mb-4 cursor-pointer hover:shadow-lg transition relative"
        >
          <div className="w-full relative">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="rounded-t-lg w-full h-40 object-cover"
            />
            {/* Fake Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                onClick={() => setVideoId(video._id)}
                className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg 
               transition-transform duration-150 ease-in-out 
               hover:scale-105 active:scale-95 cursor-pointer"
              >
                <svg
                  className="w-6 h-6 text-blue-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6 4l10 6-10 6V4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-3">
            <h2 className="text-md font-semibold text-gray-800">
              {video.title}
            </h2>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${video.progress?.percent || 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {video.progress?.percent || 0}% watched
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;

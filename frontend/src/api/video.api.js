const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getAllVideos = async () => {
  try {
    const res = await fetch(`${baseURL}/api/video`, {
      method: "GET",
      credentials: "include",
    });

    return await res.json(); 

  } catch (error) {
    console.log("Failed to fetch videos")
  }
};

export const getVideoById = async (videoId) => {
  try {
    const res = await fetch(`${baseURL}/api/video/${videoId}`, {
      method: "GET",
      credentials: "include",
    });

    return await res.json(); 

  } catch (error) {
    console.log("Failed to fetch video")
  }
};

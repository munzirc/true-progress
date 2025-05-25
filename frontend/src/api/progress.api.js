const baseURL = import.meta.env.VITE_API_BASE_URL;

export const updateProgress = async (data, source) => {
  try {
    const res = await fetch(`${baseURL}/api/progress/update?source=${source}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await res.json();

  } catch (error) {
    console.log("unable to update progress")
  }
};

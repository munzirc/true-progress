const baseURL = import.meta.env.VITE_API_BASE_URL;

export const signup = async (formData) => {
  const res = await fetch(`${baseURL}/api/auth/signup`, {
    method: "POST",
    credentials:"include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  return res;
};

export const signin = async (formData) => {
  const res = await fetch(`${baseURL}/api/auth/signin`, {
    method: "POST",
    credentials:"include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  return res;
};

export const logout = async () => {
  const res = await fetch(`${baseURL}/api/auth/logout`, {
    method: "GET",
    credentials:"include",
  });

  return await res.json();
};

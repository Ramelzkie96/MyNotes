const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (
  endpoint,
  options = {},
  token = null
) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...options.headers,
    },
  });

  return response;
};
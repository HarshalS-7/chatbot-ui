import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const sendPrompt = async (messages: any) => {
  const response = await axios.post(`${API_URL}/chat`,
    {
      messages
    },
    {
      withCredentials: true,
    });

  return response.data;

};

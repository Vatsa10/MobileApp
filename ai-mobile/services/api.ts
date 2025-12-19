import axios from 'axios';
import { Platform } from 'react-native';

// Use localhost for iOS simulator, 10.0.2.2 for Android emulator
// For real device, you need your machine's IP address
const DEV_API_URL = Platform.select({
  ios: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
  default: 'http://localhost:8000', // fallback for web
});

export const sendMessage = async (messages: any[]) => {
  try {
    const response = await axios.post(`${DEV_API_URL}/chat`, {
      messages,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

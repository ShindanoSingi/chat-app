import { axiosInstance } from ".";

export const messages = (message) => {
     try {
          const response = axiosInstance.post('/api/messages/new-message', message);
          return response.data;
     } catch (error) {
          throw error;
     };
};
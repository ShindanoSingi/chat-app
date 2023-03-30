import { axiosInstance } from ".";

export const SendMessage = async (message) => {
     try {

          const response = await axiosInstance.post('/api/messages/new-message', message);
          console.log(response);
          return response.data;
     } catch (error) {
          throw error;
     }
};
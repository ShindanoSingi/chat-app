// import { axiosInstance } from ".";
import axios from 'axios';

export const SendMessage = async (message) => {
     try {

          const response = await axios.post('/api/messages/new-message', message,
               {
                    headers: {
                         "content-type": "application/json",
                         Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
               });
          return response.data;
     } catch (error) {
          throw error;
     }
};

export const GetMessages = async (chatId) => {
     try {
          const response = await axios.get(`/api/messages/get-all-messages/${chatId}`,
               {
                    headers: {
                         "content-type": "application/json",
                         Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
               });
          return response.data;
     } catch (error) {
          throw error;
     }
};
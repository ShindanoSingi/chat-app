// import { axiosInstance } from ".";
import axios from 'axios';

export const GetAllChats = async () => {
     try {
          const response = await axios.get('/api/chats/get-all-chats',
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

export const CreateNewChat = async (members) => {
     try {
          const response = await axios.post('/api/chats/create-new-chat', {
               members
          },

               {
                    headers: {
                         "content-type": "application/json",
                         Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
               });
          return response.data;
     } catch (error) {
          throw (error);
     }
};

export const clearChatMessages = async (chatId) => {
     try {
          const response = await axios.post('/api/chats/clear-unread-messages', {
               chat: chatId,
          },
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
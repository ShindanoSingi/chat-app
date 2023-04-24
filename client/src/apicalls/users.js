// import { axiosInstance } from ".";
import axios from 'axios';

export const LoginUser = async (user) => {
     try {
          const response = await axios.post('/api/users/login', user,
               {
                    headers: {
                         "content-type": "application/json",
                         Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
               });
          return response.data;
     } catch (error) {
          return error.response.data;
     }
};

export const RegisterUser = async (user) => {
     try {
          const response = await axios.post('/api/users/register', user,
               {
                    headers: {
                         "content-type": "application/json",
                         Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
               }
          );
          return response.data;
     } catch (error) {
          return error.response.data;
     }
};

export const GetCurrentUser = async () => {
     try {
          const response = await axios.get('/api/users/get-current-User',
               {
                    headers: {
                         "content-type": "application/json",
                         Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
               });
          return response.data;
     } catch (error) {
          return error.response.data;
     }
};

export const GetAllUsers = async () => {
     try {
          const response = await axios.get('/api/users/get-all-users',
               {
                    headers: {
                         "content-type": "application/json",
                         Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
               });
          return response.data;
     } catch (error) {
          return error.response.data;
     }
}

export const UpdateProfilePic = async (image) => {
     try {
          const response = await axios.post('/api/users/update-profile-picture',
               image,
               {
                    headers: {
                         "content-type": "application/json",
                         Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
               });
          return response.data;
     } catch (error) {
          return error.response.data;
     }
}

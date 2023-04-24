import axios from 'axios';

export const axiosInstance = axios.create({
     headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
     },
});
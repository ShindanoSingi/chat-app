import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { GetCurrentUser } from '../apicalls/users';

function ProtectedRoute({ children }) {

     const [user, setUser] = useState(null);

     const navigate = useNavigate();

     const getCurrentUser = async () => {
          try {
               const response = await GetCurrentUser();
               if (response.success) {
                    setUser(response.data);
               }
          } catch (error) {
               toast.error(error.message);
               navigate('/login');
          }
     };

     useEffect(() => {
          if (localStorage.getItem("token")) {
               getCurrentUser();
          }
          else {
               navigate('/login');
          }

     }, []);

     return (
          <div>
               <h1>{user?.name}</h1>
               <h1>{user?.email}</h1>

               {children}
          </div>
     )
}

export default ProtectedRoute
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { GetCurrentUser } from '../apicalls/users';

function ProtectedRoute({ children }) {

     const navigate = useNavigate();

     const getCurrentUser = async () => {
          try {
               const response = await GetCurrentUser();
               if (response.success) {
                    return true;
               } else {
                    navigate('/login');
                    return false;
               }
          } catch (error) {
               navigate('/login');
          }
     };

     useEffect(() => {
          if (localStorage.getItem("token")) {
               getCurrentUser();
          }

     }, []);

     return (
          <div>{children}</div>
     )
}

export default ProtectedRoute
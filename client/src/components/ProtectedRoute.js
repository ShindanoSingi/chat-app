import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GetCurrentUser } from '../apicalls/users';
import { hideLoader, showLoader } from '../redux/loaderSlice';
import { useSelector } from 'react-redux';
import { SetUser } from '../redux/userSlice';
import { FaUserCircle } from 'react-icons/fa';


function ProtectedRoute({ children }) {

     const { user } = useSelector(state => state.userReducer);
     const dispatch = useDispatch();
     const navigate = useNavigate();

     const getCurrentUser = async () => {
          try {
               dispatch(showLoader());
               const response = await GetCurrentUser();
               dispatch(hideLoader());
               if (response.success) {
                    dispatch(SetUser(response.data));
               }
          } catch (error) {
               dispatch(hideLoader());
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
          <div className='h-screen w-screen bg-gray-100 p-2'>
               {/* Header */}
               <div className='flex justify-between p-5'>
                    <div className='flex items-center gap-1'>
                         <i className="ri-wechat-fill text-3xl"></i>
                         <h1 className='text-primary text-2xl uppercase font-semibold'>Bembe-Chat</h1>
                    </div>
                    <div className='flex gap-1 items-center text-xl'>
                         <FaUserCircle className='text-xl' />
                         <h2>{user?.name}</h2>
                    </div>
               </div>
               {/* End Header */}

               {/* Content (pages) */}
               <div className='p-5'>
                    {children}
               </div>

               {/* End Content */}

          </div>
     )
}

export default ProtectedRoute
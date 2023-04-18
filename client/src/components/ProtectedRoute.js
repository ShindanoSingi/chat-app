import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GetAllUsers, GetCurrentUser } from '../apicalls/users';
import { hideLoader, showLoader } from '../redux/loaderSlice';
import { useSelector } from 'react-redux';
import { SetUser, SetAllUsers, SetAllChats } from '../redux/userSlice';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineLogout } from 'react-icons/ai'
import { GetAllChats } from '../apicalls/chats';


function ProtectedRoute({ children }) {

     const { user } = useSelector(state => state.userReducer);
     const dispatch = useDispatch();
     const navigate = useNavigate();

     const getCurrentUser = async () => {
          try {
               dispatch(showLoader());
               const response = await GetCurrentUser();
               const allUsersResponse = await GetAllUsers();
               const allChatsResponse = await GetAllChats();
               dispatch(hideLoader());
               if (response.success) {
                    dispatch(SetUser(response.data));
                    dispatch(SetAllUsers(allUsersResponse.data));
                    dispatch(SetAllChats(allChatsResponse.data));
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
          <div className='h-screen w-screen bg-gray-100 px-2'>
               {/* Header */}
               <div className='flex justify-between p-2 bg-primary text-white rounded'>
                    <div className='flex items-center gap-1'>
                         <i className="ri-wechat-fill text-2xl"></i>
                         <h1 className=' text-[12px] text-white uppercase font-semibold'>Bembe-Chat</h1>
                    </div>
                    <div className='flex gap-2 items-center text-xl bg-white p-1 px-2 rounded-xl'>
                         {
                              user?.profilePic ? (
                                   <img src={user?.profilePic} alt="profile pic" className='w-6 h-6 rounded-full' />
                              ) : <FaUserCircle className='text-xl' />
                         }
                         <h2 className='underline text-primary text-[14px]'
                              onClick={() => { navigate('/profile') }}
                         >{user?.name}</h2>
                         <AiOutlineLogout
                              className='text-xl ml-3 text-primary curse-pointer'
                              onClick={() => {
                                   localStorage.removeItem("token");
                                   navigate('/login');
                              }}
                         />
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
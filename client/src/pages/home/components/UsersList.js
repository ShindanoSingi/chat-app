import React from 'react'
import { useSelector } from 'react-redux';
import { SetAllChats, SetSelectedChat } from '../../../redux/userSlice';
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

import { CreateNewChat } from '../../../apicalls/chats';

function UsersList({ searchKey }) {
     const { allUsers, allChats, user } = useSelector((state) => state.userReducer);
     const dispatch = useDispatch();
     const createNewChat = async (recipientUserId) => {
          try {
               dispatch(showLoader());
               const response = await CreateNewChat([user._id, recipientUserId]);
               dispatch(hideLoader());
               if (response.success) {
                    toast.success(response.message);
                    const newChat = response.data;
                    const updatedChats = [...allChats, newChat];
                    dispatch(SetAllChats(updatedChats));
               } else {
                    toast.error(response.message);
               }
          } catch (error) {
               dispatch(hideLoader());
               toast.error(error.message);
          }
     };

     const openChat = (recipientUserId) => {
          console.log(user._id);
          console.log(recipientUserId);
          console.log(allChats);
          // const chat = allChats.find((chat) =>
          //      chat.members.includes(user._id) &&
          //      chat.members.includes(recipientUserId));
          // if (chat) {
          //      dispatch(SetSelectedChat(chat));
          // } else {
          //      createNewChat(recipientUserId);
          // }
     };

     return (
          <div className='flex flex-col gap-1 mt-5'>
               {allUsers.
                    filter(
                         (userObj) =>
                              (userObj.name.toLowerCase().includes(searchKey.toLowerCase()) &&
                                   searchKey) ||
                              allChats.some((chat) => chat.members.includes(userObj._id)))
                    .map((userObj) => {
                         return (
                              <div className='all-users shadow-sm border p-5 bg-white flex justify-between items-center'
                                   key={userObj._id}
                              // onClick={() => openChat(userObj._id)}
                              >
                                   <div className='flex gap-5 items-center'>
                                        {userObj.profilePic && (
                                             <img
                                                  src={userObj.profilePic}
                                                  alt='profile pic'
                                                  className='rounded-full h-10 w-10'
                                             />
                                        )}
                                        {!userObj.profilePic && (
                                             <div className='bg-gray-500 text-white rounded-full h-10 w-10 flex items-center justify-center'>
                                                  <h1 className='uppercase text-2xl font-semibold'>{userObj.name[0]}</h1>
                                             </div>)}
                                        <h1>{userObj.name}</h1>
                                   </div>
                                   <div onClick={() => {
                                        createNewChat(userObj._id)
                                        openChat(userObj._id)
                                   }}>
                                        {
                                             !allChats.find((chat) => chat.members.includes(userObj._id)) && (
                                                  <button className='border-primary border text-primary bg-white p-1 rounded-xl'>
                                                       Create Chat
                                                  </button>
                                             )}

                                   </div>
                              </div>
                         )
                    })}
          </div>
     )
}

export default UsersList;
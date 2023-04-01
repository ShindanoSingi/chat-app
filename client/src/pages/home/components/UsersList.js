// import React from 'react'
// import { useSelector } from 'react-redux';
// import { SetAllChats, SetSelectedChat } from '../../../redux/userSlice';
// import { showLoader, hideLoader } from '../../../redux/loaderSlice';
// import { useDispatch } from 'react-redux';
// import { toast } from 'react-hot-toast';

// import { CreateNewChat } from '../../../apicalls/chats';

// function UsersList({ searchKey }) {
//      const { allUsers, allChats, user, selectedChat } = useSelector((state) => state.userReducer);
//      const dispatch = useDispatch();
//      const createNewChat = async (recipientUserId) => {
//           try {
//                dispatch(showLoader());
//                const response = await CreateNewChat([user._id, recipientUserId]);
//                dispatch(hideLoader());
//                if (response.success) {
//                     toast.success(response.message);
//                     const newChat = response.data;
//                     const updatedChats = [...allChats, newChat];
//                     dispatch(SetAllChats(updatedChats));
//                     dispatch(SetSelectedChat(newChat));
//                } else {
//                     toast.error(response.message);
//                }
//           } catch (error) {
//                dispatch(hideLoader());
//                toast.error(error.message);
//           }
//      };

//      const openChat = (recipientUserId) => {
//           const chat = allChats.find((chat) =>
//                chat.members.map((mem) => mem._id).includes(user._id) &&
//                chat.members.map((mem) => mem._id).includes(recipientUserId));
//           if (chat) {
//                dispatch(SetSelectedChat(chat));
//           }
//      };

//      const getData = () => {
//           return allUsers.filter(
//                (userObj) =>
//                     (userObj.name.toLowerCase().includes(searchKey.toLowerCase()) &&
//                          searchKey) || allChats.some((chat) =>
//                               chat.members?.map((mem) => mem._id).includes(userObj._id))
//           )
//      };

//      const getIsSelectedChatOrNot = (userObj) => {
//           if (selectedChat) {
//                return selectedChat.members?.map((mem) => mem._id).includes(userObj._id)
//           }
//           return false;
//      };

//      const getLastMsg = (userObj) => {
//           const chat = allChats.find((chat) =>
//                chat.members.map((mem) => mem._id).includes(userObj._id)
//           );
//           if (!chat) {
//                return '';
//           } else {
//                return chat.lastMessage;
//           };
//      };

//      return (
//           <div className='flex flex-col gap-1 mt-5'>
//                {getData()
//                     .map((userObj) => {
//                          return (
//                               <div className={`all-users shadow-sm border p-3 bg-white flex justify-between items-center cursor-pointer
//                                    ${getIsSelectedChatOrNot(userObj) && 'border-primary border-2'}
//                               `}
//                                    key={userObj._id}
//                                    onClick={() => openChat(userObj._id)}
//                               >
//                                    <div className='flex gap-5 items-center'>
//                                         {userObj.profilePic && (
//                                              <img
//                                                   src={userObj.profilePic}
//                                                   alt='profile pic'
//                                                   className='rounded-full h-10 w-10'
//                                              />
//                                         )}
//                                         {!userObj.profilePic && (
//                                              <div className='bg-gray-500 text-white rounded-full h-10 w-10 flex items-center justify-center'>
//                                                   <h1 className='uppercase text-xl font-semibold'>{userObj.name[0]}</h1>
//                                              </div>)}
//                                         <div className='flex flex-col gap-1'>
//                                              <h1>{userObj.name}</h1>
//                                              <h1>{getLastMsg(userObj)}</h1>
//                                         </div>
//                                    </div>
//                                    <div onClick={() => createNewChat(userObj._id)}>
//                                         {
//                                              !allChats.find((chat) => chat.members.map((mem) => mem._id).includes(userObj._id)) && (
//                                                   <button className='border-primary border text-primary bg-white p-1 rounded-xl'>
//                                                        Create Chat
//                                                   </button>
//                                              )
//                                         }
//                                    </div>
//                               </div>
//                          )
//                     })}
//           </div >
//      )
// }

// export default UsersList;
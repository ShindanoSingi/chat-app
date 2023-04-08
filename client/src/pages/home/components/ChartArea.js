import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RiSendPlaneFill } from 'react-icons/ri'
import { GetMessages, SendMessage } from '../../../apicalls/messages';
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { clearChatMessages } from '../../../apicalls/chats';
import { SetAllChats } from '../../../redux/userSlice';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import store from '../../../redux/store';


function ChartArea({ socket }) {
     const [newMessage, setNewMessage] = useState('');
     const [messages, setMessages] = useState([]);
     const { selectedChat, user, allChats } = useSelector((state) => state.userReducer);
     const dispatch = useDispatch();
     const receipientUser = selectedChat.members.find((mem) => mem._id !== user._id);


     const sendNewMessage = async () => {
          try {
               const message = {
                    chat: selectedChat._id,
                    sender: user._id,
                    text: newMessage,
               };

               // Send message to the server using socket.
               socket.emit('send-message', {
                    ...message,
                    members: selectedChat?.members?.map((mem) => mem._id),
                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    read: false,
               });

               // Send message to the server using socket.

               const response = await SendMessage(message);

               if (response.success) {
                    setNewMessage('');
               }
          } catch (error) {

               toast.error(error.message);
          };
     };

     const getMessages = async () => {
          try {
               dispatch(showLoader());
               const response = await GetMessages(selectedChat._id);
               dispatch(hideLoader());
               if (response.success) {
                    setMessages(response.data);
               }
          } catch (error) {
               dispatch(hideLoader());
               toast.error(error.message);
          };
     };

     const clearUnreadMessages = async () => {
          try {

               socket.emit('clear-unread-messages', {
                    chat: selectedChat._id,
                    members: selectedChat?.members?.map((mem) => mem._id),
               })

               dispatch(showLoader());
               const response = await clearChatMessages(selectedChat._id);
               dispatch(hideLoader());
               if (response.success) {
                    const updatedChats = allChats.map((chat) => {
                         if (chat._id === selectedChat._id) {
                              return response.data;
                         }
                         return chat;
                    });
                    dispatch(SetAllChats(updatedChats));
               }
          } catch (error) {
               dispatch(hideLoader());
               toast.error(error.message);
          };
     };

     useEffect(() => {
          getMessages();
          if (selectedChat?.lastMessage?.sender !== user._id) {
               clearUnreadMessages();
          }

          // receive message from server using socket.
          socket.off('receive message').on('receive-message', (message) => {
               const tempSelectedChat = store.getState().userReducer.selectedChat;
               if (tempSelectedChat._id === message.chat) {
                    setMessages((messages) => [...messages, message]);
               }

               if (tempSelectedChat._id === message.chat && message.sender !== user._id) {
                    clearUnreadMessages();
               }
          });

          // clear unread messages from server using socket.
          socket.on('unread-messages-cleared', (data) => {
               const tempAllChats = store.getState().userReducer.allChats;
               const tempSelectedChat = store.getState().userReducer.selectedChat;

               if (data.chat === tempSelectedChat._id) {
                    const updatedChats = tempAllChats.map((chat) => {
                         if (chat._id === data.chat) {
                              return {
                                   ...chat,
                                   unreadMessages: 0,
                              };
                         }
                         return chat;
                    });
                    dispatch(SetAllChats(updatedChats));

                    // Set all message as read.
                    setMessages((prevMessages) => {
                         return prevMessages.map(message => {
                              return {
                                   ...message,
                                   read: true
                              }
                         });
                    });
               }
          });

     }, [selectedChat]);

     // Scroll to bottom of the messages.
     useEffect(() => {
          const messagesContainer = document.getElementById('messages');
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
     }, [messages]);

     return (
          <div className='bg-white h-[80vh] border rounded-2xl w-full flex flex-col justify-between p-5'>
               {/* 1st part receipient user */}
               <div>
                    <div className='flex gap-5 items-center mb-2'>
                         {receipientUser.profilePic && (
                              <img
                                   src={receipientUser.profilePic}
                                   alt='profile pic'
                                   className='rounded-full h-10 w-10'
                              />
                         )}
                         {!receipientUser.profilePic && (
                              <div className='bg-gray-500 text-white rounded-full h-10 w-10 flex items-center justify-center'>
                                   <h1 className='uppercase text-xl font-semibold'>{receipientUser.name[0]}</h1>
                              </div>)}
                         <h1 className='uppercase'>{receipientUser.name}</h1>
                    </div>
                    <hr />
               </div>

               {/* 2nd part chat messages */}
               <div className='h-[62vh] overflow-scroll px-5 scrollbar-hide'
                    id='messages'
               >
                    <div className='flex flex-col gap-2'>
                         {
                              messages.map((message) => {
                                   const isCurrentUserIsSender = message.sender === user._id;
                                   return (
                                        <div key={message._id} className={`flex ${isCurrentUserIsSender && 'justify-end'}`} >
                                             <div className='flex flex-col'>
                                                  <h1 className={`${isCurrentUserIsSender ? 'bg-primary text-white rounded-bl-none max-w-xs' : 'bg-gray-300 text-primary max-w-xs rounded-tl-none'} p-2 rounded-xl `} >
                                                       {message.text}
                                                  </h1>
                                                  <h1 className='text-xs text-gray-500'>
                                                       {moment(message.createdAt).format('hh:mm A')}
                                                  </h1>

                                             </div>
                                             {isCurrentUserIsSender && <IoCheckmarkDoneSharp className={`text-3xl p-1 ${message.read ? 'text-green-700' : 'text-gray-400'}`} />}
                                        </div>
                                   )
                              })}
                    </div>
               </div>
               {/* 3rd part chat input */}
               <div>
                    <div className="h-16 rounded-xl border-gray-300 shadow border flex justify-between p-2 items-center">
                         <input
                              type="text"
                              placeholder='Type a message'
                              className="w-[90%] border-0 h-full border-none rounded-xl focus:border-none"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                         />
                         <button
                              className='bg-primary text-white p-3 rounded-xl px-6'
                              onClick={sendNewMessage}
                         >
                              <RiSendPlaneFill className='text-2xl' />
                         </button>
                    </div>
               </div>
          </div>
     )
}

export default ChartArea
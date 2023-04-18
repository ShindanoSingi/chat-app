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
import EmojiPicker from 'emoji-picker-react';
import { BsFillEmojiSmileFill } from 'react-icons/bs';
import { BiLinkAlt } from 'react-icons/bi';

function ChartArea({ socket }) {
     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
     const [isRecipientTyping, setIsRecipientTyping] = useState(false);
     const [newMessage, setNewMessage] = useState('');
     const [messages, setMessages] = useState([]);
     const { selectedChat, user, allChats } = useSelector((state) => state.userReducer);
     const dispatch = useDispatch();
     const receipientUser = selectedChat.members.find((mem) => mem._id !== user._id);


     const sendNewMessage = async (image, audio) => {
          try {
               if (!newMessage && !image) {
                    return toast.error('Please enter a message');
               }
               const message = {
                    chat: selectedChat._id,
                    sender: user._id,
                    text: newMessage,
                    image
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
                    setShowEmojiPicker(false);
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

     // Format date.
     const getDateInRegulatarFormat = (date) => {
          let result = '';
          // Date is today, return todat.
          if (moment(date).isSame(moment(), 'day')) {
               result = 'Today';
          }
          // Date is yesterday, return yesterday.
          else if (moment(date).isSame(moment().subtract(1, 'day'), 'day')) {
               result = 'Yesterday';
          }
          // if date is this year, return date in MMM DD format.
          else if (moment(date).isSame(moment(), 'year')) {
               result = moment(date).format('MMM DD');
          }
          // else return date in MMM DD, YYYY format.
          else {
               result = moment(date).format('MMM DD, YYYY');
          }
          return result;
     };

     // Upload image.
     const onImageUploadClick = async (e) => {
          const file = e.target.files[0];
          const reader = new FileReader(file);
          reader.readAsDataURL(file);
          reader.onloadend = async () => {
               sendNewMessage(reader.result);
          };
     };

     useEffect(() => {
          getMessages();
          if (selectedChat?.lastMessage?.sender !== user._id) {
               clearUnreadMessages();
          }

          // receive message from server using socket.
          socket.off('receive-message').on('receive-message', (message) => {
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

          // receive typing from server using socket.
          socket.on('typing', (data) => {
               const selectedChat = store.getState().userReducer.selectedChat;
               if (data.chat === selectedChat._id && data.sender !== user._id) {
                    setIsRecipientTyping(true);
               }
               setTimeout(() => {
                    setIsRecipientTyping(false);
               }, 1500);
          });

     }, [selectedChat]);

     // Scroll to bottom of the messages.
     useEffect(() => {
          const messagesContainer = document.getElementById('messages');
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
     }, [messages, isRecipientTyping]);

     return (
          <div className='bg-white h-[58vh] md:h-[62vh] ipad4:h-[60vh] xl:h-[87vh] border rounded-2xl xl:mt-[66px] flex flex-col justify-between p-3'>
               {/* 1st part receipient user */}
               <div>
                    <div className='flex gap-5 items-center mb-2'>
                         {receipientUser.profilePic && (
                              <img
                                   src={receipientUser.profilePic}
                                   alt='profile pic'
                                   className='rounded-full h-10 w-10 ipad4:h-[60px] ipad4:w-[60px]'
                              />
                         )}
                         {!receipientUser.profilePic && (
                              <div className='bg-gray-500 text-white rounded-full h-10 w-10 flex items-center justify-center'>
                                   <h1 className='uppercase text-xl font-semibold'>{receipientUser.name[0]}</h1>
                              </div>)}
                         <h1 className='uppercase ipad4:text-xl'>{receipientUser.name}</h1>
                    </div>
                    <hr />
               </div>

               {/* 2nd part chat messages */}
               <div className='h-[62vh] overflow-scroll px-5 pt-2 scrollbar-hide' id='messages'>
                    <div className='flex flex-col gap-2'>
                         {
                              messages.map((message, index) => {
                                   const isCurrentUserIsSender = message.sender === user._id;
                                   return (
                                        <div key={index} className={`flex ${isCurrentUserIsSender && 'justify-end'}`} >
                                             <div className={` ${isCurrentUserIsSender ? 'flex flex-col items-end rounded-tr-none pb-2 px-2 rounded-xl bg-primary p-2' : 'flex flex-col items-start rounded-tl-none pb-2 px-2 rounded-xl bg-gray-300 w-fit p-2'}`}>
                                                  {message.text && <h1 className={`text-sm ipad4:text-lg  ${isCurrentUserIsSender ? 'text-white' : 'text-gray-700 ipad4:text-lg'}`}>{message.text}</h1>}
                                                  {message.image && <img src={message.image} alt='message_image' className='w-32 h-32 rounded-xl' />}
                                                  <h1 className='text-xs text-gray-500  relative'>
                                                       {
                                                            getDateInRegulatarFormat(message.createdAt) === 'Today' ?
                                                                 <h1 className='text-center ipad4:text-lg'>
                                                                      {
                                                                           moment(message.createdAt).format('hh:mm A')
                                                                      }
                                                                 </h1>
                                                                 :
                                                                 <h1 className='text-center ipad4:text-lg'>
                                                                      {
                                                                           getDateInRegulatarFormat(message.createdAt)
                                                                      }
                                                                 </h1>
                                                       }
                                                  </h1>

                                             </div>
                                             {isCurrentUserIsSender && <IoCheckmarkDoneSharp className={`text-2xl ${message.read ? 'text-green-700' : 'text-gray-400'}`} />}
                                        </div>
                                   )
                              })}
                         {
                              isRecipientTyping && (
                                   <h1 className='bg-blue-100 mb-2 text-primary p-2 w-24 rounded-xl'>
                                        Typing...
                                   </h1>
                              )
                         }
                    </div>
               </div>

               {/* 3rd part chat input */}
               <div>
                    <div className="h-12 mt-2 rounded-xl border-gray-300 shadow border flex justify-between px-1.5 items-center">
                         {
                              showEmojiPicker &&
                              (<div className='absolute bottom-[-40px] xl:bottom-20 2xl:bottom-28'>
                                   <EmojiPicker
                                        height={350}
                                        onEmojiClick={(e) => {
                                             setNewMessage(newMessage + '' + e.emoji + ' ');
                                        }}
                                   />
                              </div>)
                         }
                         <BsFillEmojiSmileFill className='text-4xl mb-0 text-primary cursor-pointer'
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                         />

                         <label for='file'>
                              <BiLinkAlt typeof='file' className='text-xl md:text-2xl ml-2 text-primary cursor-pointer'
                              />
                              <input
                                   type="file"
                                   id='file'
                                   className='hidden'
                                   accept='image/gif, image/jpeg, image/png, image/jpg'
                                   onChange={onImageUploadClick}
                              />
                         </label>
                         <input
                              type="text"
                              placeholder='Type a message'
                              className="w-full mr-2 border-0 h-full md:text-xl border-none rounded-xl focus:border-none"
                              value={newMessage}
                              onChange={(e) => {
                                   setNewMessage(e.target.value);
                                   socket.emit('typing', {
                                        chat: selectedChat._id,
                                        members: selectedChat?.members?.map((mem) => mem._id),
                                        sender: user._id,
                                   });
                                   setIsRecipientTyping(false);
                              }}
                         />
                         <button
                              className='bg-primary text-white p-2 rounded-xl px-4'
                              onClick={() => { sendNewMessage('') }}
                         >
                              <RiSendPlaneFill className='text-xl' />
                         </button>

                    </div>
               </div>
          </div>
     )
}

export default ChartArea
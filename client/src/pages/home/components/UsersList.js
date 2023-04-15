import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { SetAllChats, SetSelectedChat } from '../../../redux/userSlice';
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { CreateNewChat } from '../../../apicalls/chats';
import store from '../../../redux/store';
import { io } from 'socket.io-client';
const socket = io('http://localhost:8080');


function UsersList({ searchKey, onlineUsers }) {
    const { allUsers, allChats, user, selectedChat } = useSelector((state) => state.userReducer);
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
                dispatch(SetSelectedChat(newChat));
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(error.message);
        }
    };

    const openChat = (recipientUserId) => {
        const chat = allChats.find((chat) =>
            chat.members.map((mem) => mem._id).includes(user._id) &&
            chat.members.map((mem) => mem._id).includes(recipientUserId));
        if (chat) {
            dispatch(SetSelectedChat(chat));
        }
    };

    const getData = () => {
        return allUsers.filter(
            (userObj) =>
                (userObj.name.toLowerCase().includes(searchKey.toLowerCase()) &&
                    searchKey) || allChats.some((chat) =>
                        chat.members?.map((mem) => mem._id).includes(userObj._id))
        )
    };

    const getIsSelectedChatOrNot = (userObj) => {
        if (selectedChat) {
            return selectedChat.members?.map((mem) => mem._id).includes(userObj._id)
        }
        return false;
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
            result = 'Yest.';
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

    const getLastMsg = (userObj) => {
        const chats = allChats.find((chat) =>
            chat.members.map((mem) => mem._id).includes(userObj._id)
        );
        if (!chats || !chats.lastMessage) {
            return '';
        } else {
            const lastMsgPerson = chats.lastMessage?.sender === user._id ? 'You:' : "";
            return (
                <div key={userObj._id} className='flex justify-between gap-8'>
                    <h1 className='text-gray-600 truncate line-clamp-1 text-sm w-48'>
                        {lastMsgPerson} {chats.lastMessage?.text}
                    </h1>
                    <h1 className='flex w-16 gap-1 flex-col items-center'>
                        <p className='text-gray-500 text-xs'>{getDateInRegulatarFormat(chats?.lastMessage?.createdAt)}</p>
                        <p className='text-gray-500 text-xs'>{moment(chats.lastMessage?.createdAt).format('hh:mm A')}</p>
                    </h1>
                </div>
            )
        };
    };

    const getUnreadMessages = (userObj) => {
        const chat = allChats.find((chat) =>
            chat?.members.map((mem) => mem._id).includes(userObj._id)
        );
        if (chat && chat?.unreadMessages && chat?.lastMessage?.sender !== user._id) {
            return (
                <div className='bg-blue-500 text-white rounded-full px-[9px]'
                    key={chat._id}
                >
                    {chat?.unreadMessages}
                </div>
            )
        }
    };




    useEffect(() => {
        socket.on('receive-message', (message) => {
            // if the chat area opened is not equal to chat n message, then increase unread messages by 1 and update the last message
            const tempSelectedChat = store.getState().userReducer.selectedChat;
            let tempAllChats = store.getState().userReducer.allChats;
            if (tempSelectedChat?._id !== message.chat) {
                const updatedAllChats = tempAllChats.map((chat) => {
                    if (chat._id === message.chat) {
                        return {
                            ...chat,
                            unreadMessages: (chat?.unreadMessages || 0) + 1,
                            lastMessage: message
                        }
                    }
                    return chat;
                });
                tempAllChats = updatedAllChats;
            }

            //  Always update the last message  chat will on the top.
            const latestChat = tempAllChats.find((chat) => chat._id === message.chat);
            const otherChats = tempAllChats.filter((chat) => chat._id !== message.chat);
            tempAllChats = [latestChat, ...otherChats];
            dispatch(SetAllChats(tempAllChats));
        });
    }, []);

    return (
        <div className='flex flex-col gap-2 mt-5 lg:w-96 md:w-60 sm:w-60 xl:w-96'>
            {getData().map((chatObjOrUserObj) => {
                let userObj = chatObjOrUserObj;

                if (chatObjOrUserObj.members) {
                    userObj = chatObjOrUserObj.members.find((mem) => mem._id !== user._id);
                };
                return (
                    <div className={`all-users shadow-sm w-full border p-3 bg-white flex justify-between items-center cursor-pointer
                                   ${getIsSelectedChatOrNot(userObj) && 'border-primary border-2'}
                              `}
                        key={userObj._id}
                        onClick={() => openChat(userObj._id)}
                    >
                        <div className='flex gap-5 h-12 items-center'>
                            {
                                userObj.profilePic &&
                                (

                                    <div className='rounded-full h-11 w-14 items-center justify-center relative'>
                                        <img
                                            src={userObj.profilePic}
                                            alt='profile pic'
                                            className='rounded-full h-11 w-11 object-cover'
                                        />
                                        {
                                            onlineUsers.includes(userObj._id) ?
                                                <div>
                                                    <div className='bg-green-600 h-3 w-3 rounded-full absolute bottom-[2px] right-1'>
                                                    </div>
                                                </div> :
                                                <div>
                                                    <div className='bg-orange-300 h-3 w-3 rounded-full absolute bottom-[2px] right-1'>
                                                    </div>
                                                </div>
                                        }
                                    </div>

                                )
                            }
                            {
                                !userObj.profilePic &&
                                (
                                    <div className='bg-gray-500 text-white rounded-full h-11 w-11 flex p-5 items-center justify-center relative'>
                                        <h1 className='uppercase text-xl font-semibold'>
                                            {userObj.name[0]}
                                        </h1>
                                        {
                                            onlineUsers.includes(userObj._id) ?
                                                <div>
                                                    <div className='bg-green-600 h-3 w-3 rounded-full absolute bottom-[2px] right-1'>
                                                    </div>
                                                </div> :
                                                <div>
                                                    <div className='bg-orange-300 h-3 w-3 rounded-full absolute bottom-[2px] right-1'>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                )
                            }
                            <div className='flex flex-col gap-1 w-full'>
                                <div className='flex gap-4 w-full'>
                                    <h1>{userObj.name}</h1>
                                    {getUnreadMessages(userObj)}
                                </div>
                                {getLastMsg(userObj)}
                            </div>
                        </div>
                        <div onClick={() => createNewChat(userObj._id)}>
                            {
                                !allChats.find((chat) => chat.members.map((mem) => mem._id).includes(userObj._id)) && (
                                    <button className='border-primary border text-primary bg-white p-1 rounded-lg'
                                        key={userObj._id}
                                    >
                                        Create Chat
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )
            })}
        </div >
    )
}

export default UsersList;
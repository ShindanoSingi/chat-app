import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import ChartArea from './components/ChartArea'
import UserSearch from './components/UserSearch'
import UsersList from './components/UsersList';
import { io } from 'socket.io-client';
const socket = io('https://bembe-chat.onrender.com/');
localStorage.setItem('socket', socket);


function Home() {
    const [searchKey, setSearchKey] = useState('');
    const { selectedChat, user } = useSelector((state) => state.userReducer);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        // join the room
        if (user) {
            socket.emit('join-room', user._id);
            socket.emit('came-online', user._id);

            socket.on('online-users', (users) => {
                setOnlineUsers(users);
            });

        }
    }, [user]);

    return (
        <div className='flex gap-5 flex-col xl:flex-row items-center xl:items-start'>
            {/* 1st part: user search, userslist/chatlist  */}
            <div className='w-[95vw] xl:w-[35%]'>
                <UserSearch
                    searchKey={searchKey}
                    setSearchKey={setSearchKey}
                />
                <UsersList searchKey={searchKey} onlineUsers={onlineUsers} socket={socket} />
            </div>
            {/* 2nd part: chatbox  */}

            {selectedChat && (
                <div className='w-[95vw]'>
                    <  ChartArea socket={socket} />
                </div>
            )}
            {
                !selectedChat && (
                    <div className='w-[95vw] h-[80vh] md:h-[63vh xl:h-[92vh] flex items-center xl:mt-[68px] justify-center bg-white flex-col'>
                        <img
                            src="https://www.pngmart.com/files/16/Speech-Chat-Icon-Transparent-PNG.png"
                            alt="Speech-Chat-Icon"
                            className='w-96 h-96 justify-center items-center'
                        />
                        <h1>Select a user to chat</h1>
                    </div>
                )
            }
        </div>
    )
}

export default Home
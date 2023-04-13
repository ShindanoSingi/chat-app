import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import ChartArea from './components/ChartArea'
import UserSearch from './components/UserSearch'
import UsersList from './components/UsersList';
import { io } from 'socket.io-client';
const socket = io('http://localhost:8080');

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
        <div className='flex gap-5'>
            {/* 1st part: user search, userslist/chatlist  */}
            <div className='w-96'>
                <UserSearch
                    searchKey={searchKey}
                    setSearchKey={setSearchKey}
                />
                <UsersList searchKey={searchKey} onlineUsers={onlineUsers} />
            </div>
            {/* 2nd part: chatbox  */}

            {selectedChat && (
                <div className='w-full'>
                    <  ChartArea socket={socket} />
                </div>
            )}
        </div>
    )
}

export default Home
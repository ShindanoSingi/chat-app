import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import ChartArea from './components/ChartArea'
import UserSearch from './components/UserSearch'
import UsersList from './components/UsersList';
import { io } from 'socket.io-client';

function Home() {
    const socket = io('http://localhost:5000');

    const [searchKey, setSearchKey] = useState('');
    const { selectedChat, user } = useSelector((state) => state.userReducer);

    useEffect(() => {
        // join the room
        if (user) {
            socket.emit('join-room', user._id);
            // send new message to receipient  Salima
            socket.emit('send-message', {
                message: 'Hi Salima, I am Anna',
                sender: user._id,
                receipient: '64238933e9b38082428f5867',
            });

            // receive message from recipient Salima 642130155402fa264cf8acaf
            socket.on('receive-message', (data) => {
                console.log('data', data);
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
                <UsersList searchKey={searchKey} />
            </div>
            {/* 2nd part: chatbox  */}
            <div className='w-full'>
                {selectedChat && <  ChartArea
                    socket={socket}
                />}
            </div>

        </div>
    )
}

export default Home
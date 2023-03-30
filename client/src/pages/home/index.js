import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ChartArea from './components/ChartArea'
import UserSearch from './components/UserSearch'
import UsersList from './components/UsersList';

function Home() {
     const [searchKey, setSearchKey] = useState('');
     const { selectedChat } = useSelector((state) => state.userReducer);
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
                    {selectedChat && <  ChartArea />}
               </div>

          </div>
     )
}

export default Home
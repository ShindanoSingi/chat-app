import React, { useState } from 'react'
import ChartArea from './components/ChartArea'
import UserSearch from './components/UserSearch'
import UsersList from './components/UsersList';

function Home() {
     const [searchKey, setSearchKey] = useState('');
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
               <div>
                    <ChartArea />
               </div>
          </div>
     )
}

export default Home
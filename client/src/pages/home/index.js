import React from 'react'
import ChartArea from './components/ChartArea'
import UserSearch from './components/UserSearch'

function Home() {
     return (
          <div className='flex'>
               {/* 1st part: user search, userslist/chatlist  */}
               <div>
                    <UserSearch />
               </div>
               {/* 2nd part: chatbox  */}
               <div>
                    <ChartArea />
               </div>
          </div>
     )
}

export default Home
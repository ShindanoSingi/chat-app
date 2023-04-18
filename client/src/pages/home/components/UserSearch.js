import React from 'react'

function UserSearch({ searchKey, setSearchKey }) {
     return (
          <div className='relative search-container w-full'>
               <input
                    type="text"
                    placeholder='Search users / chats'
                    className='search-input rounded-xl w-full border-gray-300 pl-10 text-gray-500 h-10'
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
               />
               <i className="ri-search-line absolute top-2.5 left-4 text-gray-500"></i>
          </div>
     )
}

export default UserSearch
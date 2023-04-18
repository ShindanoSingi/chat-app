import React from 'react'

function UserSearch({ searchKey, setSearchKey }) {
     return (
          <div className='relative search-container w-full mt-12 md:mt-16'>
               <input
                    type="text"
                    placeholder='Search users / chats'
                    className='rounded-xl w-full border-gray-300 md:text-[20px] pl-10 text-gray-500 h-10 md:h-14'
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
               />
               <i className="ri-search-line absolute top-2.5 md:top-3.5 md:text-[20px] left-4 text-gray-500"></i>
          </div>
     )
}

export default UserSearch
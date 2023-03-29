import React from 'react'
import { useSelector } from 'react-redux';

function UsersList({ searchKey }) {
     const { allUsers, allChats } = useSelector((state) => state.userReducer);

     return (
          <div className='flex flex-col gap-1 mt-5'>
               {allUsers?.filter((user) =>
                    user.name.toLowerCase().includes(searchKey.toLowerCase()) && searchKey
               )
                    ?.map((userObj, index) => {
                         return (
                              <div key={index} className='all-users shadow-sm border p-5 bg-white flex justify-between items-center'>
                                   <div className='flex gap-5 items-center'>
                                        {userObj.profilePic && (
                                             <img
                                                  src={userObj.profilePic}
                                                  alt='profile pic'
                                                  className='rounded-full h-10 w-10'
                                             />
                                        )}
                                        {!userObj.profilePic && (
                                             <div className='bg-gray-500 text-white rounded-full h-10 w-10 flex items-center justify-center'>
                                                  <h1 className='uppercase text-2xl font-semibold'>{userObj.name[0]}</h1>
                                             </div>)}
                                        <h1>{userObj.name}</h1>
                                   </div>
                                   <div>
                                        {!allChats.find((chat) => chat.users.includes(userObj._id)) &&
                                             (<button className='border-primary text-primary border bg-white p-1  rounded'>Create Chart</button>)
                                        }
                                   </div>
                              </div>
                         )
                    })}
          </div>
     )
}

export default UsersList;
import React from 'react'
import { useSelector } from 'react-redux'
import { RiSendPlaneFill } from 'react-icons/ri'

function ChartArea() {
     const { selectedChat, user } = useSelector((state) => state.userReducer);
     const receipientUser = selectedChat.members.find((mem) => mem._id !== user._id);

     return (
          <div className='bg-white h-[80vh] border rounded-2xl w-full flex flex-col justify-between p-5'>
               {/* 1st part receipient user */}
               <div>
                    <div className='flex gap-5 items-center mb-2'>
                         {receipientUser.profilePic && (
                              <img
                                   src={receipientUser.profilePic}
                                   alt='profile pic'
                                   className='rounded-full h-10 w-10'
                              />
                         )}
                         {!receipientUser.profilePic && (
                              <div className='bg-gray-500 text-white rounded-full h-10 w-10 flex items-center justify-center'>
                                   <h1 className='uppercase text-xl font-semibold'>{receipientUser.name[0]}</h1>
                              </div>)}
                         <h1 className='uppercase'>{receipientUser.name}</h1>
                    </div>
                    <hr />
               </div>

               {/* 2nd part chat messages */}
               <div>
                    Chat Messages
               </div>
               {/* 3rd part chat input */}
               <div>
                    <div className="h-16 rounded-xl border-gray-300 shadow border flex justify-between p-2 items-center">
                         <input
                              type="text"
                              placeholder='Type a message'
                              className="w-[90%] border-0 h-full border-none rounded-xl focus:border-none"
                         />
                         <button className='bg-primary text-white p-3 rounded-xl px-6'>
                              <RiSendPlaneFill className='text-2xl' />
                         </button>
                    </div>
               </div>
          </div>
     )
}

export default ChartArea
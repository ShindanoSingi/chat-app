// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux';
// import moment from 'moment';


// export const Profile = () => {
//     const { user } = useSelector(state => state.userReducer);
//     const [image, setImage] = useState('');

//     const onFileSelect = (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader(file);
//         reader.readAsDataURL(file);
//         reader.onloadend = async (file) => {
//             setImage(reader.result);
//         }
//     };

//     useEffect(() => {
//         if (user?.ProfilePic) {
//             setImage(user.ProfilePic);
//         }
//     }, [user]);

//     return (
//         user && <div className='text-xl font-semibold uppercase text-gray-500 flex flex-col gap-2'>
//             <h1 >{user.name}</h1>
//             <h1 >{user.email}</h1>
//             <h1>Created At: {moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h1>
//             {
//                 image &&
//                 (<img
//                     src={image}
//                     alt="profile pic"
//                     className='w-32 h-32 rounded-full'
//                 />)
//             }
//             <div className='flex flex-col items-start'>
//                 <label htmlFor="file-input" className='cursor-pointer'>
//                     Update Profile Pic
//                 </label>
//                 <input
//                     type="file"
//                     onChange={onFileSelect}
//                     className='border-none file-input'
//                 />
//             </div>

//         </div>
//     )
// }

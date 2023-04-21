import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment';
import { toast } from 'react-hot-toast';
import { UpdateProfilePic } from '../../apicalls/users';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/loaderSlice';


export const Profile = () => {
    const { user } = useSelector(state => state.userReducer);
    const [image, setImage] = useState('');
    const dispatch = useDispatch();

    const onFileSelect = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader(file);
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            console.log(reader.result);
            setImage(reader.result);
        }
    };

    const updateProfilePic = async () => {
        try {
            dispatch(showLoader());
            const response = await UpdateProfilePic({ image });

            if (response.success) {
                toast.success('Profile Pic Updated Successfully');
                dispatch(hideLoader());
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user?.profilePic) {
            setImage(user.profilePic);
        }
    }, [user]);

    return (
        user &&
        <div className='text-[12px] md:text-[22px] xl:mt-20 mt-16 md:mt-24 ipad4:w-[70vw] mx-auto font-semibold 2xl:mt-28 2xl:w-[50vw] uppercase text-gray-500 flex flex-col gap-2 shadow-md border p-5 items-center'>
            <h1 >{user.name}</h1>
            <h1 >{user.email}</h1>
            <h1>Created At: {moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h1>

            <div className='flex gap-3 flex-col items-center justify-center'>{
                image &&
                (<img
                    src={image}
                    alt="profile pic"
                    className='w-24 h-24 md:w-32 md:h-32 rounded-full'
                />)
            }
                <label htmlFor="file-input text-[12px] md:text-[18px]" className='cursor-pointer text-[12px] md:text-[22px]'>
                    Update Profile Pic
                </label>
                <input
                    type="file"
                    onChange={onFileSelect}
                    className='border-none file-input text-[12px] md:text-[22px]'
                />
                <button
                    className='contained-btn px-2 md:text-[22px]'
                    onClick={updateProfilePic}
                >
                    Update
                </button>
            </div>

        </div>
    )
}

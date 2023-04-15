import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment';
import { toast } from 'react-hot-toast';
import { UpdateProfilePic, UploadAudio } from '../../apicalls/users';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/loaderSlice';


export const Profile = () => {
    const { user } = useSelector(state => state.userReducer);
    const [image, setImage] = useState('');
    const [audio, setAudio] = useState('');
    const dispatch = useDispatch();

    const onFileSelect = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader(file);
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
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

    // const onAudioSelect = (e) => {
    //     const file = e.target.files[0];
    //     const reader = new FileReader(file);
    //     reader.readAsDataURL(file);
    //     reader.onloadend = async () => {
    //         setImage(reader.result);
    //     }
    // };

    // const uploadAudio = async () => {
    //     try {
    //         const response = await UploadAudio({ audio });
    //         if (response.success) {
    //             toast.success('Audio Uploaded Successfully');
    //         }
    //     } catch (error) {
    //         toast.error(error.message);
    //     }
    // };

    useEffect(() => {
        if (user?.profilePic) {
            setImage(user.profilePic);
        }
    }, [user]);

    return (
        user && <div className='text-xl font-semibold uppercase text-gray-500 flex flex-col gap-2 shadow-md border p-5 w-max'>
            <h1 >{user.name}</h1>
            <h1 >{user.email}</h1>
            <h1>Created At: {moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h1>
            {
                image &&
                (<img
                    src={image}
                    alt="profile pic"
                    className='w-32 h-32 rounded-full'
                />)
            }
            <div className='flex gap-3'>
                <label htmlFor="file-input" className='cursor-pointer'>
                    Update Profile Pic
                </label>
                <input
                    type="file"
                    onChange={onFileSelect}
                    className='border-none file-input'
                />
                <button
                    className='contained-btn'
                    onClick={updateProfilePic}
                >
                    Update
                </button>
            </div>

        </div>
    )
}

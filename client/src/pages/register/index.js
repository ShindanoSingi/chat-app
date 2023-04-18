import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RegisterUser } from '../../apicalls/users';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/loaderSlice';


function Register() {
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const [user, setUser] = useState({
          name: '',
          email: '',
          password: '',
     });

     const register = async () => {
          try {
               dispatch(showLoader());
               const response = await RegisterUser(user);
               dispatch(hideLoader());
               if (response.success) {
                    toast.success(response.message);
               } else {
                    toast.error(response.message);
               }
          } catch (error) {
               dispatch(hideLoader());
               toast.error(error.message);
          }
     };

     useEffect(() => {
          if (localStorage.getItem("token")) {
               navigate('/');
          }
     }, []);

     return (
          <div className='h-screen bg-primary flex items-center  justify-center'>
               <div className='form-container bg-white shadow-md p-5 md:p-8 flex flex-col gap-5 w-96 xs:w-[90%] rounded-lg md:w-[60%] lg:w-[45%] xl:w-[40%]'>
                    <div className='flex justify-center gap-2 items-center'>
                         <i className="ri-wechat-fill xs:text-[26px] text-primary md:text-5xl"></i>
                         <h1 className="text-2xl uppercase text-center font-semibold text-primary xs:text-[16px]  md:text-3xl">Bembe-Chat Register</h1>
                    </div>

                    <hr />
                    <input type="text"
                         value={user.name}
                         onChange={(e) => setUser({ ...user, name: e.target.value })}
                         placeholder="Enter your name"
                         className={user.name ? 'border-green-500 md:text-2xl xl:text-3xl md:py-3 px-3 py-1' : 'border-red-500 md:text-2xl xl:text-3xl md:py-3 px-3 py-1'}
                    />
                    <input type="email"
                         value={user.email}
                         onChange={(e) => setUser({ ...user, email: e.target.value })}
                         placeholder="Enter your email"
                         className={user.email ? 'border-green-500 md:py-3 md:text-2xl px-3 py-1 xl:text-3xl' : 'border-red-500 md:text-2xl xl:text-3xl md:py-3 px-3 py-1'}
                    />
                    <input type="password"
                         value={user.password}
                         onChange={(e) => setUser({ ...user, password: e.target.value })}
                         placeholder="Enter your password"
                         className={user.password ? 'border-green-500 md:text-2xl md:py-3 p-1 px-2' : 'border-red-500 md:text-2xl md:py-3 p-1 px-2'}
                    />
                    <button className={user.name && user.email && user.password ? 'contained-btn md:text-2xl md:py-2 px-3 ' : 'disabled-btn md:text-2xl md:py-2 px-3'} onClick={register}>Register</button>
                    <Link to='/login'
                         className='underline text-center md:text-2xl'
                    >
                         Already have an account? Login
                    </Link>
               </div>
          </div>
     )
}

export default Register
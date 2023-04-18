import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LoginUser } from '../../apicalls/users';
import { showLoader, hideLoader } from '../../redux/loaderSlice';


function Login() {
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const [user, setUser] = useState({
          email: '',
          password: '',
     });

     const loginUser = async () => {
          try {
               dispatch(showLoader());
               const response = await LoginUser(user);
               dispatch(hideLoader());
               if (response.success) {
                    toast.success(response.message);
                    localStorage.setItem("token", response.data);
                    navigate('/');
               } else {
                    toast.error(response.message);
               }
          } catch (error) {
               dispatch(hideLoader());
               alert(error);
          }
     }

     useEffect(() => {
          if (localStorage.getItem("token")) {
               navigate('/');
          }
     }, []);

     // fetch('https://ipinfo.io/json')
     //      .then(response => response.json())
     //      .then(data => {
     //           const ipAddress = data.ip;
     //           console.log(ipAddress); // This will log the user's IP address to the console
     //      })
     //      .catch(error => {
     //           console.error('Error fetching IP address:', error);
     //      });

     return (
          <div className='min-h-screen py-5 bg-primary flex items-center  justify-center'>
               <div className='form-container bg-white shadow-md p-5 md:p-8 flex flex-col gap-5 w-96 xs:w-[90%] rounded-lg md:w-[60%] lg:w-[45%] xl:w-[40%]'>
                    <div className='flex justify-center gap-2 items-center'>
                         <i className="ri-wechat-fill xs:text-[26px] text-primary md:text-5xl"></i>
                         <h1 className="text-2xl uppercase text-center font-semibold text-primary xs:text-[16px]  md:text-3xl">Bembe-Chat Login</h1>
                    </div>

                    <hr />
                    <input type="email"
                         value={user.email}
                         onChange={(e) => setUser({ ...user, email: e.target.value })}
                         placeholder="Enter your email"
                         className={user.email ? 'border-green-500 md:text-2xl xl:text-3xl md:py-3 px-3 py-1' : 'border-red-500 md:text-2xl xl:text-3xl md:py-3 px-3 py-1'}
                    />
                    <input type="password"
                         value={user.password}
                         onChange={(e) => setUser({ ...user, password: e.target.value })}
                         placeholder="Enter your password"
                         className={user.email ? 'border-green-500 md:py-3 md:text-2xl px-3 py-1 xl:text-3xl' : 'border-red-500 md:py-3 px-3 md:text-2xl py-1 xl:text-3xl'}
                    />
                    <button className={user.email && user.password ? 'contained-btn md:py-4 text-center md:text-2xl py-1.5 xl:text-3xl 3xl:p-4' : 'disabled-btn md:py-4 md:text-2xl py-1.5 xl:text-3xl 3xl:p-4'} onClick={loginUser}>Login</button>
                    <Link to='/register'
                         className='underline text-center md:text-2xl xl:text-3xl'
                    >
                         Don't have an account? Register
                    </Link>
               </div>
          </div>
     )
}

export default Login
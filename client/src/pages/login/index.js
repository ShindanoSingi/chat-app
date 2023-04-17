import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LoginUser } from '../../apicalls/users';
import { showLoader, hideLoader } from '../../redux/loaderSlice';
import './index.css'


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
               <div className='form-container bg-white shadow-md p-5 flex flex-col gap-5 w-96'>
                    <div className='flex justify-center gap-2 items-center'>
                         <i className="ri-wechat-fill text-3xl text-primary chat-icon"></i>
                         <h1 className="text-2xl uppercase text-center font-semibold text-primary login-title">Bembe-Chat Login</h1>
                    </div>

                    <hr />
                    <input type="email"
                         value={user.email}
                         onChange={(e) => setUser({ ...user, email: e.target.value })}
                         placeholder="Enter your email"
                         className={user.email ? 'border-green-500' : 'border-red-500'}
                    />
                    <input type="password"
                         value={user.password}
                         onChange={(e) => setUser({ ...user, password: e.target.value })}
                         placeholder="Enter your password"
                         className={user.email ? 'border-green-500' : 'border-red-500'}
                    />
                    <button className={user.email && user.password ? 'contained-btn login-button' : 'disabled-btn login-button'} onClick={loginUser}>Login</button>
                    <Link to='/register'
                         className='underline text-center login-link'
                    >
                         Don't have an account? Register
                    </Link>
               </div>
          </div>
     )
}

export default Login
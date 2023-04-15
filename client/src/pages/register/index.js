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
               <div className='bg-white shadow-md p-5 flex flex-col gap-5 w-96'>
                    <div className='flex justify-center gap-2 items-center'>
                         <i className="ri-wechat-fill text-3xl text-primary"></i>
                         <h1 className="text-2xl uppercase text-center font-semibold text-primary">Bembe-Chat Register</h1>
                    </div>

                    <hr />
                    <input type="text"
                         value={user.name}
                         onChange={(e) => setUser({ ...user, name: e.target.value })}
                         placeholder="Enter your name"
                         className={user.name ? 'border-green-500' : 'border-red-500'}
                    />
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
                         className={user.password ? 'border-green-500' : 'border-red-500'}
                    />
                    <button className={user.name && user.email && user.password ? 'contained-btn' : 'disabled-btn'} onClick={register}>Register</button>
                    <Link to='/login'
                         className='underline text-center'
                    >
                         Already have an account? Login
                    </Link>
               </div>
          </div>
     )
}

export default Register
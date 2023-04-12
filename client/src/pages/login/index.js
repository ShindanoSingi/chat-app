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
          <div className='h-screen bg-primary flex items-center  justify-center'>
               <div className='bg-white shadow-md p-5 flex flex-col gap-5 w-96'>
                    <h1 className="text-2xl uppercase text-center font-semibold text-primary">Bembe-Chat Login</h1>
                    <hr />
                    <input type="email"
                         value={user.email}
                         onChange={(e) => setUser({ ...user, email: e.target.value })}
                         placeholder="Enter your email"
                    />
                    <input type="password"
                         value={user.password}
                         onChange={(e) => setUser({ ...user, password: e.target.value })}
                         placeholder="Enter your password"
                    />
                    <button className='contained-btn' onClick={loginUser}>Login</button>
                    <Link to='/register'
                         className='underline text-center'
                    >
                         Don't have an account? Register
                    </Link>
               </div>
          </div>
     )
}

export default Login
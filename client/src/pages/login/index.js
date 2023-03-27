import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { LoginUser } from '../../apicalls/users';


function Login() {

     const [user, setUser] = useState({
          email: '',
          password: '',
     });

     const navigate = useNavigate();

     const loginUser = async () => {
          try {
               const response = await LoginUser(user);
               if (response.success) {
                    toast.success(response.message);
                    localStorage.setItem("token", response.data);
                    navigate('/');
               } else {
                    toast.error(response.message);
               }
          } catch (error) {
               alert(error);
          }
     }

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
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { RegisterUser } from '../../apicalls/users';


function Register() {
     const [user, setUser] = useState({
          name: '',
          email: '',
          password: '',
     });

     const register = async () => {
          try {
               const response = await RegisterUser(user);
               console.log(response);
               if (response.success) {
                    console.log(response.message);
               } else {
                    console.log(response.message);
               }
          } catch (error) {
               alert(error);
          }
     };

     return (
          <div className='h-screen bg-primary flex items-center  justify-center'>
               <div className='bg-white shadow-md p-5 flex flex-col gap-5 w-96'>
                    <h1 className="text-2xl uppercase text-center font-semibold text-primary">Bembe-Chat Register</h1>
                    <hr />
                    <input type="text"
                         value={user.name}
                         onChange={(e) => setUser({ ...user, name: e.target.value })}
                         placeholder="Enter your name"
                    />
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
                    <button className='contained-btn' onClick={register}>Register</button>
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
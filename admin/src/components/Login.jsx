import axios from 'axios';
import { useState } from 'react';
import { backendUrl } from '../App';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // console.log(email, password);
      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });
    //   console.log(response.data);


      if (response.data.success && response.data.token) {
        onLogin && onLogin(response.data.token);
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error occurred while logging in:', error);
      toast.error('Unable to reach server');
    }
  };
    return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='bg-white shadow-sm rounded-md px-8 py-6 max-w-sm'>
            <h1 className='text-2xl font-bold mb-4'>Admin panel</h1>
            <form onSubmit={onsubmitHandler}>
                <div className='mb-3 '>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                    <input onChange={(e)=>setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@email.com' required />
                </div>
                <div className='mb-3 '>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                    <input onChange={(e)=>setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder=' Enter your password' required />
                </div>
                <button className="w-full bg-black text-white py-2 rounded-md font-semibold 
             hover:bg-gray-900 transition duration-300 
             focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 
             shadow-sm" type='submit' >
                    Login
                </button>
            </form>
        </div>
      
    </div>
  )
}

export default Login

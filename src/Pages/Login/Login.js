import React, { useState } from 'react'
import logo2 from "../../Images/logo2.jpeg"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { RiseLoader } from 'react-spinners';
import gs1logo from '../../Images/gs1logowhite.png'

const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handdleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    axios.post('https://gs1.org.sa/api/admin/user/login', { email: email, password: password, status: 1 })
      .then((response) => {
        console.log(response)
        setIsLoading(false)
     
        navigate('/dashboard')

        Swal.fire({
          icon: 'success',
          title: 'Admin Login Successfully',
          text: response.data.message || 'Something went wrong!',
      })
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="">Please Put the Correct Admin Email Password</a>'
        })
      })
  }
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">

      {isLoading &&

        <div className='loading-spinner-background'
          style={{
            zIndex: 9999, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed'


          }}
        >
          <RiseLoader
            size={18}
            color={"#6439ff"}
            // height={4}
            loading={isLoading}
          />
        </div>
      }

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
        </div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Welcome to Verification Portal</h1>
            </div>

            <form onSubmit={handdleSubmit}>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <label htmlFor='email'>Enter Your Email</label>
                    <input
                      id='email'
                      type="email"
                      name="email"
                      placeholder="Email Your Email"
                      className="border outline-blue-700 rounded-md w-full h-12 px-4"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor='password'>Enter Your Password</label>
                    <input
                      id='password'
                      type="password"
                      name="password"
                      placeholder="Enter Your Password"
                      className="border outline-blue-700 rounded-md w-full h-12 px-4"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <button type='submit' className="bg-blue-500 text-white rounded-md px-2 py-1">Login Now</button>
                  </div>
                </div>
              </div>
            </form>

            <div className='h-auto w-full flex justify-between '>
              <img src={logo2} className='h-16 w-auto sm:-ml-10 -mb-9' alt='' />
              <img src={gs1logo} className='h-14 w-auto sm:-mr-12 -mb-9' alt='' />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectAuth, setUser } from '../features/auth/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../store'
import { Eye } from 'lucide-react'
import axios from 'axios'


const PasswordType = {
  PASSWORD: 'password',
  TEXT: 'text',
} as const


type PasswordType = typeof PasswordType[keyof typeof PasswordType]

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordType, setPasswordType] = useState<PasswordType>(PasswordType.PASSWORD);
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated } = useSelector(selectAuth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {email, password},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      dispatch(setUser(response.data))
      navigate('/')
    } catch (error: any) {
      console.error('Login error:', error.message)
    }
    navigate('/')
  }

  function handlePassowrd() {
    if (passwordType === PasswordType.PASSWORD) {
      setPasswordType(PasswordType.TEXT);
    } else {
      setPasswordType(PasswordType.PASSWORD);
    }
  }



  return (
    <div className="mt-28 flex flex-col items-center justify-center gap-4 "
      style={{ height: 'calc(100vh - 7rem)' }}
    >
      <input
        type="email"
        placeholder="Email"
        className='px-4 h-11 border rounded-full w-80'
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className='relative'>

        <input
          type={passwordType}
          placeholder="Password"
          className='px-4 h-11 border rounded-full w-80'
          onChange={(e) => setPassword(e.target.value)}
        />

        <Eye onClick={handlePassowrd} className='w-7 h-7 absolute bottom-2 right-4 cursor-pointer p-1' />
        
        </div>


      {!isAuthenticated && (
        <button
          onClick={handleLogin}
          className="px-5 py-2 mt-4 bg-black text-white rounded-full cursor-pointer"
        >
          Login
        </button>
      )}
    </div>
  )
}


export default LoginPage
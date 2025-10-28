import { Bot } from "lucide-react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth, logout } from "../features/auth/userSlice";
import type { AppDispatch } from "../store";
import axios from "axios";

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated } = useSelector(selectAuth)

  function handleLogin() {
    navigate('/login');
    console.log("Login button clicked");
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/auth/logout',
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      dispatch(logout())
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error.message)
    }
    navigate('/')
  }

  return (
    <div className="w-full fixed top-0 left-0 p-4 md:py-4 md:px-8 h-16 md:h-20 flex justify-between items-center gap-2 bg-[#eeeeee]">
      <button onClick={() => navigate("/")} className="flex items-center justify-center gap-1 md:gap-2 cursor-pointer">
        <Bot className="w-5 h-5 md:w-7 md:h-7" />
        <p className="text-xl md:text-2xl font-semibold">Chatbot</p>
      </button>
      {!isAuthenticated ? (
        <div className="flex justify-center items-center gap-0.5 px-4 md:px-5 py-1.5 bg-black text-white rounded-full">
          <button onClick={handleLogin} className="text-sm md:text-base cursor-pointer">Login</button>
          {/* <LogIn className="w-6 h-6 md:w-8 md:h-8 p-1 rounded-full" /> */}
        </div>
      ) : (
        <div className="flex justify-center items-center gap-0.5 px-4 md:px-5 py-1.5 bg-black text-white rounded-full">
          <button onClick={handleLogout} className="text-sm md:text-base cursor-pointer">Logout</button>
          {/* <LogIn className="w-6 h-6 md:w-8 md:h-8 p-1 rounded-full" /> */}
        </div>
      )

      }
    </div>
  )

}

export default Header
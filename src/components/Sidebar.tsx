import { Bot, Edit, User } from "lucide-react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth, logout } from "../features/auth/userSlice";
import type { AppDispatch, RootState } from "../store";
import axios from "axios";

function Sidebar() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated } = useSelector(selectAuth)
  const messages = useSelector((state: RootState) => state.chat.messages);

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
    <div className="fixed top-0 left-0 py-4 px-2 w-64 min-h-screen items-start gap-2 flex flex-col bg-stone-100 border-r border-stone-200 z-10">
      <div className="flex gap-2 w-full items-center px-2 mb-4">
        <Bot size={24} className="" />
        <div className="pt-0.5">Chatbot</div>
      </div>

      <hr className="absolute w-full left-0 top-14 border border-stone-200" />

      <div className="flex gap-2 items-center rounded-xl hover:bg-stone-200 cursor-pointer p-2 w-full" onClick={() => navigate('/')}>
        <Edit className="w-4.5 h-4.5" />
        <div>
          New Chat
        </div>
      </div>


      {/* AUTH SECTION */}
      <hr className="absolute w-full bottom-16 left-0 border border-stone-200" />
      <div className="absolute bottom-0 left-0 h-16 w-full p-2">
        {!isAuthenticated ? (
          <button onClick={handleLogin} className="w-full h-full flex justify-start items-center cursor-pointer hover:bg-stone-200 rounded-xl">
            <User className="w-8 h-8 md:w-10 md:h-10 p-2 rounded-full" />
            <div className="text-sm md:text-base ">Login</div>
          </button>

        ) : (
          <button onClick={handleLogout} className="w-full h-full flex justify-start items-center cursor-pointer hover:bg-stone-200 rounded-xl">
            <User className="w-8 h-8 md:w-10 md:h-10 p-2 rounded-full" />
            <div className="text-sm md:text-base ">Log Out</div>
          </button>
        )
        }
      </div>



    </div>
  )

}

export default Sidebar
import { User } from "lucide-react"

function Input() {

  return (
    <div className="w-full fixed top-0 left-0 p-3 md:py-4 md:px-8 h-16 md:h-20 bg-yellow-200 flex justify-between items-center gap-2">
      <div className="text-xl md:text-3xl font-semibold">Chatbot</div>
      <User className="w-8 h-8 md:w-10 md:h-10 p-1 rounded-full border border-white" />
    </div>
  )

}

export default Input
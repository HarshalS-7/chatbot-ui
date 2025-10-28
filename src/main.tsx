import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store.ts'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login.tsx'
import Sidebar from './components/Sidebar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <div className='w-full flex flex-col'>
          {/* <Header /> */}
          <Sidebar/>
           <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)

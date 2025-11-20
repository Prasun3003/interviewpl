import {SignInButton, SignUpButton, UserButton, SignedOut, SignedIn, SignOutButton, useUser} from '@clerk/clerk-react'
import { Routes, Route ,Navigate} from 'react-router'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProblemsPage from './pages/ProblemsPage'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

function App() {
  const  {isSignedIn}= useUser()
  useEffect(() => {
    console.log(isSignedIn)
  }, [isSignedIn])
  return (
    <>
    <Routes>
     <Route path="/" element={<HomePage />} />
     <Route path="/about" element={<AboutPage />} />
     <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />}   />
    </Routes>
    <Toaster/>
    </>
  )
}

export default App

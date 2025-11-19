import './App.css'
import {SignInButton, SignUpButton, UserButton, SignedOut, SignedIn, SignOutButton} from '@clerk/clerk-react'

function App() {
  return (
    <>
     <h1>Welcome to HireOn</h1>
     <SignedOut>
        <SignInButton mode="modal" >Sign In</SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton mode="modal" />
        <SignOutButton mode="modal" >Move Out</SignOutButton>
      </SignedIn>
    </>
  )
}

export default App

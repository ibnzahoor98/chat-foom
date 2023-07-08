import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Welcome from "./components/auth/Welcome"
import Chat from "./components/chat/Chat"

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
function App() {  
 

  return (
    <Router> 
        <Routes>
          <Route  path="/" element={<Welcome/>}/>
          <Route  path="/login" element={<Login/>}/>
          <Route  path="/register" element={<Register/>}/>
          <Route  path="/chat" element={<Chat></Chat>}/>
        </Routes> 
    </Router>
     
      


  )
}

export default App

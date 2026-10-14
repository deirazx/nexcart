import "./index.css"
import { Routes, Route } from 'react-router-dom'
import Login from "./Pages/Login"
import Home from "./Pages/Home"
import Register from "./Pages/Register"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
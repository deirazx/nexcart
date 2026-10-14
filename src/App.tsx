import "./index.css"
import { Routes, Route } from 'react-router-dom'
import Login from "./Pages/Login"
import Home from "./Pages/Home"
import Register from "./Pages/Register"
import Cart from "./Pages/Cart"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
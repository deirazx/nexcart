import "./index.css"
import { Routes, Route } from 'react-router-dom'
import Login from "./Pages/Login"
import Home from "./Pages/Home"
import Register from "./Pages/Register"
import Cart from "./Pages/Cart"
import { useEffect, useState } from "react"
import Checkout from "./Pages/Checkout"

const App = () => {
  const [isLoggedIn, setIsloggedIn] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem("IsLoggedIn");

    if (user) {
      setIsloggedIn(true);
      return;
    }
  }, [isLoggedIn]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </>
  )
}

export default App
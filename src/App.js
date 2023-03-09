import { Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import StockManage from "./components/StockManage";

function App() {
  return (
    <div >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/StockManage" element={<StockManage />} />
      </Routes>
    </div>
  );
}

export default App;

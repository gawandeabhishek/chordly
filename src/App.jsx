import React, { useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import User from "./components/User";
import Show from "./components/Show";

const App = () => {
  const [play, setPlay] = useState(true);
  const audioElement = useRef();

  return (
    <div className="bg-cyan-50/30 dark:bg-slate-900 select-none h-fit min-h-screen scroll-smooth scroll-mr-2 scroll-p-2 touch-auto transition-all">
      <Header />
      <Routes>
        <Route path="/" element={<Home setPlay={setPlay} />}>
          <Route index element={<Home setPlay={setPlay} />} />
        </Route>
        <Route path="/user" element={<User />} />
        <Route path="/show/:id" element={<Show play={play} setPlay={setPlay} audioElement={audioElement} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

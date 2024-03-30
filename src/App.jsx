import React, { useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import User from "./components/User";
import Show from "./components/Show";

const App = () => {
  const [play, setPlay] = useState(true);
  const [query, setQuery] = useState();
  const audioElement = useRef();

  return (
    <div className="bg-cyan-50/30 dark:bg-slate-900 select-none h-fit min-h-screen scroll-smooth scroll-mr-2 scroll-p-2 touch-auto transition-all">
      <Header query={query} setQuery={setQuery} />
      <Routes>
        <Route path="/" element={<Home setPlay={setPlay} setQuery={setQuery} />}>
          <Route index element={<Home setPlay={setPlay} setQuery={setQuery} />} />
        </Route>
        <Route path="/user" element={<User setQuery={setQuery} />} />
        <Route path="/show/song" element={<Show play={play} setPlay={setPlay} query={query} audioElement={audioElement} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

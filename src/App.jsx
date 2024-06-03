import React, { useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import User from "./components/User";
import Show from "./components/Show";

const App = () => {
  const [play, setPlay] = useState(true);
  const [song, setSong] = useState();
  const [audioTrack, setAudioTrack] = useState();
  const [query, setQuery] = useState();
  const [q, setQ] = useState("");
  const audioElement = useRef();
  const [isLoop, setIsLoop] = useState(false);
  const [forwd, setForwd] = useState(true);
  const [onceLoop, setOnceLoop] = useState(false);
  const [songData, setSongData] = useState();

  const skipForward = async () => {
    const newIndex = index === songData?.length - 1 ? 0 : index + 1;
    setIndex(newIndex);
    setSong(songData[newIndex]);
    navigate(`/show/${songData[newIndex]?.id}`);
    location.reload();
  };

  const onPlaying = () => {
    const duration = audioElement.current.duration;
    const currentTime = audioElement.current.currentTime;

    setAudioTrack({
      progress: (currentTime / duration) * 100,
      length: duration,
    });
    if (currentTime == duration && isLoop) {
      audioElement.current.currentTime = 0;
    } else if (currentTime == duration && onceLoop) {
      audioElement.current.currentTime = 0;
      setOnceLoop(false);
      setForwd(true);
      setIsLoop(false);
    } else if (currentTime == duration && forwd) {
      audioElement.current.currentTime = 0;
      skipForward();
    }
  };

  return (
    <div className="bg-cyan-50/30 dark:bg-slate-900 select-none h-fit min-h-screen scroll-smooth scroll-mr-2 scroll-p-2 touch-auto transition-all">
      <audio
        src={song?.downloadUrl[song?.downloadUrl?.length - 1].url}
        ref={audioElement}
        onTimeUpdate={onPlaying}
      />
      <Header setQ={setQ} query={query} setQuery={setQuery} />
      <Routes>
        <Route path="/" element={<Home setPlay={setPlay} q={q} />}>
          <Route index element={<Home setPlay={setPlay} q={q} />} />
        </Route>
        <Route path="/user" element={<User />} />
        <Route
          path="/show/:id"
          element={
            <Show
              play={play}
              setPlay={setPlay}
              song={song}
              setSong={setSong}
              audioTrack={audioTrack}
              setAudioTrack={setAudioTrack}
              audioElement={audioElement}
              isLoop={isLoop}
              setIsLoop={setIsLoop}
              forwd={forwd}
              setForwd={setForwd}
              onceLoop={onceLoop}
              setOnceLoop={setOnceLoop}
              songData={songData}
              setSongData={setSongData}
              q={q}
            />
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

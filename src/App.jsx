import React, { useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import User from "./components/User";
import Show from "./components/Show";
import Playbar from "./components/Playbar";

import debounce from "lodash/debounce";
import axios from "axios";

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

  const dragRef = useRef();
  const [isOnShow, setIsOnShow] = useState(false);
  const [isSongExist, setIsSongExist] = useState(false);

  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const [tracks, setTracks] = useState();
  const [songId, setSongId] = useState();

  const [changeSong, setChangeSong] = useState(false);

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
      setOnceLoop(false);
      setForwd(true);
      setIsLoop(false);
      audioElement.current.currentTime = 0;
    } else if (currentTime == duration && forwd) {
      skipForward();
      audioElement.current.currentTime = 0;
    } else if (currentTime >= 3) {
      setChangeSong(false);
    }
  };

  const togglePlay = () => {
    setPlay(!play);
  };

  const skipBack = (e) => {
    const currentTime = audioElement.current.currentTime;
      switch (e.detail) {
        case 1:
          if (currentTime >= 3)
            setChangeSong(true);
          break;
        case 2:
          setChangeSong(true);
          break;
      }

    audioElement.current.currentTime = 0;
    if (changeSong) {
      const newIndex = index === 0 ? songData?.length - 1 : index - 1;
    setIndex(newIndex);
    setSong(songData[newIndex]);
    setSongId(songData[newIndex]?.songId);
    if (!isOnShow) navigate(`/show/${songId}`);
    }
  };

  const skipForward = () => {
    const newIndex = index === songData?.length - 1 ? 0 : index + 1;
    setIndex(newIndex);
    setSong(songData[newIndex]);
    setSongId(songData[newIndex]?.songId);
    if (!isOnShow) navigate(`/show/${songId}`);
  };

  let setConditions = () => {
    if (forwd) {
      setOnceLoop(true);
      setIsLoop(false);
      setForwd(false);
    } else if (onceLoop) {
      setIsLoop(true);
      setOnceLoop(false);
      setForwd(false);
    } else {
      setForwd(true);
      setOnceLoop(false);
      setIsLoop(false);
    }
  };

  const fetchData = async () => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_WEB_URL}/api/search/songs`,
      params: { query: q === "" ? "bollywood" : q, limit: 100000 },
    };

    try {
      const { data } = await axios.request(options);
      setTracks(data?.data?.results);
      setIsSongExist(true);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchsongData = async () => {
    const options = {
      method: "GET",
      url: `https://saavn.dev/api/songs/${songId}`,
    };

    try {
      const { data } = await axios.request(options);
      setSongData(data.data[0]);
      setSong(data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedFetchSongData = useRef(debounce(fetchsongData, 500)).current;

  const fetchSuggestions = async (songId) => {
    if (!songId) {
      console.error("No song ID found.");
      return null;
    }
    const options = {
      method: "GET",
      url: `https://saavn.dev/api/songs/${songId}/suggestions`,
    };
    try {
      const { data } = await axios.request(options);
      if (data && data?.data) {
        setSongData(data?.data);
        return data?.data;
      } else {
        console.error("No suggestions data found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return null;
    }
  };

  const updatePlaybar = (e) => {
    try {
      // Get the bounding rectangle of the playbar
      const barRect = dragRef.current.getBoundingClientRect();
      // Calculate the width of the playbar
      const barWidth = barRect.width;
      // Calculate the offset of the click event within the playbar
      const clickOffsetX = e.clientX - barRect.left;
      // Calculate the new position of the playbar based on the click position
      const newProgress = (clickOffsetX / barWidth) * 100;
      // Update the progress of the audio track
      setAudioTrack({ ...audioTrack, progress: newProgress });

      // Update the current time of the audio element
      const newCurrentTime = (clickOffsetX / barWidth) * audioTrack?.length;
      audioElement.current.currentTime = newCurrentTime;
    } catch (error) {
      console.error("An error occurred while updating playbar:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [q]);

  useEffect(() => {
    fetchsongData();
  }, [songId]);

  useEffect(() => {
    if (play) {
      audioElement.current.play();
    } else {
      audioElement.current.pause();
    }
  }, [play, skipBack, skipForward]); // Only run this effect when the `play` `skipBack` or `skipForward` state changes

  useEffect(() => {
    // Retrieve the song string from localStorage
    const savedSongString = localStorage.getItem("savedQuery");
    const savedSongDataString = localStorage.getItem("savedData");
    const savedAudioTrackString = localStorage.getItem("savedAudioTrack");
    const savedIndex = localStorage.getItem("savedIndex");
    const savedAudioTrackState = localStorage.getItem("savedAudioTrackState");

    // Check if all necessary data is available in localStorage
    if (
      savedSongString &&
      savedIndex !== null &&
      savedSongDataString &&
      savedAudioTrackString
    ) {
      try {
        // Parse the song string back into an object using JSON.parse
        const savedSong = JSON.parse(savedSongString);
        const savedSongData = JSON.parse(savedSongDataString);
        const savedAudioTrack = JSON.parse(savedAudioTrackString);

        // Set the retrieved data into state variables
        setSong(savedSong);
        setSongData(savedSongData);
        setIndex(parseInt(savedIndex));
        setAudioTrack(savedAudioTrack);
        setPlay(savedAudioTrackState === "true");

        // Ensure audioTrack is defined before accessing its properties
        if (
          savedAudioTrack &&
          savedAudioTrack.progress !== undefined &&
          savedAudioTrack.length !== undefined
        ) {
          audioElement.current.currentTime =
            (savedAudioTrack.progress / 100) * savedAudioTrack.length;
          audioElement.current.play();
        } else {
          // Handle the case where the saved audio track data is incomplete or missing
          console.error("Saved audio track data is incomplete or missing");
        }
      } catch (error) {
        console.error("Error parsing saved song:", error);
        // Optionally handle the error here
      }
    }
  }, []); // Run this effect only once, on component mount

  useEffect(() => {
    // Convert the song object to a string using JSON.stringify
    const songString = JSON.stringify(song);
    const songDataString = JSON.stringify(songData);
    const audioTrackString = JSON.stringify(audioTrack);

    // Check if the index is a valid number
    if (
      !isNaN(index) &&
      typeof songString !== "undefined" &&
      typeof songData !== "undefined" &&
      typeof audioTrackString !== "undefined"
    ) {
      localStorage.setItem("savedIndex", index);
      localStorage.setItem("savedQuery", songString);
      localStorage.setItem("savedData", songDataString);
      localStorage.setItem("savedAudioTrack", audioTrackString);
      localStorage.setItem("savedAudioTrackState", play);
    }
  }, [song, index, audioTrack, play]);

  useEffect(() => {
    debouncedFetchSongData();
  }, [songId]);

  useEffect(() => {
    if (song && song?.id) {
      fetchSuggestions(song?.id);
    }
  }, [song]);

  useEffect(() => {
    fetchSongsData();
  }, [q]);

  const fetchSongsData = async () => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_WEB_URL}/api/search/songs`,
      params: { query: q === "" ? "bollywood" : q, limit: 100000 },
    };

    try {
      const { data } = await axios.request(options);
      setTracks(data?.data?.results);
    } catch (error) {
      console.error(error);
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
        <Route
          path="/"
          element={
            <Home
              setPlay={setPlay}
              setIsOnShow={setIsOnShow}
              q={q}
              tracks={tracks}
            />
          }
        >
          <Route index element={<Home />} />
        </Route>
        <Route
          path="/user"
          element={
            <User
              setIsOnShow={setIsOnShow}
              q={q}
              setPlay={setPlay}
              tracks={tracks}
            />
          }
        />
        <Route
          path="/show/:id"
          element={
            <Show
              setPlay={setPlay}
              song={song}
              q={q}
              setSongId={setSongId}
              tracks={tracks}
              setIsOnShow={setIsOnShow}
            />
          }
        />
      </Routes>
      <Playbar
        audioTrack={audioTrack}
        audioElement={audioElement}
        dragRef={dragRef}
        updatePlaybar={updatePlaybar}
        skipBack={skipBack}
        togglePlay={togglePlay}
        skipForward={skipForward}
        setConditions={setConditions}
        play={play}
        isLoop={isLoop}
        forwd={forwd}
        song={song}
        isOnShow={isOnShow}
        isSongExist={isSongExist}
      />

      <Footer />
    </div>
  );
};

export default App;

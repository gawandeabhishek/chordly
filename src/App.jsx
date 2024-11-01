import React, { useEffect, useRef, useState } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import Playbar from "./components/Playbar";
import Show from "./components/Show";
import User from "./components/User";

import axios from "axios";
import debounce from "lodash/debounce";

import { initGA, logPageView } from './analytics';

const App = () => {
  const { id } = useParams();
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
  const [songId, setSongId] = useState(id);

  const [changeSong, setChangeSong] = useState(false);

  const isDragging = useRef(false);
  const newCurrentTimeRef = useRef(0);

  const [option, setOption] = useState("All");
  const [playlists, setPlaylists] = useState();
  const [albums, setAlbums] = useState();
  const [artists, setArtists] = useState();
  const [displayType, setDisplayType] = useState("");
  const [songs, setSongs] = useState([]);
  const [isSong, setIsSong] = useState();

  const location = useLocation();

  useEffect(() => {
    initGA();   // Initialize Google Analytics
    logPageView();  // Log initial page load
  }, []);

  useEffect(() => {
    logPageView();
  }, [location]);

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

    if (isDragging.current) {
      setAudioTrack({
        ...audioTrack,
        progress: (newCurrentTimeRef.current / audioTrack?.length) * 100,
      });
    }
  };

  const togglePlay = () => {
    setPlay(!play);
  };

  const skipBack = (e) => {
    const currentTime = audioElement.current.currentTime;
    switch (e.detail) {
      case 1:
        if (currentTime >= 3) setChangeSong(true);
        break;
      case 2:
        setChangeSong(true);
        break;
    }
    if (index == 0) {
      skipForward();
    } else {
      setSong(songs[index]);
      setIndex(index - 1);
    }

    audioElement.current.currentTime = 0;
    setAudioTrack({ ...audioTrack, progress: 0 });
    if (changeSong) {
      setSong(songs[index]);
      setSongId(songs[index + 1]?.id);
      if (!isOnShow) navigate(`/show/${songs[index + 1]?.id}`);
    } else {
      console.error("No previous song data found.");
    }
  };

  const skipForward = async () => {
    if (index != 0) {
      setSongs([...songs, song]);
      setIndex(songs.length - 1);
    } else {
      setSongs([song, ...songs]);
      setIndex(0);
    }

    let data;
    if (songId && isSong === "song") {
      data = await fetchSuggestions();
    } else {
      data = songs[(index + 1) % songs.length];
      setIndex(index + 1);
    }
    
    console.log(songs);
    if (data) {
      setIndex(index + 1);
      setSong(data);
      setSongId(data.id);
      if (!isOnShow) navigate(`/show/${data.id}`);
      audioElement.current.currentTime = 0;
      setAudioTrack({ ...audioTrack, progress: 0 });
    } else {
      console.error("No data or invalid suggestions data received");
    }
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
      setTracks(
        data?.data?.results?.map((track) => ({
          ...track,
          type: "song",
        }))
      );
      setIsSongExist(true);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchplaylistData = async () => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_WEB_URL}/api/search/playlists`,
      params: { query: q === "" ? "bollywood" : q, limit: 100000 },
    };

    try {
      const { data } = await axios.request(options);
      setPlaylists(
        data?.data?.results?.map((track) => ({
          ...track,
          type: "playlist",
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchalbumData = async () => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_WEB_URL}/api/search/albums`,
      params: { query: q === "" ? "bollywood" : q, limit: 100000 },
    };

    try {
      const { data } = await axios.request(options);
      setAlbums(
        data?.data?.results?.map((track) => ({
          ...track,
          type: "album",
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchartistData = async () => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_WEB_URL}/api/search/artists`,
      params: { query: q === "" ? "bollywood" : q, limit: 100000 },
    };

    try {
      const { data } = await axios.request(options);
      setArtists(
        data?.data?.results?.map((track) => ({
          ...track,
          type: "artist",
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchsongData = async () => {
    if (songId === undefined) {
      return null;
    }
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_WEB_URL}/api/songs/${songId}`,
    };

    try {
      const { data } = await axios.request(options);
      setSong(data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedFetchSongData = useRef(debounce(fetchsongData, 500)).current;

  const fetchSuggestions = async () => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_WEB_URL}/api/songs/${songId}/suggestions`,
    };
    try {
      const { data } = await axios.request(options);
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        const index = Math.floor(Math.random() * data.data.length);
        setIndex(index);
        setSongData(data.data);
        setSong(data.data[index]);
        setSongId(data.data[index]?.id);
        return data.data[index];
      } else {
        console.error("No suggestions data found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return null;
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    updatePlaybar(e);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      updatePlaybar(e);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    if (audioElement.current) {
      audioElement.current.currentTime = newCurrentTimeRef.current;
    }
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    updatePlaybar(e);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    if (isDragging.current) {
      updatePlaybar(e);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    // Update the audio element's current time
    if (audioElement.current) {
      audioElement.current.currentTime = newCurrentTimeRef.current;
    }
  };

  const updatePlaybar = (e) => {
    try {
      // Get the bounding rectangle of the playbar
      const barRect = dragRef.current.getBoundingClientRect();
      // Calculate the width of the playbar
      const barWidth = barRect.width;
      // Calculate the offset of the click event within the playbar
      const clickOffsetX = (e.clientX || e.touches[0].clientX) - barRect.left;
      // Calculate the new position of the playbar based on the click position
      const newProgress = (clickOffsetX / barWidth) * 100;
      // Update the progress of the audio track
      setAudioTrack({ ...audioTrack, progress: newProgress });

      // Update the current time of the audio element
      const newCurrentTime = (clickOffsetX / barWidth) * audioTrack?.length;
      newCurrentTimeRef.current = newCurrentTime; // Store the new current time
    } catch (error) {
      console.error("An error occurred while updating playbar:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchalbumData();
    fetchplaylistData();
    fetchartistData();
  }, [q]);

  useEffect(() => {
    if (songId != null) fetchsongData();
  }, [songId]);

  useEffect(() => {
    if (play) {
      audioElement.current.autoPlay = true;
      audioElement.current.play();
    } else {
      audioElement.current.pause();
    }
  }, [play, skipBack, skipForward]); // Only run this effect when the `play` `skipBack` or `skipForward` state changes

  useEffect(() => {
    setQ("");
  }, [location]);

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
    if (songId !== null && isSong === "song") {
      fetchSuggestions(songId);
    }
  }, [index === songData?.length - 1]);

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
              setQ={setQ}
              tracks={tracks}
              playlists={playlists}
              albums={albums}
              artists={artists}
              setOption={setOption}
              option={option}
              setDisplayType={setDisplayType}
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
              playlists={playlists}
              albums={albums}
              artists={artists}
              setOption={setOption}
              option={option}
              setDisplayType={setDisplayType}
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
              setQ={setQ}
              setSongId={setSongId}
              tracks={tracks}
              playlists={playlists}
              albums={albums}
              artists={artists}
              setIsOnShow={setIsOnShow}
              setOption={setOption}
              option={option}
              displayType={displayType}
              setDisplayType={setDisplayType}
              songs={songs}
              setSongs={setSongs}
              setIsSong={setIsSong}
              setIndex={setIndex}
              isSong={isSong}
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
        handleMouseDown={handleMouseDown}
        handleTouchStart={handleTouchStart}
        newCurrentTimeRef={newCurrentTimeRef}
        setIsOnShow={setIsOnShow}
      />

      <Footer />
    </div>
  );
};

export default App;

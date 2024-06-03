import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import axios from "axios";
import he from "he";

const Show = ({ play, setPlay, song, setSong, audioTrack, isLoop, setIsLoop, forwd, setForwd, onceLoop, setOnceLoop, setAudioTrack, songData, setSongData, audioElement, q }) => {
  const { id } = useParams();
  const [index, setIndex] = useState(0);
  const dragRef = useRef();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState();

  useEffect(() => {
    fetchData();
  }, [q]);

  const fetchData = async () => {
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

  useEffect(() => {
    fetchsongData();
  }, [id]);

  useEffect(() => {
    if (play) {
      audioElement.current.play();
    } else {
      audioElement.current.pause();
    }
  }, [play]); // Only run this effect when the `play` state changes

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

  const fetchsongData = async () => {
    const options = { method: "GET", url: `https://saavn.dev/api/songs/${id}` };

    try {
      const { data } = await axios.request(options);
      setSongData(data.data[0]);
      setSong(data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedFetchSongData = useRef(debounce(fetchsongData, 500)).current;

  useEffect(() => {
    debouncedFetchSongData();
  }, [id]);

  const togglePlay = () => {
    setPlay(!play);
  };

  useEffect(() => {
    if (song && song?.id) {
      fetchSuggestions(song?.id);
    }
  }, [song]);

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

  const skipBack = async () => {
    const newIndex = index === 0 ? songData?.length - 1 : index - 1;
    setIndex(newIndex);
    setSong(songData[newIndex]);
    navigate(`/show/${songData[newIndex]?.id}`);
    location.reload();
  };

  const skipForward = async () => {
    const newIndex = index === songData?.length - 1 ? 0 : index + 1;
    setIndex(newIndex);
    setSong(songData[newIndex]);
    navigate(`/show/${songData[newIndex]?.id}`);
    location.reload();
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

  const entites = {
    "&#039;": "'",
    "&quot;": '"',
  };

  return (
    <>
      {q === "" ? (
        <div className="min-h-[calc(100vh-12rem)]">
          <div className="flex items-center justify-center flex-col sm:flex-row gap-10 sm:gap-20 mx-16 mt-8 mb-20 sm:m-16">
            <img
              src={song?.image[song?.image?.length - 1]?.url}
              alt={song?.name}
              className="rounded-md w-[90%] sm:w-[25%] cursor-pointer"
            />
            <div className="flex flex-col items-start justify-center gap-4 w-fit">
              <h4 className="font-bold text-3xl sm:text-5xl text-slate-900 dark:text-slate-50 w-fit mx-2 cursor-pointer">
                {song ? he.decode(song?.name) : null}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-lg w-[50%] mx-2 cursor-pointer">
                {song?.artists?.primary?.map((singers, idx) => (
                  <span key={idx}>
                    {singers?.name}
                    <span>
                      {idx == song?.artists?.primary?.length - 1 ? "" : ", "}
                    </span>
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-white/50 dark:bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center gap-2 py-4">
            <div className="relative w-full flex items-center justify-center gap-2 py-2 px-6 sm:px-20 cursor-pointer z-50">
              <p className="text-xs font-semibold text-slate-700 dark:text-white">
                {(audioTrack?.progress / 60).toFixed(2) === "NaN"
                  ? ""
                  : (audioElement?.current?.currentTime / 60).toFixed(2)}
              </p>
              <div
                className="w-full h-1 bg-gray-200 group dark:bg-gray-700 relative rounded-full overflow-hidden group cursor-pointer"
                ref={dragRef}
                onClick={updatePlaybar}
              >
                <div
                  className="w-full h-1 bg-slate-700 dark:bg-white group-hover:bg-slate-400 rounded-full absolute z-10 flex items-center justify-end"
                  style={{ left: `calc(${audioTrack?.progress}% - 100%)` }}
                >
                  <div className="h-3 w-3 bg-transparent fixed group-hover:bg-slate-700 dark:group-hover:bg-white rounded-full z-20 cursor-pointer -mr-1.5" />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-white">
                {(audioTrack?.length / 60).toFixed(2) === "NaN"
                  ? ""
                  : (audioTrack?.length / 60).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <div
                className="bg-slate-500/10 p-2 rounded-full text-slate-800 dark:text-slate-200 cursor-pointer"
                onClick={skipBack}
              >
                <SkipBack />
              </div>
              <div
                onClick={togglePlay}
                className="bg-slate-500/10 p-2 rounded-full text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                {play ? (
                  <Pause className="text-cyan-700 dark:text-cyan-500" />
                ) : (
                  <Play />
                )}
              </div>
              <div
                className="bg-slate-500/10 p-2 rounded-full text-slate-800 dark:text-slate-200 cursor-pointer"
                onClick={skipForward}
              >
                <SkipForward />
              </div>
              <div
                className="bg-slate-500/10 p-2 rounded-full cursor-pointer"
                onClick={setConditions}
              >
                {isLoop ? (
                  <Repeat1 className="text-cyan-700 dark:text-cyan-500" />
                ) : forwd ? (
                  <Shuffle className="text-slate-800 dark:text-slate-200" />
                ) : (
                  <Repeat className="text-teal-700 dark:text-teal-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-10 mb-10 min-h-[calc(100vh-10rem)] m-2 flex flex-wrap gap-4 items-center justify-around">
          {tracks?.map((data, idx) => (
            <Link
              to={`/show/${data?.id}`}
              onClick={() => {
                setPlay(true);
                history.push(`/show/${data?.id}`);
              }}
              key={idx}
            >
              <div className="w-48 h-[20rem] p-2 rounded-md bg-white dark:bg-slate-900/20 gap-2 flex flex-col items-center justify-start cursor-pointer hover:p-2 transition-all">
                <img
                  src={data?.image[data.image.length - 1]?.url}
                  alt={data?.name}
                  className="rounded-md"
                />
                <h4 className="font-bold text-slate-900 text-center w-fit dark:text-slate-50 mx-2">
                  {he.decode(data?.name)}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-center text-xs w-[90%] mx-2 truncate">
                  {data?.artists?.primary?.map((singers, idx) => (
                    <span key={idx}>
                      {singers?.name}
                      <span>
                        {idx == data?.artists?.primary?.length - 1 ? "" : ", "}
                      </span>
                    </span>
                  ))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Show;

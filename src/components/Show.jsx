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
import { useParams, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import axios from "axios";

const Show = ({ play, setPlay, audioElement }) => {
  const [song, setSong] = useState();
  const [songData, setSongData] = useState();
  const [audioTrack, setAudioTrack] = useState();
  const { id } = useParams();
  const [isLoop, setIsLoop] = useState(false);
  const [forwd, setForwd] = useState(true);
  const [onceLoop, setOnceLoop] = useState(false);
  const [index, setIndex] = useState(0);
  const dragRef = useRef();

  useEffect(() => {
    fetchsongData();
  }, [id]);
  
useEffect(() => {
    if (play) {
      audioElement.current.play();
    } else {
      audioElement.current.pause();
    }
  });
  useEffect(() => {
    // Retrieve the song string from localStorage
    const savedSongString = localStorage.getItem("savedQuery");
    const savedSongDataString = localStorage.getItem("savedData");
    const savedAudioTrackString = localStorage.getItem("savedAudioTrack");
    const savedIndex = localStorage.getItem("savedIndex");
    const savedAudioTrackState = localStorage.getItem("savedAudioTrackState");
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
        setSong(savedSong);
        setSongData(savedSongData);
        setIndex(parseInt(savedIndex));
        setAudioTrack(savedAudioTrack);
        setPlay(savedAudioTrackState === "true");
        
          audioElement.current.currentTime = audioTrack.progress / 100 * audioTrack.length;
          audioElement.current.play();
      } catch (error) {
        console.error("Error parsing saved song:", error);
        // Optionally handle the error here
      }
    }
  }, [!audioTrack]);

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
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_WEB_URL}/api/search/songs`,
      params: { query: id },
    };
    try {
      const { data } = await axios.request(options);
      setSongData(data.data.results);
      setSong(data.data.results[index]);
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

  const skipBack = async () => {
    const newIndex = index === 0 ? songData.length - 1 : index - 1;
    setIndex(newIndex);
    setSong(songData[newIndex]);

    setAudioTrack({
      progress: 0, // Reset progress when skipping back
      length: audioElement.current.duration,
    });
  };

  const skipForward = () => {
    const newIndex = index === songData.length - 1 ? 0 : index + 1;
    setIndex(newIndex);
    setSong(songData[newIndex]);

    setAudioTrack({
      progress: 0, // Reset progress when skipping forward
      length: audioElement.current.duration,
    });
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

  return (
    <div className="min-h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-center flex-col sm:flex-row gap-10 sm:gap-20 mx-16 mt-8 mb-20 sm:m-16">
        <img
          src={song?.image[song?.image.length - 1].url}
          alt={song?.name}
          className="rounded-md w-[90%] sm:w-[25%] cursor-pointer"
        />
        <div className="flex flex-col items-start justify-center gap-4 w-fit">
          <h4 className="font-bold text-3xl sm:text-5xl text-slate-900 dark:text-slate-50 w-fit mx-2 cursor-pointer">
            {song?.name}
          </h4>
          <p className="text-slate-600 dark:text-slate-400 text-lg w-[50%] mx-2 cursor-pointer">
            {song?.artists.primary.map((singers, idx) => (
              <span key={idx}>
                {singers.name}
                <span>
                  {idx == song?.artists.primary.length - 1 ? "" : ", "}
                </span>
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/50 dark:bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center gap-2 py-4">
        <div className="relative w-full flex items-center justify-center group gap-2 py-2 px-6 sm:px-20 cursor-pointer z-50">
          <p className="text-xs font-semibold text-slate-700 dark:text-white">
            {(audioTrack?.progress / 60).toFixed(2) === "NaN"
              ? ""
              : (audioElement.current.currentTime / 60).toFixed(2)}
          </p>
          <div
            className="w-full h-1 bg-gray-200 dark:bg-gray-700 relative rounded-full overflow-hidden group cursor-pointer"
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
          <audio
            src={song?.downloadUrl[song?.downloadUrl.length - 1].url}
            ref={audioElement}
            onTimeUpdate={onPlaying}
          />
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
            {play ? <Pause className="text-cyan-700 dark:text-cyan-500" /> : <Play />}
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
  );
};

export default Show;

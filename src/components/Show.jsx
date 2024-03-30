import { Pause, Play, Repeat1, SkipBack, SkipForward } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
let index = 0;

const Show = ({ play, setPlay, audioElement, query }) => {
  const [song, setSong] = useState();
  const [songData, setSongData] = useState();
  let { id } = useParams();
  const [audioTrack, setAudioTrack] = useState({});
  const [isLoop, setIsLoop] = useState(false);
  const dragRef = useRef();

  // useEffect(() => {
  //   dragRef.current.addEventListener("dragstart", (e) => {
  //     console.log(e);
  //   })
  // }, [])

  useEffect(() => {
    fetchsongData();
  }, []);

  useEffect(() => {
    if (play) {
      audioElement.current.play();
    } else {
      audioElement.current.pause();
    }
  }, [play]);

  const fetchsongData = async () => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_WEB_URL}/api/search/songs`,
      params: { query: query },
    };
    console.log(query)
    try {
      const { data } = await axios.request(options);
      setSongData(data.data.results);
      setSong(data.data.results[index]);
    } catch (error) {
      console.error(error);
    }
  };

  const togglePlay = () => {
    setPlay(!play);
  };

  const onPlaying = () => {
    const duration = audioElement.current.duration;
    const ct = audioElement.current.currentTime;

    setAudioTrack({ progress: (ct / duration) * 100, length: duration });
  };

  const skipBack = async () => {
    index = songData.findIndex((d) => d.id == song.id);
    if (index == 0) {
      setSong(songData[songData.length - 1]);
    } else {
      setSong(songData[index - 1]);
    }
    setPlay(false);

    setPlay(false);
    setAudioTrack({
      progress:
        (audioElement.current.currentTime = 0 / audioElement.current.duration) *
        100,
      length: audioElement.current.duration,
    });
  };

  const skipForward = () => {
    const index = songData.findIndex((d) => d.id == song.id);
    if (index == songData.length - 1) {
      setSong(songData[0]);
    } else {
      setSong(songData[index + 1]);
    }
    setPlay(false);

    setAudioTrack({
      progress:
        (audioElement.current.currentTime = 0 / audioElement.current.duration) *
        100,
      length: audioElement.current.duration,
    });
  };

  const repeat = () => {
    audioElement.current.loop = true;
  };

  return (
    <div className="min-h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-center flex-col sm:flex-row gap-10 sm:gap-20 mx-16 mt-0 mb-20 sm:m-16">
        <img
          src={song?.image[song?.image.length - 1].url}
          alt={song?.name}
          className="rounded-md w-[90%] sm:w-[25%] cursor-pointer"
        />
        <div className="flex flex-col items-start justify-center gap-4 w-fit">
          <h4 className="font-bold text-5xl text-slate-900 dark:text-slate-50 w-fit mx-2 cursor-pointer">
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
        <div className="relative w-full flex items-center justify-center group gap-2 py-2 px-28 cursor-pointer z-50">
          <p className="text-xs font-semibold text-slate-700 dark:text-white">
            {(audioTrack.progress / 60).toFixed(2) === "NaN"
              ? ""
              : (audioTrack.progress / 60).toFixed(2)}
          </p>
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 relative rounded-full overflow-hidden group cursor-pointer">
            <div
              className="w-full h-1 bg-slate-700 dark:bg-white group-hover:bg-slate-400 rounded-full absolute z-10 flex items-center justify-end"
              style={{ left: `calc(${audioTrack.progress}% - 100%)` }}
            >
              <div
                className="h-3 w-3 bg-transparent fixed group-hover:bg-slate-700 dark:group-hover:bg-white rounded-full z-20 cursor-pointer -mr-1.5"
                ref={dragRef}
              />
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-white">
            {(audioTrack.length / 60).toFixed(2) === "NaN"
              ? ""
              : (audioTrack.length / 60).toFixed(2)}
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
            {play ? <Pause className="text-rose-500" /> : <Play />}
          </div>
          <div
            className="bg-slate-500/10 p-2 rounded-full text-slate-800 dark:text-slate-200 cursor-pointer"
            onClick={skipForward}
          >
            <SkipForward />
          </div>
          {/* <div
            className="bg-slate-500/10 p-2 rounded-full text-slate-800 dark:text-slate-200 cursor-pointer"
            onClick={repeat}
          >
            <Repeat1 className={`${isLoop ? "text-rose-500" : ""}`} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Show;

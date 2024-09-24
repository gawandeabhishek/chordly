import React, { useEffect } from "react";
import he from "he";

const Song = ({ song, setIsSong, isSong }) => {
  useEffect(() => {
    if (isSong !== "notSong")
    setIsSong("song");
  }, [])
  
  return (
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
    </div>
  );
};

export default Song;

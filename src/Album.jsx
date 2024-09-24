import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import he from "he";
import axios from "axios";

const Album = ({
  id,
  setDisplayType,
  songs,
  setSongs,
  setIsSong,
  setIndex,
}) => {
  const [album, setAlbum] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: `${import.meta.env.VITE_WEB_URL}/api/albums?id=${id}`,
      };

      try {
        const { data } = await axios.request(options);
        setAlbum(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const handleSongClick = (data) => {
    setDisplayType(data?.type);
  };

  useEffect(() => {
    if (album?.songs) {
      setIndex(1);
      setSongs([...album?.songs]);
    }
    setIsSong("notSong");
  }, [album]);

  return (
    <main className="m-2 mx-10 mb-10 min-h-[calc(100vh-10rem)]">
      {album && (
        <div className="flex sm:h-[20rem] gap-16 items-center flex-col sm:flex-row justify-center sm:justify-normal pb-8 sm:pb-0">
          <img
            src={album?.image?.[album?.image.length - 1]?.url}
            alt={album?.name}
            className="h-64 w-64 rounded-md"
          />
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50">
              {he.decode(album?.name)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {he.decode(album?.description)}
            </p>
            <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-50">
              Year: {album?.year || "N/A"}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              No of songs:{" "}
              <span className="font-bold">{album?.songCount || 0}</span>
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center justify-around">
        {album?.songs?.map((song, idx) => (
          <div onClick={() => handleSongClick(song)}>
            <Link to={`/show/${song?.id}`}>
              <div
                key={idx}
                className="w-48 h-[20rem] p-2 rounded-md bg-white dark:bg-slate-900/20 gap-2 flex flex-col items-center justify-start cursor-pointer hover:p-2 transition-all"
                onClick={() => navigate(`/show/${song?.id}`)}
              >
                <img
                  src={song?.image?.[song?.image.length - 1]?.url}
                  alt={song?.name}
                  className="rounded-md"
                />
                <h4 className="font-bold text-slate-900 text-center w-fit dark:text-slate-50 mx-2">
                  {he.decode(song?.name || "")}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-center text-xs w-[90%] mx-2 truncate">
                  {song?.artists?.primary?.map((artist, artistIdx) => (
                    <span key={artistIdx}>
                      {he.decode(artist?.name || "")}
                      <span>
                        {artistIdx === song?.artists?.primary.length - 1
                          ? ""
                          : ", "}
                      </span>
                    </span>
                  ))}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Album;

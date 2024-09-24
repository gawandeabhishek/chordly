import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import he from "he";
import axios from "axios";

const Playlist = ({
  id,
  setDisplayType,
  songs,
  setSongs,
  setIsSong,
  setIndex,
}) => {
  const [playlst, setPlaylst] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: `${import.meta.env.VITE_WEB_URL}/api/playlists?id=${id}`,
      };

      try {
        const { data } = await axios.request(options);
        setPlaylst(data?.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (playlst?.songs) {
      setIndex(1);
      setSongs([...playlst?.songs]);
    }
    setIsSong("notSong");
  }, [playlst]);

  const handleSongClick = () => {
    setDisplayType("song");
  };

  return (
    <main className="m-2 mx-10 mb-10 min-h-[calc(100vh-10rem)]">
      <div className="flex sm:h-[20rem] gap-16 items-center flex-col sm:flex-row justify-center sm:justify-normal pb-8 sm:pb-0">
        <img
          src={playlst?.image?.[playlst?.image.length - 1]?.url}
          alt={playlst?.name}
          className="h-64 w-64 rounded-md"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50">
            {he.decode(playlst?.name || "")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {he.decode(playlst?.description || "No description available")}
          </p>
          <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-50">
            Year: {playlst?.year || "N/A"}
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            No of songs:{" "}
            <span className="font-bold">{playlst?.songCount || 0}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-around">
        {playlst?.songs?.map((song, idx) => (
          <Link to={`/show/${song?.id}`} onClick={handleSongClick}>
            <div
              key={idx}
              className="w-28 h-[15rem] sm:w-48 sm:h-[20rem] p-2 rounded-md bg-white dark:bg-slate-900/20 gap-2 flex flex-col items-center justify-start cursor-pointer hover:p-2 transition-all"
              onClick={() => navigate(`/show/${song?.id}`)}
            >
              <img
                src={song?.image?.[song?.image.length - 1]?.url}
                alt={song?.name}
                className="rounded-md"
              />
              <h4 className="text-xs sm:text-base font-bold text-slate-900 text-center w-fit dark:text-slate-50 mx-2">
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
        ))}
      </div>
    </main>
  );
};

export default Playlist;

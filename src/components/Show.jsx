import he from "he";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Song from "./Song";
import Playlist from "./Playlist";
import Album from "../Album";
import Artist from "./Artist";

const Show = ({
  setPlay,
  song,
  q,
  setQ,
  setSongId,
  tracks,
  setIsOnShow,
  option,
  setOption,
  playlists,
  albums,
  artists,
  displayType,
  setDisplayType,
  songs,
  setSongs,
  setIsSong,
  setIndex,
  isSong
}) => {
  const { id } = useParams();
console.log(isSong);
  useEffect(() => {
    setSongId(id);
  }, [id]);

  useEffect(() => {
    setIsOnShow(false);
  }, []);

  const setToSong = () => {
    setPlay(true);
    setDisplayType("song");
    setQ("");
  };

  const [displayData, setDisplayData] = useState([]);

  const combineAndShuffle = (...arrays) =>
    arrays.flat().sort(() => Math.random() - 0.5);

  const combinedAndShuffled = useMemo(
    () => combineAndShuffle(tracks, artists, playlists, albums),
    [tracks, artists, playlists, albums]
  );

  const optionsMap = {
    Songs: tracks,
    Playlists: playlists,
    Albums: albums,
    Artists: artists,
    All: combinedAndShuffled,
  };

  useEffect(() => {
    setIsOnShow(true);
  }, []);

  useEffect(() => {
    if (optionsMap[option]) setDisplayData(optionsMap[option]);
  }, [option, optionsMap]);

  const onCardClick = (data) => {
    setPlay(true);
    setDisplayType(data?.type);
    setQ("");
  };

  return (
    <>
      {q === "" ? (
        displayType === "song" ? (
          <Song song={song} setIsSong={setIsSong} isSong={isSong} />
        ) : displayType === "playlist" ? (
          <Playlist
            id={id}
            setDisplayType={setDisplayType}
            songs={songs}
            setSongs={setSongs}
            setIsSong={setIsSong}
            setIndex={setIndex}
          />
        ) : displayType === "album" ? (
          <Album
            id={id}
            setDisplayType={setDisplayType}
            setToSong={setToSong}
            setSongs={setSongs}
            songs={songs}
            setIsSong={setIsSong}
            setIndex={setIndex}
          />
        ) : displayType === "artist" ? (
          <Artist
            id={id}
            setSongs={setSongs}
            songs={songs}
            setIsSong={setIsSong}
            setIndex={setIndex}
          />
        ) : null
      ) : (
        <div className="mx-10 mb-10 min-h-[calc(100vh-10rem)] m-2">
          <ul className="flex gap-4 flex-wrap">
            {["All", "Songs", "Playlists", "Albums", "Artists"].map(
              (item, key) => (
                <li
                  key={key}
                  className={`px-4 py-1 rounded-3xl border-2 border-slate-300 ${
                    option === item
                      ? "bg-slate-500 dark:bg-slate-700 text-slate-300"
                      : "bg-transparent text-slate-800 dark:text-slate-300"
                  } cursor-pointer`}
                  onClick={() => {
                    setOption(item);
                  }}
                >
                  {item}
                </li>
              )
            )}
          </ul>
          <div className="flex flex-wrap gap-4 items-center justify-around">
            {displayData && !displayData.every((item) => item === undefined) ? (
              displayData?.map((data, idx) => (
                <div onClick={() => onCardClick(data)}>
                  <Link to={`/show/${data?.id}`} key={idx}>
                    <div className="w-48 h-[20rem] p-2 rounded-md bg-white dark:bg-slate-900/20 gap-2 flex flex-col items-center justify-start cursor-pointer hover:p-2 transition-all">
                      <img
                        src={data?.image?.[data?.image?.length - 1]?.url}
                        alt={data?.name}
                        className="rounded-md"
                      />
                      <h4 className="font-bold text-slate-900 text-center w-fit dark:text-slate-50 mx-2">
                        {he.decode(data?.name || "No name available")}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-center text-xs w-[90%] mx-2 truncate">
                        {data?.artists?.primary?.length > 0 ? (
                          data.artists.primary.map((singer, idx) => (
                            <span key={idx}>
                              {singer?.name}
                              {idx !== data.artists.primary.length - 1 && ", "}
                            </span>
                          ))
                        ) : (
                          <span>No artist information</span>
                        )}
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Show;

import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import he from "he";

const Home = ({
  setPlay,
  q,
  setQ,
  setIsOnShow,
  tracks,
  option,
  setOption,
  playlists,
  albums,
  artists,
  setDisplayType,
}) => {
  const [displayData, setDisplayData] = useState([]);
  const [type, setType] = useState();
  const navigate = useNavigate();

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
    <div className="m-2 mx-10 mb-10 min-h-[calc(100vh-10rem)]">
      <ul className="flex gap-4  flex-wrap">
        {["All", "Songs", "Playlists", "Albums", "Artists"].map((item, key) => (
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
        ))}
      </ul>
      <div className="flex flex-wrap gap-4 items-center justify-around">
        {displayData && !displayData.every((item) => item === undefined) ? (
          displayData?.map((data, idx) => (
            <div onClick={() => onCardClick(data)}>
              <Link
                to={`/show/${data?.id}`}
                key={idx}
              >
                <div className="w-28 h-[15rem] sm:w-48 sm:h-[20rem] p-2 rounded-md bg-white dark:bg-slate-900/20 gap-2 flex flex-col items-center justify-start cursor-pointer hover:p-2 transition-all">
                  <img
                    src={data?.image?.[data?.image?.length - 1]?.url}
                    alt={data?.name}
                    className="rounded-md"
                  />
                  <h4 className="text-xs sm:text-base font-bold text-slate-900 text-center w-fit dark:text-slate-50 mx-2">
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
  );
};

export default Home;

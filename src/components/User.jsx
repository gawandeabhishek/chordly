import { Heart, ListMusic, UserPlus, AppWindow } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import he from "he";

const User = ({
  setIsOnShow,
  q,
  setPlay,
  tracks,
  setOption,
  option,
  playlists,
  albums,
  artists,
  setDisplayType
}) => {
  useEffect(() => {
    setIsOnShow(true);
  }, []);

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
      {q == "" ? (
        <div className="flex min-h-[calc(100vh-10rem)] items-center mt-10 flex-col sm:flex-row gap-4 sm:gap-20 justify-center w-full">
          <img
            src="https://img.freepik.com/free-photo/3d-rendering-cartoon-like-man-working-computer_23-2150797572.jpg?t=st=1717509702~exp=1717513302~hmac=be46003896dac6f6511d8e0debf08f0e98a92a5cae3c7bd86c374e522978b68a&w=740"
            alt="programmerboyabhi"
            className="rounded-full w-[80%] sm:w-[26%] cursor-pointer m-0 sm:m-10"
          />
          <div className="gap-6 flex w-full items-center sm:items-start justify-center text-center sm:text-start flex-col">
            <h1 className="font-bold text-5xl dark:text-slate-200 w-fit cursor-text">
              Hi,{" "}
              <span className="text-pink-800 dark:text-rose-800">There</span>!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm w-[80%] cursor-text">
              I'm <span className="font-semibold">Abhishek Gawande</span>, a
              first-year college student well-versed in the MERN stack. Welcome
              to my project website! : &#41; <br />
              If you enjoy what you see, feel free to share it with your
              friends. Your support truly means everything to me. : &#41;
            </p>
            <p className="flex items-center justify-center gap-4 font-semibold text-sm sm:text-xl text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-4 px-4 py-2 bg-slate-500/10 rounded-full cursor-pointer">
                My playlist{" "}
                <ListMusic className="text-slate-800 dark:text-slate-200" />
              </span>
              <span className="flex items-center justify-center gap-4 px-4 py-2 bg-slate-500/10 rounded-full cursor-pointer">
                Liked songs{" "}
                <Heart className="text-pink-500 dark:text-rose-600" />
              </span>
            </p>
            <p className="flex items-center justify-center font-semibold text-sm sm:text-xl text-slate-800 ltr cursor-pointer">
              <span className="flex items-center justify-center gap-4 bg-pink-500 dark:bg-rose-600 h-10 px-4 text-slate-100 dark:text-slate-200 rounded-s-full">
                Followers <UserPlus />
              </span>
              <span className="flex items-center justify-center bg-slate-500/10 text-slate-800 dark:text-slate-200 h-10 px-4 rounded-e-full">
                100k+
              </span>
            </p>
            <p className="flex items-center justify-center gap-4 font-semibold text-sm sm:text-xl text-slate-800 dark:text-slate-200">
              <a href="https://abhishek-gawande.vercel.app/" target="_blank" className="flex items-center gap-4 px-4 py-2 bg-slate-500/10 rounded-full cursor-pointer">
                Portfolio{" "}
                <AppWindow className="text-slate-800 dark:text-slate-200" />
              </a>
            </p>
          </div>
        </div>
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
      )}
    </>
  );
};

export default User;

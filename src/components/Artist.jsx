import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import he from "he";
import axios from "axios";

const Artist = ({ id, songs, setSongs, setIsSong, setIndex }) => {
  const [data, setData] = useState();
  const info = async () => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_WEB_URL}/api/artists?id=${id}`,
    };

    try {
      const { data } = await axios.request(options);
      setData(data.data);
    } catch (error) {
      console.error(error);
    }
  };
  info();

  const handleSongClick = (data) => {
    setDisplayType(data?.type);
  };

  const handleArtistClick = () => {
    setDisplayType("artist");
  };

  useEffect(() => {
    if (data?.topSongs) {
      setIndex(1);
      setSongs([...data?.topSongs]);
    }
    setIsSong("notSong");
  }, [data]);

  return (
    <div className="m-2 mx-10 mb-10 min-h-[calc(100vh-10rem)]">
      <div className="flex sm:h-[20rem] gap-16 items-center flex-col sm:flex-row justify-center sm:justify-normal pb-8 sm:pb-0">
        <img
          className="h-64 w-64 rounded-md"
          src={data?.image[data?.image?.length - 1]?.url}
          alt={`${data?.name}`}
        />
        <div className="flex flex-col gap-4">
          <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50">
            {data?.name}
          </p>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400">
            <strong>Followers:</strong> {data?.followerCount}
          </p>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400">
            <strong>Fans:</strong> {data?.fanCount}
          </p>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400">
            <strong>Verified:</strong> {data?.isVerified ? "Yes" : "No"}
          </p>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400">
            <strong>Dominant Language:</strong> {data?.dominantLanguage}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50">
          Bio
        </h2>
        <p className="text-xs sm:text-sm sm:w-[60%] text-slate-600 dark:text-slate-400">
          {data && data.bio && data.bio.length > 0 ? data.bio[0].text : null}
        </p>

        <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400">
          Top Songs
        </h2>
        <div className="flex flex-wrap gap-4 items-center justify-around">
          {data?.topSongs?.map((song, idx) => (
            <div onClick={() => handleSongClick(song)}>
              <Link to={`/show/${song?.id}`}>
                <div
                  key={idx}
                  className="w-48 h-[20rem] p-2 rounded-md bg-white dark:bg-slate-900/20 gap-2 flex flex-col items-center justify-start cursor-pointer hover:p-2 transition-all"
                  onClick={() => navigate(`/show/${song?.id}`)}
                >
                  <img
                    src={song?.image?.[song?.image?.length - 1]?.url}
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

        <h2 className="text-2xl font-semibold mt-6 mb-2">Similar Artists</h2>
        <div className="flex flex-col gap-4">
          {data?.similarArtists.map((artist, idx) => (
            <Link
              to={`/show/${artist?.id}`}
              onClick={handleArtistClick}
              key={idx}
            >
              <div className="flex sm:h-[20rem] gap-16 items-center flex-col sm:flex-row justify-center sm:justify-normal pb-8 sm:pb-0">
                <img
                  className="h-64 w-64 rounded-md"
                  src={artist?.image[data?.image?.length - 1]?.url}
                  alt={`${artist?.name}`}
                />
                <div className="flex flex-col gap-4">
                  <p className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50">
                    {artist?.name}
                  </p>
                  <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400">
                    <strong>Followers:</strong> {artist?.followerCount}
                  </p>
                  <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400">
                    <strong>Verified:</strong>{" "}
                    {artist?.isVerified ? "Yes" : "No"}
                  </p>
                  <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400">
                    <strong>dominant Type:</strong> {artist?.dominantType}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Artist;

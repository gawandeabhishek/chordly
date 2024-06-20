import he from "he";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Show = ({
  setPlay,
  song,
  q,
  setSongId,
  tracks,
  setIsOnShow,
}) => {
  const { id } = useParams();

  useEffect(() => {
    setSongId(id);
  }, [id]);

  useEffect(() => {
    setIsOnShow(false);
  }, []);

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

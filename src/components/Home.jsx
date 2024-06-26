import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import he from "he";

const Home = ({ setPlay, q, setIsOnShow, tracks }) => {

  useEffect(() => {
    setIsOnShow(true);
  }, []);

  return (
    <div className="mx-10 mb-10 min-h-[calc(100vh-10rem)] m-2 flex flex-wrap gap-4 items-center justify-around">
      {tracks?.map((data, idx) => (
        <Link
          to={`/show/${data.id}`}
          onClick={() => {
            setPlay(true);
            history.push(`/show/${data?.data?.results}`);
            location.reload();
          }}
          key={idx}
        >
          <div className="w-48 h-[20rem] p-2 rounded-md bg-white dark:bg-slate-900/20 gap-2 flex flex-col items-center justify-start cursor-pointer hover:p-2 transition-all">
            <img
              src={data?.image[data?.image?.length - 1]?.url}
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
  );
};

export default Home;

import { Heart, ListMusic, UserPlus } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import he from "he";

const User = ({ setIsOnShow, q, setPlay, tracks }) => {
  useEffect(() => {
    setIsOnShow(true);
  }, []);

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
              I'm <span className="font-semibold">Abhishek Gawande</span>, a first-year
              college student well-versed in the MERN stack. Welcome to my
              project website! : &#41; <br />
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

export default User;

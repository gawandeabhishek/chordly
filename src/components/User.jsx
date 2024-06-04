import { Heart, ListMusic, UserPlus } from "lucide-react";
import React from "react";

const User = () => {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center mt-10 flex-col sm:flex-row gap-4 sm:gap-20 justify-center w-full">
      <img
        src="./programmerboyabhi.jpg"
        alt="programmerboyabhi"
        className="rounded-full w-[80%] sm:w-[26%] cursor-pointer m-0 sm:m-10"
      />
      <div className="gap-6 flex w-full items-center sm:items-start justify-center text-center sm:text-start flex-col">
        <h1 className="font-bold text-5xl dark:text-slate-200 w-fit cursor-text">
          Hi, <span className="text-pink-800 dark:text-rose-800">There</span>!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm w-[80%] cursor-text">
          I'm <span className="font-semibold">Abhishek Gawande</span>, a first-year college student well-versed in the
          MERN stack. Welcome to my project website! : &#41; <br />
          If you enjoy what you see, feel free to share it with your friends.
          Your support truly means everything to me. : &#41;
        </p>
        <p className="flex items-center justify-center gap-4 font-semibold text-sm sm:text-xl text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-4 px-4 py-2 bg-slate-500/10 rounded-full cursor-pointer">
            My playlist{" "}
            <ListMusic className="text-slate-800 dark:text-slate-200" />
          </span>
          <span className="flex items-center justify-center gap-4 px-4 py-2 bg-slate-500/10 rounded-full cursor-pointer">
            Liked songs <Heart className="text-pink-500 dark:text-rose-600" />
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
  );
};

export default User;

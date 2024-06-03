import axios from "axios";
import { Home, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const Header = ({ setQ, query, setQuery }) => {
  const [mode, setMode] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    changeTheme();
  }, []);

  let changeTheme = () => {
    if (mode == "dark") {
      document.documentElement.classList.remove("dark");
      setMode("");
    } else {
      document.documentElement.classList.add("dark");
      setMode("dark");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setShowMenu(false);
      inputRefs.current.forEach((ref) => {
        if (ref) {
          ref.value = "";
        }
      });
    }
  };

  const getQuery = () => {
    setQuery(inputRefs.current[0].value);
    setQ(inputRefs.current[0].value);
  };

  const getQueryMob = () => {
    setQuery(inputRefs.current[1].value);
    setQ(inputRefs.current[1].value);
  };

  const handleLinkClick = () => {
    setShowMenu(false);
    inputRefs.current.forEach((ref) => {
      if (ref) {
        ref.value = "";
      }
    });
  };

  return (
    <div className="sticky left-0 top-0 right-0 flex justify-between items-center px-10 bg-white/50 dark:bg-white/10 backdrop-blur-sm h-14 w-full">
      <div className="sm:flex gap-4 items-center hidden">
        <Link
          to={"/"}
          onClick={() => {
            window.location.href = `/`;
            setQ("");
          }}
        >
          <Home className="text-slate-800 dark:text-slate-300 cursor-pointer" />
        </Link>

        <button onClick={handleLinkClick}>
          <Search className="cursor-pointer text-slate-800 dark:text-slate-300" />
        </button>
        <input
          ref={(el) => (inputRefs.current[0] = el)}
          type="text"
          className="rounded-full outline-none px-4 py-2 w-[100%] placeholder:text-slate-600 dark:placeholder:text-slate-400 text-slate-800 dark:text-slate-300 bg-white dark:bg-black drop-shadow-2xl"
          placeholder="search song"
          onChange={getQuery}
          onKeyDown={handleKeyPress}
          name="searchBox"
        />
      </div>
      <div className="flex gap-4 w-full sm:w-max justify-between sm:justify-normal items-center">
        <Link to={"/user"}>
          <img
            src="https://img.freepik.com/premium-photo/man-wearing-glasses-is-smiling-holding-tablet_905510-2118.jpg?w=740"
            alt="alex"
            className="rounded-full h-[2.50rem] w-[2.50rem] cursor-pointer"
          />
        </Link>
        <div className="flex items-center justify-center gap-4 px-4 py-2 sm:p-2 rounded-full bg-slate-500/10">
          {mode === "dark" ? (
            <Moon
              className="cursor-pointer text-slate-300"
              onClick={changeTheme}
            />
          ) : (
            <Sun
              className="cursor-pointer text-slate-800"
              onClick={changeTheme}
            />
          )}
          <div
            className={`flex sm:hidden cursor-pointer ${
              mode === "dark" ? "text-slate-300" : "text-slate-800"
            }`}
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <X /> : <Menu />}
          </div>
        </div>
      </div>
      <div
        className={`${
          showMenu == true ? "flex" : "hidden"
        }  fixed top-[3.498rem] left-0 right-0 bottom-0 min-h-dvh w-dvw`}
      >
        <div
          className={
            "gap-4 items-start flex flex-col mx-auto mt-8 bg-transparent z-50 sm:hidden"
          }
        >
          <Link
            to={"/"}
            className="flex items-center justify-center gap-4"
            onClick={() => {
              window.location.href = `/`;
              setQ("");
              setShowMenu(false);
            }}
          >
            <Home className="text-slate-800 dark:text-slate-300 cursor-pointer" />
            <p className="text-xl font-semibold font-sans text-slate-800 dark:text-slate-300">
              Home
            </p>
          </Link>
          <div className="flex items-center justify-center gap-4">
            <button onClick={handleLinkClick}>
              <Search className="cursor-pointer text-slate-800 dark:text-slate-300" />
            </button>
            <input
              ref={(el) => (inputRefs.current[1] = el)}
              type="text"
              className="rounded-full outline-none px-4 py-2 w-[100%] placeholder:text-slate-600 dark:placeholder:text-slate-400 text-slate-800 dark:text-slate-300 bg-white dark:bg-black drop-shadow-2xl"
              placeholder="search song"
              onChange={getQueryMob}
              onKeyDown={handleKeyPress}
              name="searchBox"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

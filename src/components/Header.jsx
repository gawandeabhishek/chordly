import { Chrome, Home, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Header = ({ query, setQuery }) => {
  const [mode, setMode] = useState();
  const [showMenu, setShowMenu] = useState(false);
  
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  let location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sunset time for a specific location (e.g., latitude and longitude of San Francisco)
        const response = await axios.get('https://api.sunrise-sunset.org/json?lat=37.7749&lng=-122.4194&formatted=0');
        const sunsetTimeUTC = new Date(response.data.results.sunset);
        const sunsetTimeLocal = new Date(sunsetTimeUTC.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
        const currentTime = new Date();

        // Calculate time difference in milliseconds
        const timeDifference = sunsetTimeLocal - currentTime;

        // If sunset has occurred, switch to dark theme
        if (timeDifference < 0) {
          setMode('dark');
        }
      } catch (error) {
        console.error('Error fetching sunset time:', error);
      }
    };

    // Call fetchData function to fetch sunset time when component mounts
    fetchData();
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

  const getQuery = (e) => {
    setQuery(e.target.value);
  };
  return (
    <div className="sticky left-0 top-0 right-0 flex justify-between items-center px-10 bg-white/50 dark:bg-white/10 backdrop-blur-sm h-14 w-full">
      <div className="sm:flex gap-4 items-center hidden">
        <Link to={"/"}>
          <Home className="text-slate-800 dark:text-slate-300 cursor-pointer" />
        </Link>

        <Link
          to={"/show/song"}
          onClick={() => {
            setQuery(query);
          }}
        >
          <Search className="cursor-pointer text-slate-800 dark:text-slate-300" />
        </Link>
        <input
          type="text"
          className="rounded-full outline-none px-4 py-2 w-[100%] placeholder:text-slate-600 dark:placeholder:text-slate-400 text-slate-800 dark:text-slate-300 bg-white dark:bg-black drop-shadow-2xl"
          placeholder="search song"
          onChange={getQuery}
        />
      </div>
      <div className="flex gap-4 w-full sm:w-max justify-between sm:justify-normal items-center">
        <Link to={"/user"}>
          <img
            src="https://img.freepik.com/premium-photo/man-wearing-glasses-is-smiling-holding-tablet_905510-2118.jpg?w=740"
            alt="alex"
            className="rounded-full h-8 w-8 cursor-pointer"
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
          <Link to={"/"} className="flex items-center justify-center gap-4">
            <Home className="text-slate-800 dark:text-slate-300 cursor-pointer" />
            <p className="text-xl font-semibold font-sans text-slate-800 dark:text-slate-300">
              Home
            </p>
          </Link>
          <div className="flex items-center justify-center gap-4">
            <Link to={`/show/song`} onClick={() => setQuery(query)}>
              <Search className="cursor-pointer text-slate-800 dark:text-slate-300" />
            </Link>
            <input
              type="text"
              className="rounded-full outline-none px-4 py-2 w-[100%] placeholder:text-slate-600 dark:placeholder:text-slate-400 text-slate-800 dark:text-slate-300 bg-white dark:bg-black drop-shadow-2xl"
              placeholder="search song"
              onChange={getQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

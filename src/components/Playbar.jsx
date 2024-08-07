import he from "he";
import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Link } from "react-router-dom";

const Playbar = ({
  audioTrack,
  audioElement,
  dragRef,
  updatePlaybar,
  skipBack,
  togglePlay,
  skipForward,
  setConditions,
  play,
  isLoop,
  forwd,
  song,
  isOnShow,
  isSongExist,
  handleMouseDown,
  handleTouchStart,
<<<<<<< HEAD
<<<<<<< HEAD
  newCurrentTimeRef
=======
  setIsOnShow
>>>>>>> parent of 45a8e6c (Reverting previous commit due to the bug. The issue will be fixed in a later update.)
=======
  setIsOnShow
>>>>>>> parent of 45a8e6c (Reverting previous commit due to the bug. The issue will be fixed in a later update.)
}) => {
  return (
    <>
      {isSongExist ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white/50 dark:bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center gap-2 pb-4">
          <div className="relative w-full flex items-center justify-center gap-2 pt-2 px-6 sm:px-20 cursor-pointer z-50">
            <p className="text-xs font-semibold text-slate-700 dark:text-white">
              {(audioTrack?.progress / 60).toFixed(2) === "NaN"
                ? "0.00"
                : (audioElement?.current?.currentTime / 60).toFixed(2)}
            </p>
            <div
              ref={dragRef}
              onClick={updatePlaybar}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="h-5 group relative w-full flex items-center justify-center"
            >
              <div className="w-full h-1 bg-gray-200 group dark:bg-gray-700 relative rounded-full overflow-hidden group cursor-pointer">
                <div
                  className="w-full h-1 bg-slate-700 dark:bg-white group-hover:bg-slate-400 rounded-full absolute z-10 flex items-center justify-end"
                  style={{ width: `${audioTrack?.progress}%` }}
                >
                  <div className="h-3 w-3 bg-transparent fixed group-hover:bg-slate-700 dark:group-hover:bg-white rounded-full z-20 cursor-pointer -mr-1.5" />
                </div>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-white">
              {(audioTrack?.length / 60).toFixed(2) === "NaN"
                ? "0.00"
                : (audioTrack?.length / 60).toFixed(2)}
            </p>
          </div>
          {isOnShow ? (
            <div className="flex sm:grid grid-cols-3 w-full px-6 sm:px-20 lg:px-32">
              <Link
                className="flex items-center justify-between space-x-0 sm:space-x-2 w-full sm:w-fit col-start-1 justify-self-start"
                onClick={() => setIsOnShow(false)}
                to={`/show/${song?.id}`}
              >
                <img
                  className="h-10 w-10 rounded-md cursor-pointer"
                  src={song?.image[song?.image?.length - 1]?.url}
                ></img>
                <div className="hidden sm:flex flex-col items-start w-fit">
                  <h4 className="font-bold text-xs lg:text-sm text-slate-900 dark:text-slate-50 w-fit mx-2 cursor-pointer">
                    {song ? he.decode(song?.name) : null}
                  </h4>
                  <p className="hidden lg:block text-slate-600 dark:text-slate-400 w-[60%] text-sm mx-2 cursor-pointer truncate">
                    {song?.artists?.primary?.map((singers, idx) => (
                      <span key={idx}>
                        {singers?.name}
                        <span>
                          {idx == song?.artists?.primary?.length - 1
                            ? ""
                            : ", "}
                        </span>
                      </span>
                    ))}
                  </p>
                </div>
              </Link>
              <div className="col-start-2 justify-self-center flex items-center justify-normal gap-2">
                <div
                  className="bg-slate-500/10 p-2 rounded-full text-slate-800 dark:text-slate-200 cursor-pointer"
                  onClick={skipBack}
                >
                  <SkipBack />
                </div>
                <div
                  onClick={togglePlay}
                  className="bg-slate-500/10 p-2 rounded-full text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {play ? (
                    <Pause className="text-cyan-700 dark:text-cyan-500" />
                  ) : (
                    <Play />
                  )}
                </div>
                <div
                  className="bg-slate-500/10 p-2 rounded-full text-slate-800 dark:text-slate-200 cursor-pointer"
                  onClick={skipForward}
                >
                  <SkipForward />
                </div>
                <div
                  className="bg-slate-500/10 p-2 rounded-full cursor-pointer"
                  onClick={setConditions}
                >
                  {isLoop ? (
                    <Repeat1 className="text-cyan-700 dark:text-cyan-500" />
                  ) : forwd ? (
                    <Shuffle className="text-slate-800 dark:text-slate-200" />
                  ) : (
                    <Repeat className="text-teal-700 dark:text-teal-500" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <div
                className="bg-slate-500/10 p-2 rounded-full text-slate-800 dark:text-slate-200 cursor-pointer"
                onClick={skipBack}
              >
                <SkipBack />
              </div>
              <div
                onClick={togglePlay}
                className="bg-slate-500/10 p-2 rounded-full text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                {play ? (
                  <Pause className="text-cyan-700 dark:text-cyan-500" />
                ) : (
                  <Play />
                )}
              </div>
              <div
                className="bg-slate-500/10 p-2 rounded-full text-slate-800 dark:text-slate-200 cursor-pointer"
                onClick={skipForward}
              >
                <SkipForward />
              </div>
              <div
                className="bg-slate-500/10 p-2 rounded-full cursor-pointer"
                onClick={setConditions}
              >
                {isLoop ? (
                  <Repeat1 className="text-cyan-700 dark:text-cyan-500" />
                ) : forwd ? (
                  <Shuffle className="text-slate-800 dark:text-slate-200" />
                ) : (
                  <Repeat className="text-teal-700 dark:text-teal-500" />
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Playbar;

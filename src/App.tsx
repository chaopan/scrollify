import React, { useEffect } from "react";
import { SongCardContainer } from "./components/SongCardContainer";
import { refreshTokenOnLoad } from "./utils/SpotifyAuth";

const App: React.FC = () => {
  useEffect(() => {
    refreshTokenOnLoad();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-primary h-40 w-full"></div>
      <div className="mx-auto flex flex-col items-center">
        <SongCardContainer />
      </div>
    </div>
  );
};

export default App;

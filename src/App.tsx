import React, { useEffect } from "react";
import { SongCardContainer } from "./components/SongCardContainer";
import { refreshTokenOnLoad } from "./utils/SpotifyAuth";
import { Header } from "src/components/Header";

const App: React.FC = () => {
  useEffect(() => {
    refreshTokenOnLoad();
  }, []);

  return (
    <div className="from-song-primary to-song-secondary h-lvh bg-gradient-to-b transition-colors duration-500 ease-in-out">
      <Header />
      <div className="mx-auto flex flex-col items-center">
        <SongCardContainer />
      </div>
    </div>
  );
};

export default App;

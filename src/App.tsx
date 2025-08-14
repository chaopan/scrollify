import React, { useState, useEffect } from "react";
import { getTopItems } from "./utils/spotify/getTopItems";
import { getSuggestions } from "./utils/queryAi";
import { SongCardContainer } from "./components/SongCardContainer";
import { refreshTokenOnLoad } from "./utils/SpotifyAuth";
import { searchTrack } from "./utils/spotify/searchTrack";
import { exampleTrack } from "./utils/spotify/exampleTrack";

type SpotifyResults = {
  items: SpotifyTrack[];
};

type SpotifyTrack = {
  name: string;
  artists: {
    name: string;
  }[];
};

type track = {
  name: string;
  artist: string;
};

const normalizeTrack = (spotifyTrack: SpotifyTrack): track => {
  return { name: spotifyTrack.name, artist: spotifyTrack.artists[0].name };
};

const App: React.FC = () => {
  const [topTracks, setTopTracks] = useState<Array<track>>([]);
  const [suggestedTracks, setSuggestedTracks] = useState<Array<track>>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    refreshTokenOnLoad();
  }, []);

  const handleStart = async () => {
    try {
      const spotifyResults: SpotifyResults = await getTopItems("tracks");
      console.log("topTracks", spotifyResults.items);
      const normalizedTracks = spotifyResults.items.map((spotifyTrack) => {
        return normalizeTrack(spotifyTrack);
      });
      setTopTracks(normalizedTracks);
      //try gemini
      const aiResultTracks = await getSuggestions(normalizedTracks);
      console.log("suggestedTracks", aiResultTracks);
      setSuggestedTracks(aiResultTracks);
      //now search for tracks on spotify to get their track IDs
      const searchResult = await searchTrack(
        aiResultTracks[0].name,
        aiResultTracks[0].artist,
      );
      // setSuggestedSpotifyTracks([searchResult]);
      console.log("first track:", searchResult);
      setCurrentTrack(searchResult);
    } catch (e) {
      console.error("ERROR:", e);
    }
  };

  const handleNextTrack = async () => {
    //iterate to the next track in the list
    const nextAiTrack = suggestedTracks[trackIndex + 1];

    const searchResult = await searchTrack(
      nextAiTrack.name,
      nextAiTrack.artist,
    );
    console.log("next track", searchResult);
    setTrackIndex(trackIndex + 1);
    setCurrentTrack(searchResult);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {!currentTrack && (
          <div className="text-center">
            <h1 className="mb-8 text-6xl font-bold text-gray-900">
              Welcome to <span className="text-indigo-600">Scrollify</span>
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600">
              An AI app to help you find new music! <br />
              Or just play the music you already like.
            </p>
            <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-xl">
              <button
                onClick={handleStart}
                className="transform rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:scale-105 hover:bg-indigo-700"
              >
                Lets go!
              </button>
              <button
                onClick={() => {
                  setCurrentTrack(exampleTrack);
                }}
              >
                test
              </button>
            </div>
          </div>
        )}
        <div>
          {currentTrack && (
            <SongCardContainer
              track={currentTrack}
              onNextTrack={handleNextTrack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

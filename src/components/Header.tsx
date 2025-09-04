import { useEffect, useState } from "react";
import { setupSpotifyRequest, getUserInfo } from "src/utils/SpotifyAuth";

export const Header = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [didFetch, setDidFetch] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsSignIn, setNeedsSignIn] = useState(false);

  useEffect(() => {
    console.log("setting access token", localStorage.getItem("access_token"));
    const localAccessToken = localStorage.getItem("access_token");
    setAccessToken(localAccessToken);

    if (!localAccessToken) {
      setNeedsSignIn(true);
    }
  }, []);

  useEffect(() => {
    if (accessToken && !didFetch) {
      console.log("fetching user info");
      getUserInfo()
        .then((user) => {
          setUserInfo(user);
          setDidFetch(true);
          setNeedsSignIn(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user info:", error);
          setNeedsSignIn(true);
        });
    } // retry after 1s failed
    else if (!accessToken && !didFetch) {
      setTimeout(() => {
        getUserInfo()
          .then((user) => {
            setUserInfo(user);
            setDidFetch(true);
            setNeedsSignIn(false);
          })
          .catch((error) => {
            console.error("Failed to fetch user info:", error);
            setNeedsSignIn(true);
          });
      }, 500);
    }
  }, [accessToken, didFetch]);

  const handleSignIn = () => {
    setupSpotifyRequest();
  };

  return (
    <div className="flex h-40 w-full flex-row-reverse items-center bg-transparent shadow-md">
      {userInfo ? (
        <img
          src={userInfo?.images[1].url}
          alt="User profile"
          className="h-30 w-30 mr-10 rounded-full object-cover"
        />
      ) : (
        <div className="h-30 w-30 mr-10 rounded-full bg-gray-500 object-cover" />
      )}

      {needsSignIn && (
        <button
          onClick={handleSignIn}
          className="bg-song-secondary hover:bg-song-secondary/30 mr-10 cursor-pointer rounded-lg px-8 py-4 font-semibold text-white"
        >
          Sign into Spotify
        </button>
      )}
    </div>
  );
};

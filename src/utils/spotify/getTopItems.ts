import { setupSpotifyRequest } from "../SpotifyAuth";

export const getTopItems = async (type = "tracks") => {
  //check auth;
  setupSpotifyRequest();

  const accessToken = localStorage.getItem("access_token");

  const response = await fetch(`https://api.spotify.com/v1/me/top/${type}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

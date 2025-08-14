import { setupSpotifyRequest } from "../SpotifyAuth";

export const searchTrack = async (title: string, artist: string) => {
  setupSpotifyRequest();

  const token = localStorage.getItem("access_token");
  const searchParams = new URLSearchParams({
    q: `track:${title} artist:${artist}`,
    type: "track",
    limit: "1",
  });

  const response = await fetch(
    `https://api.spotify.com/v1/search?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    },
  );

  if (response.ok) {
    const responseJson = await response.json();
    const firstResult = responseJson.tracks.items[0];
    console.log("search result", title, responseJson);
    return firstResult;
  }
};

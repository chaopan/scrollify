import { setupSpotifyRequest } from "../SpotifyAuth";

export const playTrack = async (trackId: string, deviceId: string) => {
  setupSpotifyRequest();
  const token = localStorage.getItem("access_token");
  const deviceParam = new URLSearchParams({
    device_id: deviceId,
  });
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/play?${deviceParam.toString()}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        uris: [`spotify:track:${trackId}`],
      }),
    },
  );

  if (response.json) {
    const responseJson = await response.json();
    console.log("playing track response", responseJson);
    return false;
  }

  return true;
};

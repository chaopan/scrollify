export const transferPlayback = async (deviceId: string) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_ids: [deviceId],
      play: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Failed to transfer playback", error);
    return false;
  }

  return true;
};

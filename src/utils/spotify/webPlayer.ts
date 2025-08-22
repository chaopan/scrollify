import { transferPlayback } from "./transferPlayback";

let player;

export const setupWebPlayer = (
  onPlayerReady: (player: any, deviceId: string) => void,
  initialVolume: number = 0.5,
) => {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const spotifyPlayer = new window.Spotify.Player({
      name: "Scrollify Web Player",
      enableMediaSession: true,
      getOAuthToken: (cb: (token: string | null) => void) => {
        const token = localStorage.getItem("access_token");
        cb(token);
      },
      volume: initialVolume,
    });
    // add ready listener
    spotifyPlayer.addListener("ready", ({ device_id }) => {
      console.log("Spotify Webplayer SDK ready with device_id", device_id);
      onPlayerReady(spotifyPlayer, device_id);
    });
    // add init error listener
    spotifyPlayer.on(
      "initialization_error",
      ({ message }: { message: string }) => {
        console.error("Spotify Webplayer SDK failed to initialize:", message);
      },
    );
    // add device not ready listener
    spotifyPlayer.addListener("not_ready", ({ device_id }) => {
      console.log("Spotify Webplayer SDK not ready with device_id", device_id);
    });

    //finally connect the spotify player:

    spotifyPlayer.connect().then((success: any) => {
      console.log("spotifyPlayer connected success?", success);
    });

    player = spotifyPlayer;
  };

  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js";
  script.async = true;

  document.body.appendChild(script);
};

const redirect_url = `${window.location.protocol}//${window.location.host}`;

const scope =
  "user-read-private user-read-email user-top-read app-remote-control streaming user-modify-playback-state";
const SPOTIFY_CLIENT_ID = "af292767e80a40f8b1eba20ecb9151eb";

function generateCodeVerifier(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export const handlePostLogin = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    await requestAccessToken(code);
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    window.history.replaceState({}, document.title, url.pathname + url.search);
  }
};

const requestAccessToken = async (code: string) => {
  const codeVerifier = localStorage.getItem("code_verifier");

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirect_url,
      code_verifier: codeVerifier,
    } as Record<string, string>),
  };

  const body = await fetch(url, payload);
  const response = await body.json();

  localStorage.setItem("access_token", response.access_token);
  localStorage.setItem("refresh_token", response.refresh_token);
  localStorage.setItem("access_token_start_time", Date.now().toString());
  return response;
};

const refreshAccessToken = async () => {
  // refresh token that has been previously stored
  const refreshToken = localStorage.getItem("refresh_token");
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID,
    } as Record<string, string>),
  };
  const body = await fetch(url, payload);
  const response = await body.json();

  response.access_token &&
    localStorage.setItem("access_token", response.access_token);
  response.refresh_token &&
    localStorage.setItem("refresh_token", response.refresh_token);
  localStorage.setItem("access_token_start_time", Date.now().toString());
  return response;
};

const tokenIsExpired = () => {
  const startTimeStr = localStorage.getItem("access_token_start_time");
  if (startTimeStr) {
    const startTime = Number(startTimeStr); // parse to number
    const now = Date.now();
    const minutesPassed = (now - startTime) / (1000 * 60); // ms -> minutes

    if (minutesPassed <= 60) {
      console.log("Token is not expired");
      return false;
    }
  }
  return true;
};

export const setupSpotifyRequest = async () => {
  // case 1: no access token, no code verifier. Redirect to login
  if (
    !localStorage.getItem("access_token") ||
    localStorage.getItem("access_token") === "undefined"
  ) {
    redirectToAuthCodeFlow();
  }
  //case 2: access token timed out. Request new token with refresh_token
  if (tokenIsExpired() && localStorage.getItem("refresh_token")) {
    const refreshPayload = await refreshAccessToken();
  }
  //case 3: token is valid... How do we check if a token is valid?
  return true;
};

export const refreshTokenOnLoad = async () => {
  if (tokenIsExpired() && localStorage.getItem("refresh_token")) {
    const refreshPayload = await refreshAccessToken();
  }

  return true;
};

export const redirectToAuthCodeFlow = async () => {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem("code_verifier", verifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope,
    code_challenge_method: "S256",
    code_challenge: challenge,
    redirect_uri: redirect_url,
  });

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const getUserInfo = async () => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  const userInfo = await response.json();
  return userInfo;
};

// onload - check if we've come from spotify login
handlePostLogin();

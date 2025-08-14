import fetch from "node-fetch";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
const CHAR_LIMIT = 60;

type Track = {
  name: string;
  artist: string;
};

const createPrompt = (tracks: Track[]) => {
  let trackString = "";
  tracks.forEach((track) => {
    trackString = `${trackString}, ${track.name} - ${track.artist}`;
  });
  return `Give a list of 10 song recommendations for someone who likes these songs(name - artist):\n ${trackString}`;
};

type Validator = {
  invalid: boolean;
  error?: string;
  status?: number;
};

const isBodyInvalid = (body): Validator => {
  for (let i = 0; i < body.length; i++) {
    const track = body[i];
    if (!track || typeof track !== "object") {
      return {
        invalid: true,
        error: `Track at index ${i} must be an object`,
        status: 400,
      };
    }

    if (!track.name || typeof track.name !== "string") {
      return {
        invalid: true,
        error: `Track at index ${i} must have a 'name' string property`,
        status: 400,
      };
    }

    if (!track.artist || typeof track.artist !== "string") {
      return {
        invalid: true,
        error: `Track at index ${i} must have an 'artist' string property`,
        status: 400,
      };
    }
  }
  return {
    invalid: false,
  };
};

const truncateLength = (str) => {
  return str.length > CHAR_LIMIT ? str.slice(0, CHAR_LIMIT) : str;
};

const truncateTracks = (tracks: Track[]) => {
  return tracks.map((track) => ({
    name: truncateLength(track.name),
    artist: truncateLength(track.artist),
  }));
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!req.body || !Array.isArray(req.body)) {
    return res.status(400).json({
      error: "Request body must be an array of tracks",
    });
  }

  const validationResult = isBodyInvalid(req.body);
  if (validationResult.invalid) {
    return res.status(validationResult.status).json({
      error: validationResult.error,
    });
  }

  const formattedTracks = truncateTracks(req.body);
  const prompt = createPrompt(formattedTracks);

  const geminiPayload = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            artist: { type: "STRING" },
          },
          propertyOrdering: ["name", "artist"],
        },
      },
    },
  };

  try {
    const response = await fetch(`${GEMINI_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": `${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify(geminiPayload),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

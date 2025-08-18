const isDev =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const GEMINI_URL = "/api/gemini";
const LOCAL_URL = "http://localhost:3000/api/gemini";

import { Track } from "src/types";
import { exampleSuggestions } from "./spotify/exampleTrack";

type track = { name: string; artist: string };

type geminiAnswer = {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
};

export const askGemini = async (tracks: track[]): Promise<geminiAnswer> => {
  const uri = isDev ? LOCAL_URL : GEMINI_URL;
  const response = await fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tracks),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const getSuggestions = async (tracks: track[]): Promise<Track[]> => {
  /** THIS IS FOR TESTING: */
  // return exampleSuggestions;

  const answer = await askGemini(tracks); //exampleResponse;
  console.log("gemini response data", answer);
  const songData = JSON.parse(answer.candidates[0].content.parts[0].text);
  console.log("songData", songData);
  return songData;
};

// const exampleResponse = {
//   candidates: [
//     {
//       content: {
//         parts: [
//           {
//             text: '[\n  {\n    "name": "Good Ones",\n    "artist": "Charli XCX"\n  },\n  {\n    "name": "Cut To The Feeling",\n    "artist": "Carly Rae Jepsen"\n  },\n  {\n    "name": "Ribs",\n    "artist": "Lorde"\n  },\n  {\n    "name": "Sofia",\n    "artist": "Clairo"\n  },\n  {\n    "name": "So Hot You\'re Hurting My Feelings",\n    "artist": "Caroline Polachek"\n  },\n  {\n    "name": "Silk Chiffon",\n    "artist": "MUNA"\n  },\n  {\n    "name": "Are You Bored Yet?",\n    "artist": "Wallows"\n  },\n  {\n    "name": "Venice Bitch",\n    "artist": "Lana Del Rey"\n  },\n  {\n    "name": "About You",\n    "artist": "The 1975"\n  },\n  {\n    "name": "Alaska",\n    "artist": "Maggie Rogers"\n  }\n]',
//           },
//         ],
//         role: "model",
//       },
//       finishReason: "STOP",
//       index: 0,
//     },
//   ],
//   usageMetadata: {
//     promptTokenCount: 179,
//     candidatesTokenCount: 270,
//     totalTokenCount: 2946,
//     promptTokensDetails: [
//       {
//         modality: "TEXT",
//         tokenCount: 179,
//       },
//     ],
//     thoughtsTokenCount: 2497,
//   },
//   modelVersion: "gemini-2.5-flash",
//   responseId: "8sybaKOpHZCI6dkPm_HHyQo",
// };

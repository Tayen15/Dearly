"use server";

import yts from "yt-search";

export type YoutubeSearchResult = {
  id: string;
  title: string;
  thumbnail: string;
  author: string;
  duration: string;
};

export async function searchYoutubeSong(query: string): Promise<YoutubeSearchResult[]> {
  try {
    if (!query || query.trim() === "") {
      return [];
    }

    // Use yt-search to find videos
    // We only take the top 5 results to keep it fast
    const r = await yts(query);
    const videos = r.videos.slice(0, 5);

    return videos.map((v) => ({
      id: v.videoId,
      title: v.title,
      thumbnail: v.thumbnail || "",
      author: v.author.name,
      duration: v.timestamp,
    }));
  } catch (error) {
    console.error("Error searching YouTube:", error);
    return [];
  }
}

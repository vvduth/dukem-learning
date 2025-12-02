import { raw } from "express";
import { ObjectId } from "mongoose";

/** 
* split text into chunks for better AI processing
* @param {string} text - full text to be chunked
* @param {number} chunkSize - size of each chunk in words
* @param {number} overlap - number of overlapping words between chunks
* @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>} array of text chunks 

*/
export const chunkText = (
  text: string,
  chunkSize: number = 500,
  overlap: number = 50
) => {
  if (!text || text.trim() === "") return [];

  // clean text while preserving paragraph structure
  const cleanedText = text
    .replace(/\r\n/g, "\n") // normalize new lines
    .replace(/\s+/g, " ") // collapse multiple spaces
    .replace(/ \n /g, "\n") // clean spaces around new lines
    .replace(/\n+/g, "\n") // collapse multiple new lines
    .trim();

  const paragraphs = cleanedText.split(/\n+/).filter((p) => p.trim() !== "");

  const chunks: Array<{
    content: string;
    chunkIndex: number;
    pageNumber: number;
  }> = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    // if single paragraph exceeds chunk size, split it by words
    if (paragraphWordCount > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join("\n\n"),
          chunkIndex: chunkIndex++,
          pageNumber: 0, // pageNumber handling can be added if needed
        });
        currentChunk = [];
        currentWordCount = 0;
      }

      // split large paragraph into smaller chunks word-based
      for (let i = 0; i < paragraphWordCount; i += chunkSize - overlap) {
        const chunkWords = paragraphWords.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(" "),
          chunkIndex: chunkIndex++,
          pageNumber: 0, // pageNumber handling can be added if needed
        });

        if (i + chunkSize >= paragraphWordCount) break;
      }
      continue;
    }

    // if adding paragraph exceeds chunk size, save current chunk
    if (
      currentWordCount + paragraphWordCount > chunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push({
        content: currentChunk.join("\n\n"),
        chunkIndex: chunkIndex++,
        pageNumber: 0, // pageNumber handling can be added if needed
      });

      // create overlap from previous chunk
      const prevChunkText = currentChunk.join(" ");
      const prevChunkWords = prevChunkText.trim().split(/\s+/);
      const overlapText = prevChunkWords
        .slice(-Math.min(overlap, prevChunkWords.length))
        .join(" ");

      currentChunk = [overlapText, paragraph.trim()];
      currentWordCount = overlap + paragraphWordCount;
    } else {
      // add paragraph to current chunk
      currentChunk.push(paragraph.trim());
      currentWordCount += paragraphWordCount;
    }

    
  }
  // add the last chunk
    if (currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.join("\n\n"),
        chunkIndex: chunkIndex++,
        pageNumber: 0, // pageNumber handling can be added if needed
      });
    }

    // fallback: if no chunks created, split by words
    if (chunks.length === 0 && cleanedText.length > 0) {
      const allWords = cleanedText.split(/\s+/);
      for (let i = 0; i < allWords.length; i += chunkSize - overlap) {
        const chunkWords = allWords.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(" "),
          chunkIndex: chunkIndex++,
          pageNumber: 0, // pageNumber handling can be added if needed
        });
        if (i + chunkSize >= allWords.length) break;
      }
    }
  return chunks;
};

/**
 * find relevant chunks based on keyword matching
 * @param {Array<Object>} chunks - array of text chunks
 * @param {string} query - search query
 * @param {number} maxChunks - maximum of chunks to return
 * @returns {Array<Object>} array of relevant text chunks
 */
export const findRelevantChunks = (
  chunks: Array<{
    content: string;
    chunkIndex: number;
    pageNumber: number;
    _id: string;
  }>,
  query: string,
  maxChunks: number = 3
) => {
  if (!chunks || chunks.length === 0 || !query || query.trim() === "") {
    return [];
  }

  const stopWords = new Set([
    "the",
    "is",
    "at",
    "which",
    "on",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "with",
    "to",
    "of",
    "as",
    "by",
    "this",
    "that",
    "these",
    "those",
    "for",
    "it",
    "its",
  ]);

  // extrad and clean query words
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (queryWords.length === 0) {
    // return clean chunks objs with mongoose metatdaa
    return chunks.slice(0, maxChunks).map((chunk) => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
    }));
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const contentWords = content.split(/\s+/).length;
    let score = 0;

    // score each query word
    for (const qWord of queryWords) {
      // extact word match (higher score)
      const exactMatches = (
        content.match(new RegExp(`\\b${qWord}\\b`, "g")) || []
      ).length;
      score += exactMatches * 3;

      // partial word match (lower score)
      const partialMatches = (content.match(new RegExp(qWord, "g")) || [])
        .length;
      score += Math.max(0, partialMatches - exactMatches) * 1.5;
    }
    // bonus: multiple query word found
    const uniqueWordsFound = queryWords.filter((word) =>
      content.includes(word)
    ).length;
    if (uniqueWordsFound > 1) {
      score += uniqueWordsFound * 2;
    }

    // normalize by content length
    const normalizeScore = score / Math.sqrt(contentWords);

    // small bonus for earlier chunks
    const positionBonus = 1 - index / chunks.length + 0.1;

    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
      score: normalizeScore * positionBonus,
      rawScore: score,
      matchedWords: uniqueWordsFound,
    };
  });

  return scoredChunks
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (b.matchedWords !== a.matchedWords) {
        return b.matchedWords - a.matchedWords;
      }
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};

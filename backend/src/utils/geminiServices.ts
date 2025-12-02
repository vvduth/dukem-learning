import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { DifficultyLevel } from "../types/index.js";

dotenv.config();
const googleApiKey = process.env.GOOGLE_API_KEY || "";

const ai = new GoogleGenAI({
  apiKey: googleApiKey,
});

if (!googleApiKey) {
  console.warn(
    "Warning: GOOGLE_API_KEY is not set. AI services will not work."
  );
  process.exit(1);
}

/**
 * generate flashcards from text using Google GenAI
 * @param {string} text  - Document content
 * @param {number} count - number of flashcards to generate
 * @returns {Promise <Array<{question: string, answer: string, difficulty: string}>>} array of flashcards
 */

export const generateFlashcards = async (
  text: string,
  count: number = 10
): Promise<
  Array<{
    question: string;
    answer: string;
    difficulty: DifficultyLevel
  }>
> => {
  const prompt = `Generate exactly ${count} flashcards from the following text.
    Format each flashcard as:
    Q: [Clear, specific, and concise question]
    A: [Accurate and concise answer]
    D: [easy, medium, hard]

    Separate each flashcard with "---"
    Text:
    ${text.substring(0, 15000)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    const generatedText = response.text;

    if (!generatedText) {
      throw new Error("No text generated from AI model");
    }

    // parse the response
    const flashCard = [];
    const cards = generatedText.split("---").filter((c) => c.trim());

    for (const card of cards) {
      const lines = card.trim().split("\n");
      let question = "";
      let answer = "";
      let difficulty = "medium" as "easy" | "medium" | "hard";

      for (const line of lines) {
        if (line.startsWith("Q:")) {
          question = line.substring(2).trim();
        } else if (line.startsWith("A:")) {
          answer = line.substring(2).trim();
        } else if (line.startsWith("D:")) {
          const diff = line.substring(2).trim().toLowerCase() as "easy" | "medium" | "hard";
          if (["easy", "medium", "hard"].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && answer) {
        flashCard.push({
          question: question,
          answer: answer,
          difficulty: difficulty,
        });
      }
    }
    return flashCard.slice(0, count);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards");
  }
};

/**
 * Generate quiz questions from text using Google GenAI
 * @param {string} text  - Document content
 * @param {number} numQuestions - number of quiz questions to generate
 * @returns {Promise <Array<{question: string, options: string[], correctAnswer: string, explanation: string, difficulty: string}>>} array of quiz questions
 */

export const generateQuizQuestions = async (
  text: string,
  numQuestions: number = 5
): Promise<
  Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: DifficultyLevel;
  }>
> => {
  const prompt = `Generate exactly ${numQuestions} multiple-choice 
quiz questions from the following text.
    Format each question as:
    Q: [Clear, specific question]
    O1: [Option 1]
    O2: [Option 2]
    O3: [Option 3]
    O4: [Option 4]
    C: [Correct option - exactly as one of the options written above]
    E: [Brief explanation of the correct answer]
    D: [Difficulty: easy, medium, hard]

    Separate each question with "---"

    Text:
    ${text.substring(0, 15000)}`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    const generatedText = response.text;

    if (!generatedText) {
      throw new Error("No text generated from AI model");
    }

    const questions = [];
    const questionBlocks = generatedText.split("---").filter((q) => q.trim());

    for (const block of questionBlocks) {
      const lines = block.trim().split("\n");
      let question = "";
      const options = [];
      let correctAnswer = "";
      let explanation = "";
      let difficulty: DifficultyLevel = "medium";
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("Q:")) {
          question = trimmed.substring(2).trim();
        } else if (trimmed.match(/^O\d:/)) {
          options.push(trimmed.substring(3).trim());
        } else if (trimmed.startsWith("C:")) {
          correctAnswer = trimmed.substring(2).trim();
        } else if (trimmed.startsWith("E:")) {
          explanation = trimmed.substring(2).trim();
        } else if (trimmed.startsWith("D:")) {
          const diff = trimmed.substring(2).trim().toLowerCase() as DifficultyLevel;
          if (["easy", "medium", "hard"].includes(diff)) {
            difficulty = diff;
          }
        }
      }
      if (question && options.length === 4 && correctAnswer) {
        questions.push({
          question,
          options,
          correctAnswer,
          explanation,
          difficulty,
        });
      }
    }
    return questions.slice(0, numQuestions);
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions");
  }
};

/**
 * Generate document summary using Google GenAI
 * @param {string} text - Document content
 * @returns {Promise<string>} summary text
 */
export const generateSummary = async (text: string): Promise<string> => {
    const prompt = `Summarize the following text in a concise manner,
    highlighting the key points, main ideas, and important details.

    Keep the summary clear and easy to understand and structured.

    Text:
    ${text.substring(0, 15000)}`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        const generatedText = response.text;
        if (!generatedText) {
            throw new Error("No text generated from AI model");
        }
        return generatedText;
    } catch (error) {
        console.error("Error generating summary:", error);
        throw new Error("Failed to generate summary");
    }
}

/**
 * chat with document content using Google GenAI
 * @param {string} question - user question
 * @param {Array<Object>} chunks - relevant document text chunks
 * @returns {Promise<string>} AI generated answer
 */

export const chatWithConText = async (
  question: string,
  chunks: Array<{content: string, chunkIndex: number, pageNumber: number}>
): Promise<string> => {
  const chunkTexts = chunks.map((c, i) =>`Chunk ${i + 1}\n${c.content}`)
  .join("\n\n");
  const prompt = `Using the following context from a document,
  analyze the context and answer the user's question accurately.
  if the answer is not found in the context, say no.
  Context:
    ${chunkTexts}
  Question: ${question}
  Answer:`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    const generatedText = response.text;
    if (!generatedText) {
      throw new Error("No text generated from AI model");
    }
    return generatedText;
  } catch (error) {
    console.error("Error generating answer:", error);
    throw new Error("Failed to generate answer");
  }
}

/**
 * Explain a specific concept using Google GenAI
 * @param {string} concept - concept to explain
 * @param {string} context - relevant document context
 * @returns {Promise<string>} explanation text
 */
export const explainConcept = async (
  concept: string,
  context: string
) : Promise<string> => {
  const prompt = `Explain the  concept of ${concept} in detail using the provided following context.
  Provide a clear, educational explanation suitable for someone learning about the topic.
  If the concept is not covered in the context, indicate that clearly.
  Include examples where appropriate.

  Context: ${context.substring(0, 15000)}
  Explanation:`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    const generatedText = response.text;
    if (!generatedText) {
      throw new Error("No text generated from AI model");
    }
    return generatedText;
  } catch (error) {
    console.error("Error generating explanation:", error);
    throw new Error("Failed to generate explanation");
  }
}
import fs from "fs/promises";
import {PDFParse, TextResult} from "pdf-parse";


/**
 * extract text from pdf file
 * @param filePath path to pdf file
 * @returns {Promise<text:string, numPages:number>} extracted text and number of pages
 */


type MyTextResult = TextResult & { info: any; numPages: number };

export  const  extractFromPDF = async (filePath: string): 
Promise<{ text: string; numPages: number, info: any }> => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        // pdf-parse expect unit8array, not a buffer
        const parser = new PDFParse(new Uint8Array(dataBuffer));
        const data = await parser.getText() as MyTextResult;

        return {text: data.text, numPages: data.total,
            info: data.info 
        };
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF");
    }
}


export const extractFromMarkdown = async (filePath: string): 
Promise<{ text: string; numPages: number, info: any }> => {
    try {
        const dataBuffer = await fs.readFile(filePath, "utf-8");
        // for markdown, we can treat the whole file as text
        return {text: dataBuffer, numPages: 1,
            info: { title: "Markdown Document" }
        };
    }
    catch (error) {
        console.error("Error extracting text from Markdown:", error);
        throw new Error("Failed to extract text from Markdown");
    }
}
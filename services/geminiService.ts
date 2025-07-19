
import { GoogleGenAI, Type } from "@google/genai";
import type { SynthesisInput, SynthesisResult, Product } from '../types';

if (!process.env.API_KEY) {
  alert("API_KEY is not configured. Please set the API_KEY environment variable.");
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const synthesisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief, one-sentence summary of the overall transformation.",
    },
    pathway: {
      type: Type.ARRAY,
      description: "The sequence of reaction steps.",
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.INTEGER, description: "The step number in the sequence (e.g., 1, 2, 3)." },
          reaction: { type: Type.STRING, description: "A concise description of the chemical reaction/transformation occurring in this step. (e.g., 'Friedel-Crafts Acylation')." },
          reagentsAndConditions: { type: Type.STRING, description: "The necessary reagents, catalysts, and conditions (e.g., temperature, solvent) for this step. (e.g., 'CH3COCl, AlCl3, heat')." },
          intermediateProducts: {
            type: Type.ARRAY,
            description: "A list of the main organic products formed. Usually one, but can be multiple for mixtures (e.g., o/p isomers).",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "The chemical name of the product." },
                SMILES: { type: Type.STRING, description: "The SMILES string for the product (e.g., 'Cc1ccccc1')." },
                SVG: {
                  type: Type.STRING,
                  description: "A compact, single-line SVG string of the product's 2D chemical structure, drawn as a condensed formula with explicit bonds. The SVG MUST be scalable and follow these strict rules: 1. It MUST have a `viewBox` attribute that frames the drawing with at least 15 units of padding on all sides to prevent clipping. 2. Do NOT include `width` or `height` attributes. 3. Use a transparent background, with black strokes and text. 4. Bonds must be clean, straight lines connecting the correct atoms (e.g., pointing to the 'C' in a 'CH' group). 5. Use a generic sans-serif font for text elements (e.g., CH3, OH, Cl). 6. Do NOT include XML declarations or comments."
                }
              },
              required: ["name", "SMILES", "SVG"]
            }
          }
        },
        required: ["step", "reaction", "reagentsAndConditions", "intermediateProducts"]
      }
    }
  },
  required: ["summary", "pathway"]
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    startCompound: { type: Type.STRING, description: "The name or chemical formula of the starting compound." },
    targetCompound: { type: Type.STRING, description: "The name or chemical formula of the target compound to be synthesized." },
    reagents: { type: Type.STRING, description: "A comma-separated list of the provided reagents or conditions, if any." }
  },
  required: ["startCompound", "targetCompound"],
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type
    },
  };
};

/**
 * Extracts and parses a JSON object from a string, cleaning it of markdown formatting.
 * @param text The raw text response from the model.
 * @returns The parsed JSON object.
 */
const extractAndParseJson = <T>(text: string): T => {
    let cleanText = text.trim();
    
    // Regex to find JSON within markdown-style code blocks
    const jsonMatch = cleanText.match(/```(json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[2]) {
        cleanText = jsonMatch[2];
    }

    try {
        return JSON.parse(cleanText) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", cleanText);
        throw new Error("The AI returned a malformed or incomplete JSON response.");
    }
};

export const analyzeChemistryImage = async (file: File, language: 'en' | 'si'): Promise<SynthesisInput> => {
    const imagePart = await fileToGenerativePart(file);
    const prompt = `You are an expert at analyzing images of chemistry exam papers from Sri Lanka, which can be in either English or Sinhala. In the provided image, locate the organic synthesis problem. Extract the following information: 
1. The starting organic material (e.g., C6H5CO2CH3). 
2. The final target compound to be synthesized (e.g., C6H5C(CH2C6H5)=CHC6H5). 
3. The list of allowed reagents (e.g., PCl3, Mg/dry ether, H+/H2O, LiAlH4, conc. H2SO4). 

Focus ONLY on the synthesis question, ignoring other parts. The names/formulas should be in standard chemical notation, regardless of the question's language.

If no reagents are listed, return an empty string for the 'reagents' field. If you cannot identify the starting or target compound, you MUST return a value of null for that specific field.

Your response MUST be only the raw JSON object that conforms to the provided schema, without any markdown formatting, comments, or extra text.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [ { text: prompt }, imagePart ] },
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const parsedResult = extractAndParseJson<SynthesisInput>(response.text);

        if (!parsedResult.startCompound || !parsedResult.targetCompound) {
            throw new Error("AI failed to extract required compounds from the image.");
        }
        
        if (parsedResult.reagents === undefined) {
          parsedResult.reagents = "";
        }

        return parsedResult;

    } catch (error) {
        console.error("Gemini Image Analysis API call failed:", error);
        if (error instanceof Error && error.message.includes("JSON")) {
            throw error;
        }
        throw new Error("Failed to analyze image. The AI model could not extract the synthesis problem or returned an invalid response.");
    }
};

export const generateSynthesisPath = async (inputs: SynthesisInput, language: 'en' | 'si'): Promise<SynthesisResult> => {
  const { startCompound, targetCompound, reagents } = inputs;

  const reagentClause = reagents 
    ? `The synthesis must ONLY use reagents from the following list: ${reagents}.` 
    : 'You can use any standard A/L level reagents.';

  const languageInstruction = language === 'si' 
    ? "You must provide the entire response (the summary and all text fields in the pathway) in Sinhala language, using appropriate Sinhala chemical terminology. Chemical formulas must remain in standard notation."
    : "You must provide the entire response in English.";

  const prompt = `
    As an expert chemistry tutor for the Sri Lankan A/L syllabus, devise a plausible, step-by-step synthetic pathway to convert ${startCompound} into ${targetCompound}.
    ${reagentClause}
    For each step, provide the details in the 'intermediateProducts' array. If a step produces a mixture of major products (like ortho/para isomers), list all of them in the array.
    For each product, provide:
    1.  Its chemical name.
    2.  Its SMILES string.
    3.  A compact, single-line SVG string of its 2D chemical structure. This SVG must be generated with extreme precision according to these rules:
        - The style should be a condensed structural formula with explicit bonds (e.g., CH3-CH2-OH).
        - It MUST have a 'viewBox' attribute. The viewBox must be calculated to include a generous padding of at least 15 units around the entire drawing on all four sides to prevent any part of the text or lines from being clipped.
        - The root <svg> tag MUST NOT have 'width' or 'height' attributes.
        - The background must be transparent.
        - All lines (bonds) and text must be black.
        - All chemical bonds must be drawn as clean, straight lines that precisely connect to the correct atoms. For example, a bond to a 'CH' group must point directly to the 'C'.
        - Use a standard, generic, sans-serif font for all text elements (like CH3, Cl, OH).
        - The final SVG string must be pure, without any XML declaration (<?xml...?>), DOCTYPE, or comments.
    
    The final step's product should be the target compound, ${targetCompound}.
    Ensure the chemical logic is sound and relevant to A/L level organic chemistry concepts.

    Your response MUST be only the raw JSON object that conforms to the provided schema, without any markdown formatting, comments, or extra text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: languageInstruction,
        responseMimeType: "application/json",
        responseSchema: synthesisSchema,
      },
    });
    
    const parsedResult = extractAndParseJson<SynthesisResult>(response.text);

    if (!parsedResult.pathway || !Array.isArray(parsedResult.pathway)) {
        throw new Error("Invalid response format from AI: pathway is missing or not an array.");
    }
    
    return parsedResult;
  } catch (error) {
    console.error("Gemini API call failed:", error);
     if (error instanceof Error && error.message.includes("JSON")) {
        throw error;
    }
    throw new Error("Failed to generate synthesis pathway. The AI model may be unable to find a valid path or has returned an invalid response.");
  }
};

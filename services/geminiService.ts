import { GoogleGenAI, Modality, Type } from "@google/genai";
import { FormState, GeneratedPrompt } from '../types';
import { SYSTEM_PROMPT, GENERATION_TEMPLATE } from '../constants';

// NOTE: This is a placeholder for the API key.
// In a real application, this should be handled securely.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY is not defined. Please set it in your environment variables.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Utility to convert File to a base64 generative part
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
};

const generatedPromptSchema = {
    type: Type.OBJECT,
    properties: {
        prompt_title: { type: Type.STRING },
        model: { type: Type.STRING },
        description: { type: Type.STRING },
        outfit: {
            type: Type.OBJECT,
            properties: {
                style: { type: Type.STRING },
                details: { type: Type.STRING },
            },
            required: ['style', 'details']
        },
        pose_expression: {
            type: Type.OBJECT,
            properties: {
                pose: { type: Type.STRING },
                expression: { type: Type.STRING },
            },
            required: ['pose', 'expression']
        },
        lighting: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING },
                description: { type: Type.STRING },
            },
            required: ['type', 'description']
        },
        background: {
            type: Type.OBJECT,
            properties: {
                theme: { type: Type.STRING },
                elements: { type: Type.STRING },
            },
            required: ['theme', 'elements']
        },
        camera: {
            type: Type.OBJECT,
            properties: {
                angle: { type: Type.STRING },
                lens: { type: Type.STRING },
                composition: { type: Type.STRING },
            },
            required: ['angle', 'lens', 'composition']
        },
        color_palette: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        mood: { type: Type.STRING },
        quality: { type: Type.STRING },
        environment_effects: { type: Type.STRING },
    },
    required: [
        'prompt_title', 'model', 'description', 'outfit', 'pose_expression',
        'lighting', 'background', 'camera', 'color_palette', 'mood', 'quality',
        'environment_effects'
    ]
};

// Step 1: Generate the detailed prompts for image generation
const generateImagePrompts = async (inputs: FormState): Promise<GeneratedPrompt[]> => {
    let prompt = GENERATION_TEMPLATE
        .replace('{{num_images}}', String(inputs.numImages))
        .replace('{{age}}', String(inputs.age))
        .replace(/{{style}}/g, inputs.style)
        .replace('{{extra_notes}}', inputs.extraNotes);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: generatedPromptSchema,
            },
        }
    });

    try {
        const text = response.text.trim();
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error("The AI returned an invalid format. Please try again.");
    }
};

// Step 2: Generate a single image using a prompt and the original photo
const generateSingleImage = async (
    base64Image: string,
    mimeType: string,
    textPrompt: string
): Promise<string> => {
    
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };
    
    const textPart = {
        text: textPrompt,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [imagePart, textPart]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }

    throw new Error("Image generation failed. No image data received.");
};


export { fileToGenerativePart, generateImagePrompts, generateSingleImage };
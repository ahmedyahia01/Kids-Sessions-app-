
import React, { useState, useCallback } from 'react';
import { FormState, GeneratedPrompt } from './types';
import { PHOTO_STYLES } from './constants';
import { generateImagePrompts, generateSingleImage, fileToGenerativePart } from './services/geminiService';

import { FormPanel } from './components/FormPanel';
import { ResultsPanel } from './components/ResultsPanel';

const App: React.FC = () => {
    const [formState, setFormState] = useState<FormState>({
        childImage: null,
        age: 5,
        style: PHOTO_STYLES[0],
        numImages: 2,
        extraNotes: '',
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleFormChange = useCallback((field: keyof FormState, value: any) => {
        setFormState(prevState => ({ ...prevState, [field]: value }));
    }, []);

    const handleSubmit = async () => {
        if (!formState.childImage) {
            setError('Please upload a photo of the child.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            setLoadingMessage('Step 1/2: Generating creative photo concepts...');
            const imagePart = await fileToGenerativePart(formState.childImage);
            const prompts: GeneratedPrompt[] = await generateImagePrompts(formState);
            
            if (!prompts || prompts.length === 0) {
              throw new Error("The AI failed to generate any photo concepts. Please try again.");
            }

            const newImages: string[] = [];
            for (let i = 0; i < prompts.length; i++) {
                setLoadingMessage(`Step 2/2: Generating image ${i + 1} of ${prompts.length}...`);
                const textPrompt = `IMPORTANT: Use the reference image to extract the child's facial features with 100% accuracy and preserve them. Do NOT change face shape or identity. Apply the following theme:\n\n${JSON.stringify(prompts[i], null, 2)}`;
                
                const generatedImage = await generateSingleImage(imagePart.inlineData.data, imagePart.inlineData.mimeType, textPrompt);
                newImages.push(generatedImage);
                setGeneratedImages([...newImages]);

                // Add a small delay between image generation requests to avoid hitting rate limits.
                if (prompts.length > 1 && i < prompts.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
                }
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const handleEdit = async (index: number, prompt: string) => {
        if (!prompt || isLoading) return;
        setEditingIndex(index);
        setError(null);

        try {
            const originalImageSrc = generatedImages[index];
            const [meta, base64Data] = originalImageSrc.split(',');
            if (!meta || !base64Data) throw new Error('Invalid image source for editing.');
            const mimeType = meta.split(':')[1].split(';')[0];
            
            const newImageSrc = await generateSingleImage(base64Data, mimeType, prompt);

            setGeneratedImages(prevImages => {
                const newImages = [...prevImages];
                newImages[index] = newImageSrc;
                return newImages;
            });
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred while editing.');
        } finally {
            setEditingIndex(null);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 1a1 1 0 100-2H4a1 1 0 100 2h12zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 4a1 1 0 100 2h8a1 1 0 100-2H5z" clipRule="evenodd" />
                    </svg>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Kids Photo Session Generator
                    </h1>
                </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1">
                        <FormPanel 
                            formState={formState}
                            isLoading={isLoading}
                            onFormChange={handleFormChange}
                            onSubmit={handleSubmit}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <ResultsPanel 
                            isLoading={isLoading}
                            loadingMessage={loadingMessage}
                            generatedImages={generatedImages}
                            error={error}
                            editingIndex={editingIndex}
                            onEdit={handleEdit}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
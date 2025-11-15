
import React, { useState } from 'react';
import { FormState } from '../types';
import { PHOTO_STYLES } from '../constants';

interface FormPanelProps {
    formState: FormState;
    isLoading: boolean;
    onFormChange: (field: keyof FormState, value: any) => void;
    onSubmit: () => void;
}

export const FormPanel: React.FC<FormPanelProps> = ({ formState, isLoading, onFormChange, onSubmit }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            onFormChange('childImage', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
            <fieldset disabled={isLoading}>
                {/* Image Uploader */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Child's Photo
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Child preview" className="mx-auto h-24 w-24 object-cover rounded-full" />
                            ) : (
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>

                {/* Age */}
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Child's Age
                    </label>
                    <input
                        type="number"
                        id="age"
                        value={formState.age}
                        onChange={(e) => onFormChange('age', parseInt(e.target.value))}
                        min="1"
                        max="18"
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    />
                </div>

                {/* Style */}
                <div>
                    <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Session Style
                    </label>
                    <select
                        id="style"
                        value={formState.style}
                        onChange={(e) => onFormChange('style', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                    >
                        {PHOTO_STYLES.map(style => <option key={style}>{style}</option>)}
                    </select>
                </div>

                {/* Number of Images */}
                <div>
                    <label htmlFor="numImages" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Number of Images: <span className="font-bold text-pink-500">{formState.numImages}</span>
                    </label>
                    <input
                        type="range"
                        id="numImages"
                        min="1"
                        max="10"
                        value={formState.numImages}
                        onChange={(e) => onFormChange('numImages', parseInt(e.target.value))}
                        className="mt-1 w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                </div>

                {/* Extra Notes */}
                <div>
                    <label htmlFor="extraNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Optional Notes
                    </label>
                    <textarea
                        id="extraNotes"
                        rows={3}
                        value={formState.extraNotes}
                        onChange={(e) => onFormChange('extraNotes', e.target.value)}
                        placeholder="e.g., preferred outfit, props, mood..."
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    />
                </div>
            </fieldset>

            {/* Submit Button */}
            <button
                onClick={onSubmit}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    'Generate Photo Session'
                )}
            </button>
        </div>
    );
};

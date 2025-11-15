import React, { useState } from 'react';

interface ResultsPanelProps {
    isLoading: boolean;
    loadingMessage: string;
    generatedImages: string[];
    error: string | null;
    editingIndex: number | null;
    onEdit: (index: number, prompt: string) => void;
}

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <svg className="animate-spin h-12 w-12 text-pink-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Please wait, magic in progress...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{message}</p>
    </div>
);

const WelcomeMessage: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-pink-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Masterpieces Await</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Fill out the details on the left to create a unique and beautiful photo session for your child.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
        <p className="font-bold">An Error Occurred</p>
        <p>{message}</p>
    </div>
);

interface ImageCardProps {
    imageSrc: string;
    index: number;
    isEditing: boolean;
    onEdit: (index: number, prompt: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageSrc, index, isEditing, onEdit }) => {
    const [editPrompt, setEditPrompt] = useState('');
    const [showEditInput, setShowEditInput] = useState(false);

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editPrompt.trim() && !isEditing) {
            onEdit(index, editPrompt);
            setShowEditInput(false);
        }
    };
    
    return (
        <div className="group relative aspect-w-1 aspect-h-1 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
            <img src={imageSrc} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover" />
            
            {isEditing && (
                 <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center transition-opacity duration-300">
                    <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-white mt-2 text-sm font-medium">Editing...</span>
                </div>
            )}

            {!isEditing && (
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                     {showEditInput ? (
                        <form onSubmit={handleEditSubmit} className="flex gap-2">
                             <input
                                type="text"
                                value={editPrompt}
                                onChange={(e) => setEditPrompt(e.target.value)}
                                placeholder="e.g., Add a retro filter..."
                                className="w-full bg-white/20 text-white placeholder-gray-300 text-sm px-3 py-2 rounded-md border border-gray-400 focus:ring-pink-500 focus:border-pink-500 backdrop-blur-sm"
                                autoFocus
                                onBlur={() => setShowEditInput(false)}
                            />
                             <button 
                                type="submit" 
                                className="bg-pink-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-pink-700 transition-colors text-sm"
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                Go
                            </button>
                        </form>
                    ) : (
                        <div className="flex items-center justify-center gap-4">
                             <button 
                              onClick={() => setShowEditInput(true)}
                              className="bg-white/90 text-gray-800 font-semibold py-2 px-4 rounded-full flex items-center space-x-2 hover:bg-white transition-colors backdrop-blur-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                </svg>
                                <span>Edit</span>
                            </button>
                            <a 
                              href={imageSrc} 
                              download={`photo-session-${index + 1}.png`}
                              className="bg-white/90 text-gray-800 font-semibold py-2 px-4 rounded-full flex items-center space-x-2 hover:bg-white transition-colors backdrop-blur-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span>Download</span>
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


export const ResultsPanel: React.FC<ResultsPanelProps> = ({ isLoading, loadingMessage, generatedImages, error, editingIndex, onEdit }) => {
    if (isLoading) {
        return <Loader message={loadingMessage} />;
    }

    if (error && generatedImages.length === 0) {
        return <ErrorDisplay message={error} />;
    }

    if (generatedImages.length === 0) {
        return <WelcomeMessage />;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Images</h2>
             {error && <ErrorDisplay message={error} />}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                {generatedImages.map((imageSrc, index) => (
                    <ImageCard 
                        key={index}
                        imageSrc={imageSrc}
                        index={index}
                        isEditing={editingIndex === index}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </div>
    );
};
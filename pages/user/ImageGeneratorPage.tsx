
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { generateImage, GenerationConfig } from '../../services/geminiService';
import { useAuth } from '../../hooks/useAuth';
import { GeneratedImage } from '../../types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
const aspectRatios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];

const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

const ImageGeneratorPage: React.FC = () => {
    const { currentUser, deductCredit } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

    const handleGenerate = async () => {
        if (!prompt) {
            toast.error('Please enter a prompt.');
            return;
        }
        if (!currentUser) return;

        if (currentUser.credits < 1) {
            toast.error('You do not have enough credits to generate an image.');
            return;
        }

        setIsLoading(true);
        try {
            const config: GenerationConfig = {
                prompt,
                aspectRatio,
                numberOfImages: 1,
            };
            
            const success = deductCredit(currentUser.id, 1);
            if(!success) {
                setIsLoading(false);
                return;
            }

            const imageUrl = await generateImage(config);
            const newImage: GeneratedImage = {
                id: `img_${Date.now()}`,
                prompt,
                url: imageUrl,
                createdAt: new Date().toISOString()
            };
            setGeneratedImages(prev => [newImage, ...prev]);
            toast.success('Image generated successfully!');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(`Generation failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteImage = (id: string) => {
        setGeneratedImages(prev => prev.filter(img => img.id !== id));
        toast.success("Image deleted.");
    }

    const downloadImage = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name.replace(/\s+/g, '_').slice(0, 20)}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    

    return (
        <div className="space-y-8">
            <Card>
                <h1 className="text-3xl font-bold mb-2">Image Generator</h1>
                <p className="text-gray-400 mb-6">Describe the image you want to create. Each generation costs 1 credit.</p>
                <div className="space-y-4">
                    <Input
                        label="Prompt"
                        id="prompt"
                        placeholder="e.g., A neon hologram of a cat driving at top speed"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                    />
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">Aspect Ratio</label>
                        <div className="flex flex-wrap gap-2">
                            {aspectRatios.map(ratio => (
                                <button
                                    key={ratio}
                                    onClick={() => setAspectRatio(ratio)}
                                    className={`px-4 py-2 text-sm rounded-full transition-colors border-2 ${aspectRatio === ratio ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-500'}`}
                                    disabled={isLoading}
                                >
                                    {ratio}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button onClick={handleGenerate} isLoading={isLoading} disabled={isLoading || !prompt}>
                        Generate Image
                    </Button>
                </div>
            </Card>

            <AnimatePresence>
                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Card className="flex items-center justify-center p-16">
                            <Loader text="Generating your masterpiece..." />
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div>
                <h2 className="text-2xl font-bold mb-4">Your Session Gallery</h2>
                {generatedImages.length === 0 && !isLoading ? (
                    <Card className="text-center py-12">
                        <p className="text-gray-400">Your generated images will appear here.</p>
                    </Card>
                ) : (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                        {generatedImages.map((image) => (
                            <motion.div
                                layout
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="group relative overflow-hidden rounded-xl shadow-lg"
                            >
                                <img src={image.url} alt={image.prompt} className="w-full h-full object-cover aspect-square" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                                    <p className="text-sm text-white line-clamp-3">{image.prompt}</p>
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => downloadImage(image.url, image.prompt)} className="p-2 rounded-full bg-black/50 hover:bg-green-500 text-white transition-colors"><DownloadIcon /></button>
                                        <button onClick={() => deleteImage(image.id)} className="p-2 rounded-full bg-black/50 hover:bg-red-500 text-white transition-colors"><DeleteIcon /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

        </div>
    );
};

export default ImageGeneratorPage;

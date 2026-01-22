import { useState } from 'react';
import { usePreferenceStore } from '../../store/usePreferenceStore';
import type { SceneType } from '../../store/usePreferenceStore';

interface Scene {
    id: SceneType;
    name: string;
    preview: string;
}

const scenes: Scene[] = [
    { id: 'beach', name: 'Beach', preview: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?w=200' },
    { id: 'mountains', name: 'Mountains', preview: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?w=200' },
    { id: 'forest', name: 'Forest', preview: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?w=200' },
    { id: 'rain', name: 'Rainy Day', preview: 'https://images.pexels.com/photos/1529360/pexels-photo-1529360.jpeg?w=200' },
    { id: 'library', name: 'Library', preview: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?w=200' },
    { id: 'cafe', name: 'Coffee Shop', preview: 'https://images.pexels.com/photos/1002740/pexels-photo-1002740.jpeg?w=200' },
    { id: 'stars', name: 'Night Sky', preview: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?w=200' },
    { id: 'campfire', name: 'Campfire', preview: 'https://images.pexels.com/photos/1368382/pexels-photo-1368382.jpeg?w=200' },
    { id: 'snow', name: 'Snowfall', preview: 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?w=200' },
    { id: 'sunrise', name: 'Sunrise', preview: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?w=200' },
    { id: 'city', name: 'City Night', preview: 'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?w=200' },
    { id: 'nature', name: 'Nature', preview: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?w=200' },
];

interface BackgroundSelectorProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BackgroundSelector({ isOpen, onClose }: BackgroundSelectorProps) {
    const { calmScene, setPreference } = usePreferenceStore();
    const [selected, setSelected] = useState<SceneType>(calmScene);

    const handleSelect = (sceneId: SceneType) => {
        setSelected(sceneId);
        setPreference('calmScene', sceneId);
        setPreference('focusScene', sceneId);
        setPreference('sleepScene', sceneId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">Choose Background</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scene Grid */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-3 gap-4">
                        {scenes.map((scene) => (
                            <button
                                key={scene.id}
                                onClick={() => handleSelect(scene.id)}
                                className={`relative aspect-video rounded-xl overflow-hidden group transition-all ${selected === scene.id
                                        ? 'ring-4 ring-indigo-500 ring-offset-2'
                                        : 'hover:ring-2 hover:ring-gray-300'
                                    }`}
                            >
                                <img
                                    src={scene.preview}
                                    alt={scene.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span className="absolute bottom-2 left-2 text-white text-sm font-medium">
                                    {scene.name}
                                </span>
                                {selected === scene.id && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}

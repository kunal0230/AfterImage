/**
 * ScenePlayer.tsx - Background Video/Image Player
 * 
 * Displays scenic backgrounds based on user preferences.
 * Supports video with image fallback.
 */

import { useEffect, useRef, useState } from 'react';
import { usePreferenceStore } from '../../store/usePreferenceStore';
import type { SceneType } from '../../store/usePreferenceStore';

// Scene asset configuration
interface SceneAsset {
    video?: string;
    image: string;
    gradient: string;
}

const SCENE_ASSETS: Record<SceneType, SceneAsset> = {
    // Calm scenes
    mountains: {
        video: 'https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_30fps.mp4',
        image: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
    },
    beach: {
        video: 'https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4',
        image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #0077b6 0%, #023e8a 100%)',
    },
    rain: {
        video: 'https://videos.pexels.com/video-files/6398107/6398107-hd_1920_1080_25fps.mp4',
        image: 'https://images.pexels.com/photos/1529360/pexels-photo-1529360.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
    },
    forest: {
        video: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
        image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #234e52 0%, #1a202c 100%)',
    },
    // Focus scenes
    library: {
        image: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #44403c 0%, #292524 100%)',
    },
    cafe: {
        video: 'https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4',
        image: 'https://images.pexels.com/photos/1002740/pexels-photo-1002740.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
    },
    minimal: {
        image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
    },
    nature: {
        video: 'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_30fps.mp4',
        image: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)',
    },
    // Sleep scenes
    stars: {
        video: 'https://videos.pexels.com/video-files/857030/857030-hd_1920_1080_25fps.mp4',
        image: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
    },
    campfire: {
        video: 'https://videos.pexels.com/video-files/857008/857008-hd_1920_1080_25fps.mp4',
        image: 'https://images.pexels.com/photos/1368382/pexels-photo-1368382.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #7c2d12 0%, #1c1917 100%)',
    },
    snow: {
        video: 'https://videos.pexels.com/video-files/855773/855773-hd_1920_1080_25fps.mp4',
        image: 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
    },
    clouds: {
        video: 'https://videos.pexels.com/video-files/2098989/2098989-hd_1920_1080_30fps.mp4',
        image: 'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    },
    // Energy scenes
    sunrise: {
        video: 'https://videos.pexels.com/video-files/856462/856462-hd_1920_1080_30fps.mp4',
        image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
    },
    city: {
        video: 'https://videos.pexels.com/video-files/2795405/2795405-hd_1920_1080_30fps.mp4',
        image: 'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    },
    ocean: {
        video: 'https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4',
        image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    },
    storm: {
        video: 'https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_30fps.mp4',
        image: 'https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
    },
    // Nostalgia scenes
    sunset: {
        video: 'https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_30fps.mp4',
        image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    vintage: {
        image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #a16207 0%, #78350f 100%)',
    },
    childhood: {
        image: 'https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
    },
    seasons: {
        video: 'https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_30fps.mp4',
        image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&w=1920',
        gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    },
};

export function ScenePlayer() {
    const { calmScene } = usePreferenceStore();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoError, setVideoError] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);

    // Use calm scene as default (will be extended to support mood-based selection)
    const currentScene = calmScene;
    const assets = SCENE_ASSETS[currentScene] || SCENE_ASSETS.beach;

    // Reset state when scene changes
    useEffect(() => {
        setVideoError(false);
        setVideoLoaded(false);
    }, [currentScene]);

    // Load video when assets change
    useEffect(() => {
        if (videoRef.current && assets.video) {
            videoRef.current.load();
        }
    }, [assets.video]);

    const showImage = !assets.video || videoError || !videoLoaded;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Video Background */}
            {assets.video && !videoError && (
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => setVideoError(true)}
                    onLoadedData={() => setVideoLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <source src={assets.video} type="video/mp4" />
                </video>
            )}

            {/* Image Fallback */}
            <div
                className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${showImage ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{ backgroundImage: `url(${assets.image})` }}
            />

            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Vignette Effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
                }}
            />
        </div>
    );
}

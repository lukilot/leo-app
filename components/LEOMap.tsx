"use client";

import { useEffect, useRef, useState } from 'react';
import Map, { Marker, NavigationControl, Source, Layer, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from "@/lib/utils";
import { MapPin, NavigationIcon } from "lucide-react";
import { motion } from "framer-motion";

// Retrieve token from env or fallback for development visibility
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface LEOMapProps {
    className?: string;
    theme?: 'tactical' | 'consumer';
    initialViewState?: {
        latitude: number;
        longitude: number;
        zoom: number;
    };
    markers?: Array<{
        id: string;
        latitude: number;
        longitude: number;
        label?: string;
        type?: 'stop' | 'hub' | 'user';
    }>;
    route?: any; // GeoJSON
    interactive?: boolean;
}

export default function LEOMap({
    className,
    theme = 'tactical',
    initialViewState = {
        latitude: 52.2297,
        longitude: 21.0122, // Warsaw
        zoom: 12
    },
    markers = [],
    route,
    interactive = true
}: LEOMapProps) {
    const mapRef = useRef<MapRef>(null);

    // Styles based on Vision 2026 Proto
    const mapStyle = theme === 'tactical'
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11";

    return (
        <div className={cn("relative w-full h-full overflow-hidden rounded-[2.5rem] bg-gray-900/50", className)}>
            <Map
                ref={mapRef}
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={initialViewState}
                style={{ width: '100%', height: '100%' }}
                mapStyle={mapStyle}
                interactive={interactive}
                attributionControl={false}
            >
                {/* CUSTOM LEO ROUTE LAYER */}
                {route && (
                    <Source id="route-source" type="geojson" data={route}>
                        <Layer
                            id="route-layer"
                            type="line"
                            paint={{
                                'line-color': theme === 'tactical' ? '#FFD700' : '#000000',
                                'line-width': 4,
                                'line-opacity': 0.8,
                                'line-dasharray': [1, 2]
                            }}
                        />
                    </Source>
                )}

                {/* DATA MARKERS */}
                {markers.map((marker, i) => (
                    <Marker
                        key={marker.id}
                        latitude={marker.latitude}
                        longitude={marker.longitude}
                        anchor="bottom"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.1 }}
                            className="group cursor-pointer flex flex-col items-center"
                        >
                            {marker.label && (
                                <div className={cn(
                                    "mb-2 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all scale-0 group-hover:scale-100 origin-bottom whitespace-nowrap",
                                    theme === 'tactical' ? "bg-black text-white border border-white/10" : "bg-white text-black border border-gray-100"
                                )}>
                                    {marker.label}
                                </div>
                            )}

                            <div className={cn(
                                "relative h-10 w-10 flex items-center justify-center rounded-2xl shadow-3xl transition-transform active:scale-90",
                                marker.type === 'user'
                                    ? "bg-leo-primary text-black"
                                    : theme === 'tactical' ? "bg-black text-leo-primary border border-leo-primary/50" : "bg-white text-black border-2 border-black"
                            )}>
                                {marker.type === 'user' ? (
                                    <NavigationIcon className="w-5 h-5 fill-current" />
                                ) : (
                                    <span className="text-[12px] font-black italic">{i + 1}</span>
                                )}

                                {marker.type === 'user' && (
                                    <span className="absolute inset-0 rounded-2xl bg-leo-primary/20 animate-ping -z-10" />
                                )}
                            </div>
                        </motion.div>
                    </Marker>
                ))}

                {interactive && (
                    <div className="absolute top-4 right-4">
                        <NavigationControl showCompass={false} />
                    </div>
                )}
            </Map>

            {/* VIGNETTE OVERLAY FOR PREMIUM FEEL */}
            <div className="absolute inset-0 pointer-events-none ring-[12px] ring-inset ring-black/5 rounded-[2.5rem]" />
        </div>
    );
}

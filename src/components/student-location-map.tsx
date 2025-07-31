
"use client";

import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Plus, Minus } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/indian-maps@1.0.1/maps/india/states.json";

// Coordinates for localities near Chennai
const markers = [
  { markerOffset: 15, name: "Mugalivakkam", coordinates: [80.1706, 13.0232], students: 45 },
  { markerOffset: 15, name: "Porur", coordinates: [80.1639, 13.0333], students: 80 },
  { markerOffset: 15, name: "Siruseri", coordinates: [80.2234, 12.82], students: 120 },
  { markerOffset: 15, name: "Vadapalani", coordinates: [80.2121, 13.0579], students: 65 },
  { markerOffset: 15, name: "OMR", coordinates: [80.229, 12.883], students: 250 },
];

export function StudentLocationMap() {
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState({ coordinates: [80.2, 12.9], zoom: 12 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  function handleZoomIn() {
    if (position.zoom >= 24) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }

  function handleMoveEnd(position: any) {
    setPosition(position);
  }


  if (!isClient) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <div className="relative h-full w-full">
        <TooltipProvider>
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 2500, // This will be overridden by ZoomableGroup, but good for base
                    center: [80.2, 13.0] // Center on Chennai
                }}
                className="h-full w-full"
            >
                <ZoomableGroup
                    zoom={position.zoom}
                    center={position.coordinates as [number, number]}
                    onMoveEnd={handleMoveEnd}
                >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                    geographies
                        .filter(geo => geo.properties.st_nm === "Tamil Nadu")
                        .map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                className="fill-muted-foreground/30 stroke-background outline-none"
                            />
                        ))
                    }
                </Geographies>
                {markers.map(({ name, coordinates, markerOffset, students }) => (
                    <Tooltip key={name}>
                    <TooltipTrigger asChild>
                        <Marker coordinates={coordinates as [number, number]}>
                        <circle r={0.2} className="fill-primary/70 stroke-primary-foreground stroke-[0.1]" />
                        </Marker>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="text-sm font-semibold">{name}</div>
                        <div className="text-xs text-muted-foreground">{students} students</div>
                    </TooltipContent>
                    </Tooltip>
                ))}
                </ZoomableGroup>
            </ComposableMap>
        </TooltipProvider>
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button size="icon" onClick={handleZoomIn}>
                <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={handleZoomOut}>
                <Minus className="h-4 w-4" />
            </Button>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const markers = [
  { markerOffset: -15, name: "Buenos Aires", coordinates: [-58.3816, -34.6037], students: 120 },
  { markerOffset: -15, name: "La Paz", coordinates: [-68.1193, -16.4897], students: 50 },
  { markerOffset: 25, name: "Brasilia", coordinates: [-47.8825, -15.7942], students: 250 },
  { markerOffset: 25, name: "Santiago", coordinates: [-70.6693, -33.4489], students: 80 },
  { markerOffset: 25, name: "Bogota", coordinates: [-74.0721, 4.7110], students: 150 },
  { markerOffset: 25, name: "Quito", coordinates: [-78.4678, -0.1807], students: 30 },
  { markerOffset: -15, name: "Georgetown", coordinates: [-58.1551, 6.8013], students: 5 },
  { markerOffset: -15, name: "Asuncion", coordinates: [-57.5759, -25.2637], students: 15 },
  { markerOffset: 25, name: "Paramaribo", coordinates: [-55.2038, 5.8520], students: 8 },
  { markerOffset: 25, name: "Montevideo", coordinates: [-56.1645, -34.9011], students: 45 },
  { markerOffset: -15, name: "Caracas", coordinates: [-66.9036, 10.4806], students: 90 },
  { markerOffset: -15, name: "London", coordinates: [-0.1278, 51.5074], students: 350 },
  { markerOffset: -15, name: "New York", coordinates: [-74.0060, 40.7128], students: 800 },
  { markerOffset: -15, name: "Sydney", coordinates: [151.2093, -33.8688], students: 180 },
  { markerOffset: -15, name: "Tokyo", coordinates: [139.6917, 35.6895], students: 220 },
];

export function StudentLocationMap() {
  return (
    <TooltipProvider>
      <ComposableMap
        projectionConfig={{
          scale: 160,
        }}
        className="h-full w-full"
      >
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
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
                  <circle r={5} className="fill-primary/70 stroke-primary-foreground stroke-2" />
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
  );
}

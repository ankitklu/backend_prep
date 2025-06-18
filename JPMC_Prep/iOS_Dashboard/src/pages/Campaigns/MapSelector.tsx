import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface MapSelectorProps {
  center: { lat: number; lng: number };
  radius: number;
  onLocationChange: (location: { center: { lat: number; lng: number }; radius: number }) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ center, radius, onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [circle, setCircle] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [currentRadius, setCurrentRadius] = useState(radius);

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || map) return;

      const L = window.L;
      
      const newMap = L.map(mapRef.current).setView([center.lat, center.lng], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(newMap);

      // Add marker
      const newMarker = L.marker([center.lat, center.lng], { draggable: true }).addTo(newMap);
      
      // Add circle
      const newCircle = L.circle([center.lat, center.lng], {
        radius: radius * 1000, // Convert km to meters
        fillColor: '#3b82f6',
        fillOpacity: 0.2,
        color: '#3b82f6',
        weight: 2
      }).addTo(newMap);

      // Handle marker drag
      newMarker.on('dragend', function(e: any) {
        const position = e.target.getLatLng();
        newCircle.setLatLng(position);
        onLocationChange({
          center: { lat: position.lat, lng: position.lng },
          radius: currentRadius
        });
      });

      // Handle map click
      newMap.on('click', function(e: any) {
        const { lat, lng } = e.latlng;
        newMarker.setLatLng([lat, lng]);
        newCircle.setLatLng([lat, lng]);
        onLocationChange({
          center: { lat, lng },
          radius: currentRadius
        });
      });

      setMap(newMap);
      setMarker(newMarker);
      setCircle(newCircle);
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const handleRadiusChange = (newRadius: number) => {
    setCurrentRadius(newRadius);
    if (circle) {
      circle.setRadius(newRadius * 1000); // Convert km to meters
    }
    onLocationChange({
      center,
      radius: newRadius
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (map && marker && circle) {
            map.setView([latitude, longitude], 12);
            marker.setLatLng([latitude, longitude]);
            circle.setLatLng([latitude, longitude]);
            onLocationChange({
              center: { lat: latitude, lng: longitude },
              radius: currentRadius
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="radius">Coverage Radius (km)</Label>
          <Input
            id="radius"
            type="number"
            min="1"
            max="100"
            value={currentRadius}
            onChange={(e) => handleRadiusChange(Number(e.target.value))}
            placeholder="Enter radius in km"
          />
        </div>
        <div className="flex items-end">
          <Button type="button" onClick={getCurrentLocation} variant="outline" className="w-full">
            Use Current Location
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
      </div>
      
      <p className="text-sm text-muted-foreground">
        Click on the map or drag the marker to set your campaign center. The blue circle shows your coverage area.
      </p>
    </div>
  );
};

export default MapSelector;
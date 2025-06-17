import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapSelectorProps {
  onLocationSelect: (location: { center: { lat: number; lng: number }; radius: number }) => void;
}

const MapSelector = ({ onLocationSelect }: MapSelectorProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Delhi
  const [radius, setRadius] = useState(5);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([center.lat, center.lng], 11);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // Add initial marker and circle
    updateMapElements();

    // Handle map clicks
    mapInstance.current.on('click', (e: L.LeafletMouseEvent) => {
      const newCenter = { lat: e.latlng.lat, lng: e.latlng.lng };
      setCenter(newCenter);
      updateMapElements(newCenter, radius);
      onLocationSelect({ center: newCenter, radius });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    updateMapElements();
    onLocationSelect({ center, radius });
  }, [radius]);

  const updateMapElements = (newCenter = center, newRadius = radius) => {
    if (!mapInstance.current) return;

    // Remove existing marker and circle
    if (markerRef.current) {
      mapInstance.current.removeLayer(markerRef.current);
    }
    if (circleRef.current) {
      mapInstance.current.removeLayer(circleRef.current);
    }

    // Add new marker
    markerRef.current = L.marker([newCenter.lat, newCenter.lng])
      .addTo(mapInstance.current)
      .bindPopup(`Campaign Center<br/>Radius: ${newRadius}km`);

    // Add new circle
    circleRef.current = L.circle([newCenter.lat, newCenter.lng], {
      color: 'blue',
      fillColor: '#3b82f6',
      fillOpacity: 0.2,
      radius: newRadius * 1000 // Convert km to meters
    }).addTo(mapInstance.current);

    // Fit map to circle bounds
    mapInstance.current.fitBounds(circleRef.current.getBounds());
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    updateMapElements(center, newRadius);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(newCenter);
          if (mapInstance.current) {
            mapInstance.current.setView([newCenter.lat, newCenter.lng], 13);
          }
          updateMapElements(newCenter, radius);
          onLocationSelect({ center: newCenter, radius });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <Label htmlFor="radius">Coverage Radius (km)</Label>
          <Input
            id="radius"
            type="number"
            min="1"
            max="100"
            value={radius}
            onChange={(e) => handleRadiusChange(parseInt(e.target.value) || 1)}
            className="w-32"
          />
        </div>
        
        <Button type="button" onClick={getCurrentLocation} variant="outline">
          Use My Location
        </Button>
        
        <div className="text-sm text-gray-600">
          Click on the map to set campaign center
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-300 shadow-sm"
      />
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Center:</strong> {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
        </div>
        <div>
          <strong>Coverage:</strong> {radius}km radius
        </div>
      </div>
    </div>
  );
};

export default MapSelector;
import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px"
};

const center = {
  lat: 20.5937,
  lng: 78.9629
};

function LocationForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("admin");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locations, setLocations] = useState([]);

  const fetchLocations = async () => {
    const res = await axios.get("http://localhost:5000/api/locations");
    setLocations(res.data);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert lat/lng to numbers if provided, otherwise send as null
    const latitude = lat.trim() !== "" ? parseFloat(lat) : null;
    const longitude = lng.trim() !== "" ? parseFloat(lng) : null;

    await axios.post("http://localhost:5000/api/locations", {
      name,
      address,
      role,
      lat: latitude,
      lng: longitude
    });

    // Clear form and refresh
    setName("");
    setAddress("");
    setRole("admin");
    setLat("");
    setLng("");
    fetchLocations();
  };

  const markerColors = {
    admin: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    volunteer: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
        <input value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude (optional)" />
        <input value={lng} onChange={e => setLng(e.target.value)} placeholder="Longitude (optional)" />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="volunteer">Volunteer</option>
        </select>
        <button type="submit">Add Location</button>
      </form>

      <LoadScript googleMapsApiKey="GOOGLE_MAPS_API_KEY">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4}>
          {locations.map((loc, idx) => (
            <Marker
              key={idx}
              position={{ lat: loc.lat, lng: loc.lng }}
              icon={markerColors[loc.role]}
              title={`${loc.name} (${loc.role})`}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default LocationForm;

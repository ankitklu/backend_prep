import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Papa from "papaparse";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  marginBottom: "2rem"
};

const center = {
  lat: 20.5937,
  lng: 78.9629
};

type Role = "admin" | "volunteer";

interface Location {
  name: string;
  address: string;
  lat: number;
  lng: number;
  role: Role;
}

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function LocationForm() {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [role, setRole] = useState<Role>("admin");
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);

  const fetchLocations = async () => {
    try {
      const res = await axios.get<Location[]>("http://localhost:5000/api/locations");
      setLocations(res.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const latitude = lat.trim() !== "" ? parseFloat(lat) : null;
    const longitude = lng.trim() !== "" ? parseFloat(lng) : null;

    try {
      await axios.post("http://localhost:5000/api/locations", {
        name,
        address,
        role,
        lat: latitude,
        lng: longitude
      });

      setName("");
      setAddress("");
      setRole("admin");
      setLat("");
      setLng("");
      fetchLocations();
    } catch (err) {
      console.error("Error adding location:", err);
    }
  };

  const handleCSVUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];

        const validData = rows.filter(row =>
          row.name && row.address && row.role
        ).map(row => ({
          name: row.name,
          address: row.address,
          role: row.role as Role,
          lat: row.lat ? parseFloat(row.lat) : null,
          lng: row.lng ? parseFloat(row.lng) : null
        }));

        if (validData.length === 0) {
          alert("No valid rows found in CSV.");
          return;
        }

        try {
          await axios.post("http://localhost:5000/api/locations/bulk", validData);
          fetchLocations();
        } catch (err) {
          console.error("Bulk upload failed:", err);
        }
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
        alert("Failed to parse CSV file.");
      }
    });
  };

  const markerColors: Record<Role, string> = {
    admin: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    volunteer: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Location Management</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          required
          style={styles.input}
        />
        <input
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Address"
          required
          style={styles.input}
        />
        <input
          value={lat}
          onChange={e => setLat(e.target.value)}
          placeholder="Latitude (optional)"
          style={styles.input}
        />
        <input
          value={lng}
          onChange={e => setLng(e.target.value)}
          placeholder="Longitude (optional)"
          style={styles.input}
        />
        <select value={role} onChange={e => setRole(e.target.value as Role)} style={styles.select}>
          <option value="admin">Admin</option>
          <option value="volunteer">Volunteer</option>
        </select>
        <button type="submit" style={styles.button}>Add Location</button>
      </form>

      <div style={styles.csvUpload}>
        <label style={{ marginBottom: "5px", fontWeight: "500" }}>
          Upload CSV (name, address, lat, lng, role):
        </label>
        <input type="file" accept=".csv" onChange={handleCSVUpload} style={styles.inputFile} />
      </div>

      <LoadScript googleMapsApiKey={googleMapsApiKey}>
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

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    maxWidth: "900px",
    margin: "auto",
    padding: "20px",
    background: "#f9fafb",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif"
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333"
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center"
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    flex: "1",
    minWidth: "180px"
  },
  inputFile: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "100%"
  },
  select: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
  },
  csvUpload: {
    marginBottom: "30px"
  }
};

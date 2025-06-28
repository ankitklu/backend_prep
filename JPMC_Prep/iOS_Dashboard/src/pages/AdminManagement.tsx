import { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  Phone,
  MapPin,
  Globe2,
  UserPlus,
  Users,
  Trash2,
  Pencil,
} from "lucide-react";

type Admin = {
  _id: string;
  email: string;
  address?: string;
  lat?: number;
  lng?: number;
  phone?: string;
};

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    address: "",
    lat: "",
    lng: "",
    phone: "",
  });

  const fetchAdmins = async () => {
    const res = await axios.get("http://localhost:5001/api/admins/all");
    setAdmins(res.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        lat: Number(formData.lat),
        lng: Number(formData.lng),
      };

      if (editingId) {
        await axios.put(`http://localhost:5001/api/admins/update/${editingId}`, payload);
      } else {
        await axios.post("http://localhost:5001/api/admins/add", payload);
      }

      fetchAdmins();
      setFormData({ email: "", password: "", address: "", lat: "", lng: "", phone: "" });
      setEditingId(null);
    } catch (err: any) {
      alert(err.response?.data?.error || "Submission failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      try {
        await axios.delete(`http://localhost:5001/api/admins/delete/${id}`);
        fetchAdmins();
      } catch (err: any) {
        alert(err.response?.data?.error || "Failed to delete admin");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-8 gap-8 bg-gradient-to-r from-blue-100 to-green-50">
      {/* Add/Edit Admin Form */}
      <form
        className="w-full lg:w-1/2 bg-blue-200 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2 className="text-3xl font-extrabold flex items-center gap-2 text-blue-700 mb-6">
          <UserPlus className="w-6 h-6" />
          {editingId ? "Update Admin" : "Add New Admin"}
        </h2>

        {[
          { name: "email", type: "email", placeholder: "Email", icon: <Mail className="w-5 h-5 text-gray-500" /> },
          { name: "password", type: "password", placeholder: "Password" },
          { name: "address", type: "text", placeholder: "Address", icon: <MapPin className="w-5 h-5 text-gray-500" /> },
          { name: "lat", type: "number", placeholder: "Latitude", icon: <Globe2 className="w-5 h-5 text-gray-500" /> },
          { name: "lng", type: "number", placeholder: "Longitude", icon: <Globe2 className="w-5 h-5 text-gray-500" /> },
          { name: "phone", type: "text", placeholder: "Phone", icon: <Phone className="w-5 h-5 text-gray-500" /> },
        ].map(({ name, type, placeholder, icon }) => (
          <div key={name} className="relative mb-4">
            {icon && <span className="absolute left-3 top-2.5">{icon}</span>}
            <input
              name={name}
              type={type}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              placeholder={placeholder}
              required={name === "email" || (name === "password" && !editingId)}
              className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 mt-4 rounded-lg hover:bg-blue-700 transition-all p-4"
        >
          {editingId ? "Update Admin" : "Add Admin"}
        </button>
      </form>

      {/* Admin List */}
      <div className="w-full lg:w-1/2 bg-green-200 p-6 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-green-700 flex items-center gap-2 mb-4">
          <Users className="w-6 h-6" /> Registered Admins
        </h2>

        <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <ul className="space-y-4">
            {admins.map((admin) => (
              <li
                key={admin._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border hover:border-blue-300 relative"
              >
                <p className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-gray-600" /> <span>{admin.email}</span>
                </p>
                {admin.phone && (
                  <p className="flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-gray-600" /> <span>{admin.phone}</span>
                  </p>
                )}
                {admin.address && (
                  <p className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-gray-600" /> <span>{admin.address}</span>
                  </p>
                )}
                {(admin.lat || admin.lng) && (
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe2 className="w-4 h-4" /> ({admin.lat}, {admin.lng})
                  </p>
                )}

                {/* Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    title="Edit"
                    onClick={() => {
                      setEditingId(admin._id);
                      setFormData({
                        email: admin.email || "",
                        password: "",
                        address: admin.address || "",
                        lat: admin.lat?.toString() || "",
                        lng: admin.lng?.toString() || "",
                        phone: admin.phone || "",
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => handleDelete(admin._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

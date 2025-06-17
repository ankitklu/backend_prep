import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, MapPin } from "lucide-react";
import type { Campaign, Resource } from "../types";
import MapSelector from "./MapSelector";

interface CampaignFormProps {
  onSubmit: (campaign: Campaign) => void;
  onCancel: () => void;
}

const CampaignForm = ({ onSubmit, onCancel }: CampaignFormProps) => {
  const [formData, setFormData] = useState<Campaign>({
    name: "",
    description: "",
    type: "",
    startDate: "",
    endDate: "",
    goal: {
      type: "",
      target: 0,
      unit: ""
    },
    location: {
      center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
      radius: 5
    },
    resources: [],
    volunteersRequired: 0,
    partners: [],
    progress: {
      value: 0,
      updatedAt: new Date().toISOString()
    },
    contact: {
      name: "",
      phone: "",
      email: ""
    }
  });

  const [newResource, setNewResource] = useState<Resource>({
    name: "",
    required: 0,
    distributed: 0
  });

  const [newPartner, setNewPartner] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addResource = () => {
    if (newResource.name) {
      setFormData({
        ...formData,
        resources: [...formData.resources, newResource]
      });
      setNewResource({ name: "", required: 0, distributed: 0 });
    }
  };

  const removeResource = (index: number) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((_, i) => i !== index)
    });
  };

  const addPartner = () => {
    if (newPartner) {
      setFormData({
        ...formData,
        partners: [...formData.partners, newPartner]
      });
      setNewPartner("");
    }
  };

  const removePartner = (index: number) => {
    setFormData({
      ...formData,
      partners: formData.partners.filter((_, i) => i !== index)
    });
  };

  const handleLocationSelect = (location: { center: { lat: number; lng: number }; radius: number }) => {
    setFormData({
      ...formData,
      location
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 min-h-screen pb-28">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Create New Campaign</h2>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Campaign Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fundraising">Fundraising</SelectItem>
                  <SelectItem value="awareness">Awareness</SelectItem>
                  <SelectItem value="health-checkup">Health Check-up</SelectItem>
                  <SelectItem value="relief-distribution">Relief Distribution</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="volunteersRequired">Volunteers Required</Label>
              <Input
                id="volunteersRequired"
                type="number"
                value={formData.volunteersRequired}
                onChange={(e) => setFormData({ ...formData, volunteersRequired: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="goalType">Goal Type</Label>
              <Select 
                value={formData.goal.type} 
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  goal: { ...formData.goal, type: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fundraising">Fundraising</SelectItem>
                  <SelectItem value="beneficiaries">Number of Beneficiaries</SelectItem>
                  <SelectItem value="volunteers">Volunteer Recruitment</SelectItem>
                  <SelectItem value="awareness">Awareness Reach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target">Target Amount/Number</Label>
                <Input
                  id="target"
                  type="number"
                  value={formData.goal.target}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    goal: { ...formData.goal, target: parseInt(e.target.value) || 0 }
                  })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.goal.unit}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    goal: { ...formData.goal, unit: e.target.value }
                  })}
                  placeholder="e.g., INR, People, Trees"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Person</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contactName">Name</Label>
              <Input
                id="contactName"
                value={formData.contact.name}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact, name: e.target.value }
                })}
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contact.phone}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact, phone: e.target.value }
                })}
                required
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contact.email}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact, email: e.target.value }
                })}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Resources Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Resource name"
                value={newResource.name}
                onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Required"
                value={newResource.required}
                onChange={(e) => setNewResource({ ...newResource, required: parseInt(e.target.value) || 0 })}
              />
              <Button type="button" onClick={addResource} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {formData.resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{resource.name} - {resource.required} units</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeResource(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Partners */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Organizations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Partner organization name"
                value={newPartner}
                onChange={(e) => setNewPartner(e.target.value)}
              />
              <Button type="button" onClick={addPartner} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {formData.partners.map((partner, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{partner}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removePartner(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Coverage Area Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MapSelector onLocationSelect={handleLocationSelect} />
          <div className="mt-4 text-sm text-gray-600">
            Selected area: {formData.location.radius}km radius around {formData.location.center.lat.toFixed(4)}, {formData.location.center.lng.toFixed(4)}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
        Create Campaign
      </Button>
    </form>
  );
};

export default CampaignForm;
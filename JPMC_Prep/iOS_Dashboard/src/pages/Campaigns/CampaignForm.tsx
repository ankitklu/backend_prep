import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Users, Package } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import MapSelector from './MapSelector';

interface Campaign {
  name: string;
  description: string;
  type: string;
  startDate: Date | null;
  endDate: Date | null;
  goal: {
    type: string;
    target: number;
    unit: string;
  };
  location: {
    center: { lat: number; lng: number };
    radius: number;
  };
  resources: Array<{ name: string; required: number; distributed: number }>;
  volunteersRequired: number;
  partners: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
}

const CampaignForm = () => {
  const [campaign, setCampaign] = useState<Campaign>({
    name: '',
    description: '',
    type: '',
    startDate: null,
    endDate: null,
    goal: {
      type: '',
      target: 0,
      unit: ''
    },
    location: {
      center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
      radius: 5
    },
    resources: [{ name: '', required: 0, distributed: 0 }],
    volunteersRequired: 0,
    partners: [''],
    contact: {
      name: '',
      phone: '',
      email: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5001/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign),
      });

      if (response.ok) {
        alert('Campaign created successfully!');
        // Reset form
        setCampaign({
          name: '',
          description: '',
          type: '',
          startDate: null,
          endDate: null,
          goal: { type: '', target: 0, unit: '' },
          location: { center: { lat: 28.6139, lng: 77.2090 }, radius: 5 },
          resources: [{ name: '', required: 0, distributed: 0 }],
          volunteersRequired: 0,
          partners: [''],
          contact: { name: '', phone: '', email: '' }
        });
      } else {
        throw new Error('Failed to create campaign');
      }
    } catch (error) {
      alert("Error message: "+error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addResource = () => {
    setCampaign(prev => ({
      ...prev,
      resources: [...prev.resources, { name: '', required: 0, distributed: 0 }]
    }));
  };

  const addPartner = () => {
    setCampaign(prev => ({
      ...prev,
      partners: [...prev.partners, '']
    }));
  };

  const updateResource = (index: number, field: string, value: string | number) => {
    setCampaign(prev => ({
      ...prev,
      resources: prev.resources.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      )
    }));
  };

  const updatePartner = (index: number, value: string) => {
    setCampaign(prev => ({
      ...prev,
      partners: prev.partners.map((partner, i) => 
        i === index ? value : partner
      )
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create New Campaign
        </h1>
        <p className="text-muted-foreground mt-2">Launch your NGO campaign and make a difference</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Campaign details and objectives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={campaign.name}
                  onChange={(e) => setCampaign(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Campaign Type</Label>
                <Select value={campaign.type} onValueChange={(value) => setCampaign(prev => ({ ...prev, type: value }))}>
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
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={campaign.description}
                onChange={(e) => setCampaign(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your campaign objectives and purpose"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !campaign.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaign.startDate ? format(campaign.startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={campaign.startDate || undefined}
                      onSelect={(date) => setCampaign(prev => ({ ...prev, startDate: date || null }))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !campaign.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaign.endDate ? format(campaign.endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={campaign.endDate || undefined}
                      onSelect={(date) => setCampaign(prev => ({ ...prev, endDate: date || null }))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Goals</CardTitle>
            <CardDescription>Set your target objectives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="goalType">Goal Type</Label>
                <Input
                  id="goalType"
                  value={campaign.goal.type}
                  onChange={(e) => setCampaign(prev => ({ 
                    ...prev, 
                    goal: { ...prev.goal, type: e.target.value }
                  }))}
                  placeholder="e.g., People Helped, Funds Raised"
                  required
                />
              </div>
              <div>
                <Label htmlFor="target">Target Amount</Label>
                <Input
                  id="target"
                  type="number"
                  value={campaign.goal.target}
                  onChange={(e) => setCampaign(prev => ({ 
                    ...prev, 
                    goal: { ...prev.goal, target: Number(e.target.value) }
                  }))}
                  placeholder="Enter target number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={campaign.goal.unit}
                  onChange={(e) => setCampaign(prev => ({ 
                    ...prev, 
                    goal: { ...prev.goal, unit: e.target.value }
                  }))}
                  placeholder="e.g., INR, people, trees"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographical Targeting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geographical Targeting
            </CardTitle>
            <CardDescription>Define your campaign coverage area</CardDescription>
          </CardHeader>
          <CardContent>
            <MapSelector
              center={campaign.location.center}
              radius={campaign.location.radius}
              onLocationChange={(location) => setCampaign(prev => ({ ...prev, location }))}
            />
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Resources Required</CardTitle>
            <CardDescription>List all resources needed for this campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaign.resources.map((resource, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Resource Name</Label>
                  <Input
                    value={resource.name}
                    onChange={(e) => updateResource(index, 'name', e.target.value)}
                    placeholder="e.g., Medical Kits, Food Packets"
                  />
                </div>
                <div>
                  <Label>Required Quantity</Label>
                  <Input
                    type="number"
                    value={resource.required}
                    onChange={(e) => updateResource(index, 'required', Number(e.target.value))}
                    placeholder="Quantity needed"
                  />
                </div>
                <div>
                  <Label>Distributed</Label>
                  <Input
                    type="number"
                    value={resource.distributed}
                    onChange={(e) => updateResource(index, 'distributed', Number(e.target.value))}
                    placeholder="Already distributed"
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addResource}>
              Add Resource
            </Button>
          </CardContent>
        </Card>

        {/* Volunteers & Partners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team & Partnerships
            </CardTitle>
            <CardDescription>Volunteer requirements and partner organizations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="volunteers">Volunteers Required</Label>
              <Input
                id="volunteers"
                type="number"
                value={campaign.volunteersRequired}
                onChange={(e) => setCampaign(prev => ({ ...prev, volunteersRequired: Number(e.target.value) }))}
                placeholder="Number of volunteers needed"
              />
            </div>
            
            <div>
              <Label>Partner Organizations</Label>
              {campaign.partners.map((partner, index) => (
                <Input
                  key={index}
                  value={partner}
                  onChange={(e) => updatePartner(index, e.target.value)}
                  placeholder="Partner organization name"
                  className="mb-2"
                />
              ))}
              <Button type="button" variant="outline" onClick={addPartner}>
                Add Partner
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Campaign coordinator details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Person</Label>
                <Input
                  id="contactName"
                  value={campaign.contact.name}
                  onChange={(e) => setCampaign(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, name: e.target.value }
                  }))}
                  placeholder="Coordinator name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={campaign.contact.phone}
                  onChange={(e) => setCampaign(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, phone: e.target.value }
                  }))}
                  placeholder="Contact number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={campaign.contact.email}
                  onChange={(e) => setCampaign(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, email: e.target.value }
                  }))}
                  placeholder="Contact email"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="w-full md:w-auto px-12 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;
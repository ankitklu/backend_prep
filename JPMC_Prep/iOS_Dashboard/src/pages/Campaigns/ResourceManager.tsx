import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Package, Plus, AlertCircle, CheckCircle } from 'lucide-react';

interface Resource {
  name: string;
  required: number;
  distributed: number;
}

interface ResourceManagerProps {
  resources: Resource[];
  onAddResource: (resource: Resource) => void;
}

const ResourceManager: React.FC<ResourceManagerProps> = ({ resources, onAddResource }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState<Resource>({
    name: '',
    required: 0,
    distributed: 0
  });

  const handleAddResource = () => {
    if (newResource.name && newResource.required > 0) {
      onAddResource(newResource);
      setNewResource({ name: '', required: 0, distributed: 0 });
      setShowAddForm(false);
    }
  };

  const getResourceStatus = (distributed: number, required: number) => {
    const percentage = (distributed / required) * 100;
    if (percentage >= 100) return { status: 'Complete', color: 'text-green-600', icon: CheckCircle };
    if (percentage >= 75) return { status: 'Good', color: 'text-blue-600', icon: Package };
    if (percentage >= 50) return { status: 'In Progress', color: 'text-yellow-600', icon: Package };
    return { status: 'Low', color: 'text-red-600', icon: AlertCircle };
  };

  const totalResourcesRequired = resources.reduce((sum, resource) => sum + resource.required, 0);
  const totalResourcesDistributed = resources.reduce((sum, resource) => sum + resource.distributed, 0);
  const overallProgress = totalResourcesRequired > 0 ? (totalResourcesDistributed / totalResourcesRequired) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Resource Management
            </CardTitle>
            <CardDescription>
              Track and manage campaign resources
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Overall Progress */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-blue-800">Overall Resource Distribution</h3>
            <span className="text-sm font-medium text-blue-600">
              {overallProgress.toFixed(1)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-3 mb-2" />
          <p className="text-sm text-blue-700">
            {totalResourcesDistributed} of {totalResourcesRequired} resources distributed
          </p>
        </div>

        {/* Add Resource Form */}
        {showAddForm && (
          <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-medium">Add New Resource</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="resourceName">Resource Name</Label>
                <Input
                  id="resourceName"
                  value={newResource.name}
                  onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Medical Kits"
                />
              </div>
              <div>
                <Label htmlFor="required">Required Quantity</Label>
                <Input
                  id="required"
                  type="number"
                  value={newResource.required}
                  onChange={(e) => setNewResource(prev => ({ ...prev, required: Number(e.target.value) }))}
                  placeholder="Quantity needed"
                />
              </div>
              <div>
                <Label htmlFor="distributed">Distributed</Label>
                <Input
                  id="distributed"
                  type="number"
                  value={newResource.distributed}
                  onChange={(e) => setNewResource(prev => ({ ...prev, distributed: Number(e.target.value) }))}
                  placeholder="Already distributed"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddResource} size="sm">Add Resource</Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          </div>
        )}

        {/* Resource List */}
        <div className="space-y-4">
          {resources.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Resources Added</h3>
              <p className="text-gray-500">Add resources to track distribution progress</p>
            </div>
          ) : (
            resources.map((resource, index) => {
              const resourceStatus = getResourceStatus(resource.distributed, resource.required);
              const progressPercentage = (resource.distributed / resource.required) * 100;
              const StatusIcon = resourceStatus.icon;

              return (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-5 w-5 ${resourceStatus.color}`} />
                      <div>
                        <h4 className="font-medium">{resource.name}</h4>
                        <p className={`text-sm ${resourceStatus.color}`}>
                          {resourceStatus.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {resource.distributed} / {resource.required}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {progressPercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>{resource.required}</span>
                    </div>
                  </div>

                  {resource.distributed >= resource.required && (
                    <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                      ✅ Resource distribution complete!
                    </div>
                  )}
                  
                  {resource.distributed < resource.required && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-700">
                      ⚠️ {resource.required - resource.distributed} items still needed
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Resource Summary */}
        {resources.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{resources.length}</p>
              <p className="text-sm text-muted-foreground">Resource Types</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{totalResourcesDistributed}</p>
              <p className="text-sm text-muted-foreground">Total Distributed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{totalResourcesRequired}</p>
              <p className="text-sm text-muted-foreground">Total Required</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {resources.filter(r => r.distributed >= r.required).length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceManager;

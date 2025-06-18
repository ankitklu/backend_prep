import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Goal {
  type: string;
  target: number;
  unit: string;
}

interface ProgressData {
  value: number;
  updatedAt: string;
}

interface GoalTrackerProps {
  goal: Goal;
  progress: ProgressData;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ goal, progress }) => {
  const progressPercentage = (progress.value / goal.target) * 100;
  const remainingValue = goal.target - progress.value;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressStatus = (percentage: number) => {
    if (percentage >= 100) return { text: 'Completed', color: 'text-green-600' };
    if (percentage >= 75) return { text: 'On Track', color: 'text-blue-600' };
    if (percentage >= 50) return { text: 'In Progress', color: 'text-yellow-600' };
    return { text: 'Behind Schedule', color: 'text-red-600' };
  };

  const status = getProgressStatus(progressPercentage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goal Tracker
        </CardTitle>
        <CardDescription>
          Track progress towards your campaign objectives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-600">{goal.target}</p>
            <p className="text-sm text-muted-foreground">Target {goal.unit}</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">{progress.value}</p>
            <p className="text-sm text-muted-foreground">Achieved {goal.unit}</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Calendar className="h-8 w-8 mx-auto text-orange-600 mb-2" />
            <p className="text-2xl font-bold text-orange-600">{remainingValue}</p>
            <p className="text-sm text-muted-foreground">Remaining {goal.unit}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{goal.type}</h3>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${status.color}`}>{status.text}</span>
              <span className="text-sm text-muted-foreground">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="relative">
            <Progress value={progressPercentage} className="h-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white drop-shadow-md">
                {progress.value} / {goal.target} {goal.unit}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0 {goal.unit}</span>
            <span>{goal.target} {goal.unit}</span>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Progress Timeline</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Latest Update</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(progress.updatedAt), 'MMM dd, yyyy at hh:mm a')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{progress.value} {goal.unit}</p>
                <p className="text-xs text-muted-foreground">
                  {progressPercentage.toFixed(1)}% complete
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-blue-800">Campaign Insights</h4>
          <div className="space-y-1 text-sm text-blue-700">
            {progressPercentage >= 100 && (
              <p>🎉 Congratulations! You've reached your campaign goal!</p>
            )}
            {progressPercentage >= 75 && progressPercentage < 100 && (
              <p>🚀 Great progress! You're close to reaching your goal.</p>
            )}
            {progressPercentage >= 50 && progressPercentage < 75 && (
              <p>📈 Good momentum! Keep up the excellent work.</p>
            )}
            {progressPercentage < 50 && (
              <p>💪 Every step counts! Consider boosting your campaign efforts.</p>
            )}
            <p>
              At this rate, you need {remainingValue} more {goal.unit} to reach your target.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTracker;

'use client';

import { ProgressBar } from '@/components/customer/dashboard/progress-bar';
import { ActionButtons } from '@/components/customer/dashboard/action-buttons';
import { TaskList } from '@/components/customer/dashboard/status-indicators';

export default function DashboardPage() {
  // Mock data for MVP
  const progress = 60;
  const documentProgress = "3 of 5 documents uploaded";
  const formProgress = "1 of 2 forms completed";
  const callStatus = "No call scheduled";
  
  const tasks = [
    {
      title: "Upload Company Registration",
      status: "pending" as const,
      dueDate: "March 15, 2025"
    },
    {
      title: "Complete Company Information Form",
      status: "in-progress" as const,
      dueDate: "March 12, 2025"
    },
    {
      title: "Upload ID Document",
      status: "pending" as const,
      dueDate: "March 15, 2025"
    },
    {
      title: "Upload Contract",
      status: "completed" as const
    },
    {
      title: "Schedule Onboarding Call",
      status: "warning" as const,
      dueDate: "March 10, 2025"
    }
  ];
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Onboarding Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <ProgressBar percentage={progress} size="lg" />
      </div>
      
      <ActionButtons 
        documentProgress={documentProgress}
        formProgress={formProgress}
        callStatus={callStatus}
      />
      
      <div className="bg-gray-50 p-6 rounded-lg border">
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}

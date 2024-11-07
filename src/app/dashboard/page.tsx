import { DashboardContent } from "@/components/features/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white/75 backdrop-blur-md rounded-3xl p-8 shadow-lg">
        <DashboardContent />
      </div>
    </div>
  );
} 
import { TutorList } from "@/components/features/tutors/tutor-list";
import { FilterPanel } from "@/components/features/tutors/filter-panel";

export default function TutorsPage() {
  return (
    <div className="container py-8">
      <div className="grid gap-6 md:grid-cols-[300px_1fr] items-start">
        <FilterPanel />
        <TutorList />
      </div>
    </div>
  );
}

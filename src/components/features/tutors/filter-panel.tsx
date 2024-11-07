"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useSubjects } from "@/lib/hooks/useSubjects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  maxRating?: number;
  onRatingSelect?: (rating: number) => void;
  currentRating: number;
}

function StarRating({
  maxRating = 5,
  onRatingSelect,
  currentRating,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          onClick={() => onRatingSelect?.(rating)}
          onMouseEnter={() => setHoveredRating(rating)}
          onMouseLeave={() => setHoveredRating(null)}
          className="relative"
        >
          <Star
            className={cn(
              "w-6 h-6 transition-colors",
              rating <= (hoveredRating ?? currentRating)
                ? "fill-[#FFC726] text-[#FFC726]"
                : hoveredRating && rating <= hoveredRating
                ? "fill-[#FFE4A0] text-[#FFE4A0]"
                : "fill-transparent text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeSubjects } = useSubjects();

  const currentMinRate = Number(searchParams.get("minRate") ?? "0");
  const currentMaxRate = Number(searchParams.get("maxRate") ?? "100");
  const currentSubject = searchParams.get("subject") ?? "";
  const currentRating = Number(searchParams.get("minRating") ?? "0");

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleRateChange = (values: number[]) => {
    updateSearchParams({
      minRate: values[0].toString(),
      maxRate: values[1].toString(),
    });
  };

  const handleSubjectChange = (value: string) => {
    updateSearchParams({
      subject: value === "all" ? null : value,
    });
  };

  const handleRatingClick = (rating: number) => {
    updateSearchParams({
      minRating: rating === currentRating ? null : rating.toString(),
    });
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <Card className="p-6 sticky top-4">
      <h2 className="mb-6 text-lg font-semibold">Filters</h2>

      <div className="space-y-8">
        {/* Hourly Rate Range */}
        <div className="space-y-4">
          <Label>Hourly Rate Range</Label>
          <div className="pt-2">
            <Slider
              defaultValue={[currentMinRate, currentMaxRate]}
              max={100}
              step={1}
              minStepsBetweenThumbs={1}
              onValueChange={handleRateChange}
              className="relative flex items-center select-none touch-none w-full 
                [&>span[role=slider]]:h-5 
                [&>span[role=slider]]:w-5 
                [&>span[role=slider]]:rounded-full 
                [&>span[role=slider]]:bg-[#4B2E83] 
                [&>span[role=slider]]:border-2 
                [&>span[role=slider]]:border-white 
                [&>span[role=slider]]:shadow-lg 
                [&>span[role=slider]]:transition-all 
                [&>span[role=slider]]:hover:scale-110
                [&>span[role=slider]]:hover:bg-[#3b2466]
                [&>span[role=slider]]:active:scale-105
                [&_.range]:bg-[#4B2E83] 
                [&_[data-disabled]]:opacity-50"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>${currentMinRate}</span>
              <span>${currentMaxRate}</span>
            </div>
          </div>
        </div>

        {/* Subject Filter */}
        <div className="space-y-4">
          <Label>Subject</Label>
          <Select
            value={currentSubject || "all"}
            onValueChange={handleSubjectChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {activeSubjects?.map((subject) => (
                <SelectItem
                  key={subject.id}
                  value={subject.subjectName}
                  className="flex items-center justify-between"
                >
                  <span>{subject.subjectName}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({subject.tutorCount})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-4">
          <Label>Minimum Rating</Label>
          <StarRating
            currentRating={currentRating}
            onRatingSelect={handleRatingClick}
          />
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </Card>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TutorPost } from "@/lib/types/tutorPost";

interface TutorCardProps {
  tutor: TutorPost;
}

function getImagePath(profilePhoto: string | null) {
  if (!profilePhoto) return "/images/blank-pfp.png";
  // If the path already starts with http/https, return as is
  if (profilePhoto.startsWith("http")) return profilePhoto;
  // Otherwise, prepend the full URL
  return `${process.env.NEXT_PUBLIC_API_URL}${profilePhoto}`;
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Card className="p-6 transition-shadow hover:shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <Avatar className="w-24 h-24 shrink-0">
          <AvatarImage
            src={getImagePath(tutor.profilePhoto)}
            alt={tutor.user.username}
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/blank-pfp.png";
            }}
          />
          <AvatarFallback className="text-2xl">
            {tutor.user.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold truncate">
                {tutor.user.username}
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {tutor.tutorSubjects.map(({ subject }) => (
                  <Badge key={subject.id} variant="secondary">
                    {subject.subjectName}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-[#4B2E83]">
                ${Number(tutor.hourlyRate).toFixed(2)}/hr
              </div>
              {tutor.reviews && (
                <div className="text-sm text-gray-500">
                  ⭐ {tutor.reviews} reviews
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 text-gray-600 line-clamp-3">{tutor.bio}</p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
            <div className="text-sm text-gray-500">
              Experience: {tutor.experience || "Not specified"}
            </div>
            <button className="bg-[#FFC726] text-[#4B2E83] px-4 py-2 rounded-md font-semibold hover:bg-[#FFD54F] transition-colors shrink-0">
              Contact Tutor
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeCheckIcon, BadgeIcon } from "lucide-react";
import {
  useApiGetAttendants,
  useApiGetLessonsHandler,
  useApiGetPointStatisticsHandler,
} from "@/dist/kubb";
import { useParams, useSearchParams } from "next/navigation";
import { getCompletedPercentage, timestampToDateString } from "@/lib/utils";
import { paginationLimit } from "@/constants";
import { Pagination } from "@/components/Pagination";

function Attendee({
  username,
  dateRegistered,
  completedLessons,
  totalLessons,
  scores,
}: {
  username: string;
  dateRegistered: number;
  completedLessons: number;
  totalLessons: number;
  scores?: { points: number; maxPoints: number };
}) {
  const completionPercentage = getCompletedPercentage({
    completedLessons,
    totalLessons,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>{username}</CardTitle>
        <CardDescription>
          Зареєструвався у {timestampToDateString(dateRegistered)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full space-y-1">
              <p className="text-sm font-medium text-gray-500">Прогрес</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-base font-medium">
                  {completionPercentage}%
                </span>
              </div>
            </div>
            <div className="w-fit min-w-fit space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Сертифікат
              </p>
              <div className="flex items-center space-x-2">
                {completionPercentage == 100 ? (
                  <BadgeCheckIcon className="size-6 text-green-500" />
                ) : (
                  <BadgeIcon className="size-6 text-gray-200" />
                )}
                <span className="text-base font-medium">
                  {completionPercentage == 100
                    ? "Нагороджений"
                    : "Не нагороджений"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:gap-8">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Пройдено уроків
              </p>
              <p className="text-base font-medium">
                {completedLessons} з {totalLessons}
              </p>
            </div>
            {scores && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Набрано балів
                </p>
                <p className="text-base font-medium">
                  {scores.points} з {scores.maxPoints}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Attendees() {
  const { course: courseId } = useParams<{ course: string }>();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const lessons = useApiGetLessonsHandler(parseInt(courseId));
  const attendants = useApiGetAttendants({
    course_id: parseInt(courseId),
    list_options: `{"limit": ${paginationLimit}, "offset": ${(page - 1) * paginationLimit}}`,
  });

  const points = useApiGetPointStatisticsHandler(parseInt(courseId));

  return (
    <section className="w-full border-t py-12">
      <div className="grid gap-12 px-4 md:px-6">
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold">Учні</h2>
          <p className="text-gray-500">Перегляд учасників цього курсу.</p>
        </div>
        <div className="grid gap-6">
          {attendants.data?.users.map((attendee) => (
            <Attendee
              key={attendee.id}
              username={attendee.username}
              dateRegistered={attendee.date_registered}
              completedLessons={attendee.number_of_completed_lessons}
              totalLessons={lessons.data?.length || 0}
              scores={{
                points:
                  points.data?.users_points.sort(
                    (a, b) => b.points - a.points,
                  )[0]?.points || 0,
                maxPoints: points.data?.max_points || 0,
              }}
            />
          ))}
          {attendants.data?.users.length == 0 && (
            <p className="text-gray-500">
              Наразі на цьому курсі немає учасників.
            </p>
          )}
        </div>
        {attendants.data && attendants.data.count > paginationLimit && (
          <Pagination
            makeLink={(_page) =>
              `/teach/${courseId}/overview/attendees?page=${_page}`
            }
            currentPage={page}
            totalPages={Math.ceil(attendants.data?.count / paginationLimit)}
          />
        )}
      </div>
    </section>
  );
}

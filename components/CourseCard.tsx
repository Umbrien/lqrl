import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, translateCourseState } from "@/lib/utils";
import {
  Plus,
  BookCheck,
  MoveRight,
  CircleDollarSign,
  Calendar,
  CircleDashed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CourseColor, CourseState } from "@/constants";
import { clsx } from "clsx";

export function CourseCard({
  title,
  description,
  color,
  state,
  price,
  length,
  progress,
  intent = "learn",
  href,
}: {
  title: string;
  description?: string;
  color: CourseColor;
  state?: CourseState;
  price?: number;
  length?: string;
  progress?: string;
  intent?: "learn" | "teach" | "explore";
  href?: string;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader
        className={cn(
          color == "red" && "bg-red-50",
          color == "yellow" && "bg-yellow-50",
          color == "blue" && "bg-blue-50",
          color == "green" && "bg-green-50",
          "flex flex-1 flex-col justify-end",
        )}
      >
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-4">
        {!!state && (
          <div className="flex items-center gap-2">
            <BookCheck size="16" />
            <span className="text-sm">{translateCourseState(state)}</span>
          </div>
        )}
        {price != undefined && (
          <div className="flex items-center gap-2">
            <CircleDollarSign size="16" />
            <span className="text-sm">{price || "Безкоштовно"}</span>
          </div>
        )}
        {length && (
          <div className="flex items-center gap-2">
            <Calendar size="16" />
            <span className="text-sm">{length}</span>
          </div>
        )}
        {progress && (
          <div className="flex items-center gap-2">
            <CircleDashed size="16" />
            <span className="text-sm">{progress}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex w-full justify-end">
        {href && (
          <Button asChild variant="outline" className="items-center">
            <Link href={href}>
              {clsx(
                intent == "learn" && "Вчитися",
                intent == "teach" && "Редагувати",
                intent == "explore" && "Детальніше",
              )}
              <MoveRight size="16" className="ml-2" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function CourseCardNew() {
  return (
    <Card>
      <Link href="/teach/new">
        <CardContent className="flex h-full items-center justify-center p-6">
          <Plus />
        </CardContent>
      </Link>
    </Card>
  );
}

export function CourseCardNotFound() {
  return (
    <Card>
      <CardContent className="flex h-full items-center justify-center p-6">
        <span className="text-sm text-gray-500">Курсів не знайдено</span>
      </CardContent>
    </Card>
  );
}

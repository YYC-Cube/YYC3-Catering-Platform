"use client";

import * as React from "react";
import * as CalendarPrimitive from "react-day-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "../utils";
import { buttonVariants } from "../Button";

export type CalendarProps = React.ComponentProps<typeof CalendarPrimitive.Root>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <CalendarPrimitive.Root
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

function CalendarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="calendar-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

function CalendarTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="calendar-title"
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  );
}

function CalendarDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="calendar-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CalendarBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="calendar-body"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function CalendarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="calendar-footer"
      className={cn("flex items-center justify-between", className)}
      {...props}
    />
  );
}

function CalendarPrevButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      data-slot="calendar-prev-button"
      className={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        "h-7 w-7",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
    </button>
  );
}

function CalendarNextButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      data-slot="calendar-next-button"
      className={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        "h-7 w-7",
        className
      )}
      {...props}
    >
      <ChevronRightIcon className="h-4 w-4" />
    </button>
  );
}

export {
  Calendar,
  CalendarHeader,
  CalendarTitle,
  CalendarDescription,
  CalendarBody,
  CalendarFooter,
  CalendarPrevButton,
  CalendarNextButton,
};

import { useState } from 'react';
import { DatePicker } from "@/components/ui/date-picker";

interface DateRangePickerProps {
  value: [Date, Date];
  onChange: (dates: [Date, Date]) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [startDate, endDate] = value;

  return (
    <div className="flex items-center gap-2">
      <DatePicker
        selected={startDate}
        onChange={(date) => date && onChange([date, endDate])}
      />
      <span>to</span>
      <DatePicker
        selected={endDate}
        onChange={(date) => date && onChange([startDate, date])}
      />
    </div>
  );
}
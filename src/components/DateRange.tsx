import { FC } from 'react';

export interface DateRangeProps {
  start: string;
  end: string;
}

export const DateRange: FC<DateRangeProps> = ({ start, end }) => {
  return (
    <p className="text-slate-300 font-medium">
      {start} - {end}
    </p>
  );
};

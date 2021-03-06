import React, { ReactElement, ChangeEvent } from 'react';
import { timeFormatter } from 'client/utils/timeFormatter';

export interface Props {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  selectedTime: string;
  times: readonly string[];
}

// TODO: Only enable next open signup
// Check current time and enable new timestamp
// Show "signup starts xx:xx" on others
// Toggle to show upcoming gameslots or all gameslots

export const TimesDropdown = ({
  onChange,
  selectedTime,
  times,
}: Props): ReactElement => {
  const sortedTimes = times.map((sortedTime) => {
    const formattedDate = timeFormatter.getWeekdayAndTime({
      time: sortedTime,
      capitalize: true,
    });
    return (
      <option value={sortedTime} key={sortedTime}>
        {formattedDate}
      </option>
    );
  });

  return (
    <div className='times-dropdown'>
      <select onChange={onChange} value={selectedTime}>
        {sortedTimes}
      </select>
    </div>
  );
};

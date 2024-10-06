export function daysLeftToDate(futureDate: any) {
  const currentDate = new Date();
  const targetDate = new Date(futureDate);

  // Calculate the difference in milliseconds
  const diffTime = targetDate.getTime() - currentDate.getTime();

  // Convert milliseconds to days (1000 ms/s * 60 s/min * 60 min/hr * 24 hr/day)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

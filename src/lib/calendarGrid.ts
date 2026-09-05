export type CalCell = { n: number; cls: string; inMonth: boolean };

export function buildMonthGrid(year: number, month0: number, today: Date): CalCell[] {
  const first = new Date(year, month0, 1);
  const startDow = (first.getDay() + 6) % 7; // 월=0 ... 일=6
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month0, 0).getDate();

  const isToday = (d: number) =>
    d === today.getDate() && month0 === today.getMonth() && year === today.getFullYear();

  const cells: CalCell[] = [];
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ n: daysInPrevMonth - i, cls: "mut", inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ n: d, cls: isToday(d) ? "today" : "", inMonth: true });
  }
  let next = 1;
  while (cells.length % 7 !== 0 || cells.length < 35) {
    cells.push({ n: next++, cls: "mut", inMonth: false });
  }
  return cells;
}

export function monthLabel(year: number, month0: number) {
  return `${year}년 ${month0 + 1}월`;
}

export type JEGECalendarEdition = {
  id: string;
  name: string;
  theme?: string | null;
  location: string;
  startDate?: string | null;
  endDate?: string | null;
};

export function downloadJEGEICS(edition: JEGECalendarEdition) {
  if (!edition?.startDate) return;

  const fmt = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const start = new Date(edition.startDate);
  const end = edition.endDate
    ? new Date(edition.endDate)
    : new Date(start.getTime() + 8 * 60 * 60 * 1000);

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//IGE//JE-GE//FR',
    'BEGIN:VEVENT',
    `UID:jege-${edition.id}@ige-benin`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${edition.name}`,
    `DESCRIPTION:${edition.theme || ''}`,
    `LOCATION:${edition.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jege-2026.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

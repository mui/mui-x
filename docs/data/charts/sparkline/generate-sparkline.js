// Run `node generate-sparkline.js > weekly-downloads.json` To update the npm chart demo.

const startDate = '2024-08-08';
const endDate = '2025-08-06';
const packageName = '@mui/x-charts';

const main = async () => {
  const data = await fetch(
    `https://api.npmjs.org/downloads/range/${startDate}:${endDate}/${packageName}`,
  )
    .then((rep) => rep.json())
    .then((body) => body.downloads);

  const weeklyDownloads = data
    .map(({ day, downloads }) => ({
      downloads,
      day,
      weekId: `${day.slice(0, 4)}-${getISOWeek(new Date(day))}`,
    }))
    .reduce((acc, value) => {
      if (acc.length === 0 || acc[acc.length - 1].weekId !== value.weekId) {
        acc.push({
          downloads: value.downloads,
          weekId: value.weekId,
          start: value.day,
          end: value.day,
        });
        return acc;
      }

      acc[acc.length - 1].downloads += value.downloads;
      acc[acc.length - 1].end = value.day;
      return acc;
    }, []);

  console.log(
    JSON.stringify(weeklyDownloads.slice(1, weeklyDownloads.length - 1), null, 2),
  );
};

// Returns the ISO week of the date.
function getISOWeek(inputDate) {
  const date = new Date(inputDate.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

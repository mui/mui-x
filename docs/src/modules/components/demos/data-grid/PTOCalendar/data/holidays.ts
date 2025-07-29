interface Holiday {
  date: string;
  name: string;
  country: string;
}

interface HolidayApiResponse {
  date: string;
  name: string;
  countryCode: string;
  localName?: string;
  fixed?: boolean;
  global?: boolean;
  counties?: string[] | null;
  launchYear?: number | null;
  types?: string[];
}

export async function getHolidays(year: number, country: string): Promise<Holiday[]> {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
    if (!response.ok) {
      console.error(response);
      return [];
    }
    const data = (await response.json()) as HolidayApiResponse[];
    return data.map((holiday: HolidayApiResponse) => ({
      date: holiday.date,
      name: holiday.name,
      country: holiday.countryCode,
    }));
  } catch (error) {
    console.error(`Error fetching holidays for ${country}:`, error);
    return [];
  }
}

export async function getHolidaysForCountries(
  year: number,
  countries: string[],
): Promise<{ [key: string]: { [key: string]: string } }> {
  const holidays: { [key: string]: { [key: string]: string } } = {};

  await Promise.all(
    countries.map(async (country) => {
      const countryHolidays = await getHolidays(year, country);
      holidays[country] = {};
      countryHolidays.forEach((holiday) => {
        holidays[country][holiday.date] = holiday.name;
      });
    }),
  );

  return holidays;
}

import { GridColumns, GridComponentProps, GridRowModel } from '@mui/x-data-grid';

type Movie = {
  title: string;
  gross: number;
  director: string;
  company: string;
  year: number;
  composer: { name: string };
  cinematicUniverse?: string;
};

const COLUMNS: GridColumns = [
  { field: 'title', headerName: 'Title', width: 200, canBeGrouped: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    canBeGrouped: false,
    valueFormatter: ({ value }) => {
      if (!value || typeof value !== 'number') {
        return value;
      }
      return `${value.toLocaleString()}$`;
    },
  },
  {
    field: 'company',
    headerName: 'Company',
    width: 200,
  },
  {
    field: 'director',
    headerName: 'Director',
    width: 200,
  },
  {
    field: 'year',
    headerName: 'Year',
  },
  {
    field: 'cinematicUniverse',
    headerName: 'Cinematic Universe',
    width: 220,
  },
];

const ROWS: GridRowModel<Movie>[] = [
  {
    title: 'Avatar',
    gross: 2847246203,
    director: 'James Cameron',
    company: '20th Century Fox',
    year: 2009,
    composer: {
      name: 'James Horner',
    },
  },
  {
    title: 'Avengers: Endgame',
    gross: 2797501328,
    director: 'Anthony & Joe Russo',
    company: 'Disney Studios',
    year: 2019,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Alan Silvestri',
    },
  },
  {
    title: 'Titanic',
    gross: 2187425379,
    director: 'James Cameron',
    company: '20th Century Fox',
    year: 1997,
    composer: {
      name: 'James Horner',
    },
  },
  {
    title: 'Star Wars: The Force Awakens',
    gross: 2068223624,
    director: 'J. J. Abrams',
    company: 'Disney Studios',
    year: 2015,
    cinematicUniverse: 'Star Wars',
    composer: {
      name: 'John Williams',
    },
  },
  {
    title: 'Avengers: Infinity War',
    gross: 2048359754,
    director: 'Anthony & Joe Russo',
    company: 'Disney Studios',
    year: 2018,
    cinematicUniverse: 'Star Wars',
    composer: {
      name: 'Alan Silvestri',
    },
  },
  {
    title: 'Jurassic World',
    gross: 1671713208,
    director: 'Colin Trevorrow',
    company: 'Universal Pictures',
    year: 2015,
    cinematicUniverse: 'Jurassic Park',
    composer: {
      name: 'Michael Giacchino',
    },
  },
  {
    title: 'The Lion King',
    gross: 1656943394,
    director: 'Jon Favreau',
    company: 'Disney Studios',
    year: 2019,
    composer: {
      name: 'Hans Zimmer',
    },
  },
  {
    title: 'The Avengers',
    gross: 1518812988,
    director: 'Joss Whedon',
    company: 'Disney Studios',
    year: 2012,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Alan Silvestri',
    },
  },
  {
    title: 'Furious 7',
    gross: 1516045911,
    director: 'James Wan',
    company: 'Universal Pictures',
    year: 2015,
    cinematicUniverse: 'Fast & Furious',
    composer: {
      name: 'Brian Tyler',
    },
  },
  {
    title: 'Frozen II',
    gross: 1450026933,
    director: 'Chris Buck & Jennifer Lee',
    company: 'Disney Studios',
    year: 2019,
    cinematicUniverse: 'Frozen',
    composer: {
      name: 'Christophe Beck',
    },
  },
  {
    title: 'Avengers: Age of Ultron',
    gross: 1402804868,
    director: 'Joss Whedon',
    company: 'Disney Studios',
    year: 2015,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Danny Elfman',
    },
  },
  {
    title: 'Black Panther',
    gross: 1347280838,
    director: 'Ryan Coogler',
    company: 'Disney Studios',
    year: 2018,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Ludwig Göransson',
    },
  },
  {
    title: 'Harry Potter and the Deathly Hallows – Part 2',
    gross: 1342025430,
    director: 'David Yates',
    company: 'Warner Bros. Pictures',
    year: 2011,
    composer: {
      name: 'Alexandre Desplat',
    },
  },
  {
    title: 'Star Wars: The Last Jedi',
    gross: 1332539889,
    director: 'Rian Johnson',
    company: 'Disney Studios',
    year: 2017,
    cinematicUniverse: 'Star Wars',
    composer: {
      name: 'John Williams',
    },
  },
  {
    title: 'Jurassic World: Fallen Kingdom',
    gross: 1309484461,
    director: 'J. A. Bayona',
    company: 'Universal Pictures',
    year: 2018,
    cinematicUniverse: 'Jurassic Park',
    composer: {
      name: 'Michael Giacchino',
    },
  },
  {
    title: 'Frozen',
    gross: 1290000000,
    director: 'Chris Buck & Jennifer Lee',
    company: 'Disney Studios',
    year: 2013,
    cinematicUniverse: 'Frozen',
    composer: {
      name: 'Christophe Beck',
    },
  },
  {
    title: 'Beauty and the Beast',
    gross: 1263521136,
    director: 'Bill Condon',
    company: 'Disney Studios',
    year: 2017,
    composer: {
      name: 'Alan Menken',
    },
  },
  {
    title: 'Incredibles 2',
    gross: 1242805359,
    director: 'Brad Bird',
    company: 'Disney Studios',
    year: 2018,
    composer: {
      name: 'Michael Giacchino',
    },
  },
  {
    title: 'The Fate of the Furious',
    gross: 1238764765,
    director: 'F. Gary Gray',
    company: 'Universal Pictures',
    year: 2017,
    cinematicUniverse: 'Fast & Furious',
    composer: {
      name: 'Brian Tyler',
    },
  },
  {
    title: 'Iron Man 3',
    gross: 1214811252,
    director: 'Shane Black',
    company: 'Disney Studios',
    year: 2013,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Brian Tyler',
    },
  },
  {
    title: 'Minions',
    gross: 11159398397,
    director: 'Pierre Coffin & Kyle Balda',
    company: 'Universal Pictures',
    year: 2015,
    composer: {
      name: 'Heitor Pereira',
    },
  },
];

const getRowId = (row: any) => row.title;

export const useMovieData = (): Pick<GridComponentProps, 'rows' | 'columns' | 'getRowId'> => {
  return {
    getRowId,
    rows: ROWS,
    columns: COLUMNS,
  };
};

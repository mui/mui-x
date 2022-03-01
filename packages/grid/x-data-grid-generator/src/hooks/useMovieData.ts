import { GridColumns, GridRowModel } from '@mui/x-data-grid-pro';

type Movie = {
  id: number;
  title: string;
  gross: number;
  director: string;
  company: string;
  year: number;
  composer: { name: string };
  cinematicUniverse?: string;
};

const COLUMNS: GridColumns<any> = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
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
    id: 0,
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
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
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
    id: 13,
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
    id: 14,
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
    id: 15,
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
    id: 16,
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
    id: 17,
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
    id: 18,
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
    id: 19,
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
    id: 20,
    title: 'Minions',
    gross: 1159398397,
    director: 'Pierre Coffin & Kyle Balda',
    company: 'Universal Pictures',
    year: 2015,
    composer: {
      name: 'Heitor Pereira',
    },
  },
];

export const useMovieData = () => {
  return {
    rows: ROWS,
    columns: COLUMNS,
  };
};

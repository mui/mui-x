import { GridColDef, GridRowModel } from '@mui/x-data-grid-premium';

export type Movie = {
  id: number;
  title: string;
  gross: number;
  budget: number;
  director: string;
  company: string;
  year: number;
  imdbRating: number;
  composer: { name: string };
  cinematicUniverse?: string;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return currencyFormatter.format(value);
    },
  } as GridColDef<any, number, string>,
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
    type: 'number',
    valueFormatter: (value) => (typeof value === 'number' ? `${value}` : ''),
    availableAggregationFunctions: ['max', 'min'],
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
    budget: 237000000,
    director: 'James Cameron',
    company: '20th Century Fox',
    year: 2009,
    imdbRating: 7.9,
    composer: {
      name: 'James Horner',
    },
  },
  {
    id: 1,
    title: 'Avengers: Endgame',
    gross: 2797501328,
    budget: 356000000,
    director: 'Anthony & Joe Russo',
    company: 'Disney Studios',
    year: 2019,
    imdbRating: 8.4,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Alan Silvestri',
    },
  },
  {
    id: 2,
    title: 'Titanic',
    gross: 2187425379,
    budget: 200000000,
    director: 'James Cameron',
    company: '20th Century Fox',
    year: 1997,
    imdbRating: 7.9,
    composer: {
      name: 'James Horner',
    },
  },
  {
    id: 3,
    title: 'Star Wars: The Force Awakens',
    gross: 2068223624,
    budget: 306000000,
    director: 'J. J. Abrams',
    company: 'Disney Studios',
    year: 2015,
    imdbRating: 7.9,
    cinematicUniverse: 'Star Wars',
    composer: {
      name: 'John Williams',
    },
  },
  {
    id: 4,
    title: 'Avengers: Infinity War',
    gross: 2048359754,
    budget: 321000000,
    director: 'Anthony & Joe Russo',
    company: 'Disney Studios',
    year: 2018,
    imdbRating: 8.5,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Alan Silvestri',
    },
  },
  {
    id: 5,
    title: 'Spider-Man: No Way Home',
    gross: 1892768346,
    budget: 200000000,
    director: 'Jon Watts',
    company: 'Disney Studios',
    year: 2021,
    imdbRating: 8.3,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Michael Giacchino',
    },
  },
  {
    id: 6,
    title: 'Jurassic World',
    gross: 1671713208,
    budget: 150000000,
    director: 'Colin Trevorrow',
    company: 'Universal Pictures',
    year: 2015,
    imdbRating: 7.0,
    cinematicUniverse: 'Jurassic Park',
    composer: {
      name: 'Michael Giacchino',
    },
  },
  {
    id: 7,
    title: 'The Lion King',
    gross: 1656943394,
    budget: 260000000,
    director: 'Jon Favreau',
    company: 'Disney Studios',
    year: 2019,
    imdbRating: 6.9,
    composer: {
      name: 'Hans Zimmer',
    },
  },
  {
    id: 8,
    title: 'The Avengers',
    gross: 1518812988,
    budget: 220000000,
    director: 'Joss Whedon',
    company: 'Disney Studios',
    year: 2012,
    imdbRating: 8.1,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Alan Silvestri',
    },
  },
  {
    id: 9,
    title: 'Furious 7',
    gross: 1516045911,
    budget: 190000000,
    director: 'James Wan',
    company: 'Universal Pictures',
    year: 2015,
    imdbRating: 7.2,
    cinematicUniverse: 'Fast & Furious',
    composer: {
      name: 'Brian Tyler',
    },
  },
  {
    id: 10,
    title: 'Frozen II',
    gross: 1450026933,
    budget: 150000000,
    director: 'Chris Buck & Jennifer Lee',
    company: 'Disney Studios',
    year: 2019,
    imdbRating: 6.8,
    cinematicUniverse: 'Frozen',
    composer: {
      name: 'Christophe Beck',
    },
  },
  {
    id: 11,
    title: 'Avengers: Age of Ultron',
    gross: 1402804868,
    budget: 280000000,
    director: 'Joss Whedon',
    company: 'Disney Studios',
    year: 2015,
    imdbRating: 7.3,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Danny Elfman',
    },
  },
  {
    id: 12,
    title: 'Black Panther',
    gross: 1347280838,
    budget: 200000000,
    director: 'Ryan Coogler',
    company: 'Disney Studios',
    year: 2018,
    imdbRating: 7.3,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Ludwig Göransson',
    },
  },
  {
    id: 13,
    title: 'Harry Potter and the Deathly Hallows – Part 2',
    gross: 1342025430,
    budget: 125000000,
    director: 'David Yates',
    company: 'Warner Bros. Pictures',
    year: 2011,
    imdbRating: 8.2,
    cinematicUniverse: 'Harry Potter',
    composer: {
      name: 'Alexandre Desplat',
    },
  },
  {
    id: 14,
    title: 'Star Wars: The Last Jedi',
    gross: 1332539889,
    budget: 317000000,
    director: 'Rian Johnson',
    company: 'Disney Studios',
    year: 2017,
    imdbRating: 6.9,
    cinematicUniverse: 'Star Wars',
    composer: {
      name: 'John Williams',
    },
  },
  {
    id: 15,
    title: 'Jurassic World: Fallen Kingdom',
    gross: 1309484461,
    budget: 170000000,
    director: 'J. A. Bayona',
    company: 'Universal Pictures',
    year: 2018,
    cinematicUniverse: 'Jurassic Park',
    imdbRating: 6.2,
    composer: {
      name: 'Michael Giacchino',
    },
  },
  {
    id: 16,
    title: 'Frozen',
    gross: 1290000000,
    budget: 150000000,
    director: 'Chris Buck & Jennifer Lee',
    company: 'Disney Studios',
    year: 2013,
    imdbRating: 7.5,
    cinematicUniverse: 'Frozen',
    composer: {
      name: 'Christophe Beck',
    },
  },
  {
    id: 17,
    title: 'Beauty and the Beast',
    gross: 1263521136,
    budget: 160000000,
    director: 'Bill Condon',
    company: 'Disney Studios',
    year: 2017,
    imdbRating: 7.1,
    composer: {
      name: 'Alan Menken',
    },
  },
  {
    id: 18,
    title: 'Incredibles 2',
    gross: 1242805359,
    budget: 200000000,
    director: 'Brad Bird',
    company: 'Disney Studios',
    year: 2018,
    imdbRating: 7.6,
    composer: {
      name: 'Michael Giacchino',
    },
  },
  {
    id: 19,
    title: 'The Fate of the Furious',
    gross: 1238764765,
    budget: 250000000,
    director: 'F. Gary Gray',
    company: 'Universal Pictures',
    year: 2017,
    imdbRating: 6.6,
    cinematicUniverse: 'Fast & Furious',
    composer: {
      name: 'Brian Tyler',
    },
  },
  {
    id: 20,
    title: 'Iron Man 3',
    gross: 1214811252,
    budget: 200000000,
    director: 'Shane Black',
    company: 'Disney Studios',
    year: 2013,
    imdbRating: 7.2,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Brian Tyler',
    },
  },
  {
    id: 21,
    title: 'Minions',
    gross: 1159398397,
    budget: 74000000,
    director: 'Pierre Coffin & Kyle Balda',
    company: 'Universal Pictures',
    year: 2015,
    imdbRating: 6.4,
    composer: {
      name: 'Heitor Pereira',
    },
  },
  {
    id: 22,
    title: 'Captain America: Civil War',
    gross: 1153329473,
    budget: 250000000,
    director: 'Anthony & Joe Russo',
    company: 'Disney Studios',
    year: 2016,
    imdbRating: 7.8,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Henry Jackman',
    },
  },
  {
    id: 23,
    title: 'Aquaman',
    gross: 1148485886,
    budget: 160000000,
    director: 'James Wan',
    company: 'Warner Bros. Pictures',
    year: 2018,
    imdbRating: 6.8,
    cinematicUniverse: 'DC Cinematic Universe',
    composer: {
      name: 'Rupert Gregson-Williams',
    },
  },
  {
    id: 24,
    title: 'The Lord of the Rings: The Return of the King',
    gross: 1146030912,
    budget: 94000000,
    director: 'Peter Jackson',
    company: 'New Line Cinema',
    year: 2003,
    imdbRating: 9.0,
    cinematicUniverse: 'The Lord of the Rings',
    composer: {
      name: 'Howard Shore',
    },
  },
  {
    id: 25,
    title: 'Spider-Man: Far From Home',
    gross: 1131927996,
    budget: 160000000,
    director: 'Jon Watts',
    company: 'Disney Studios',
    year: 2019,
    imdbRating: 7.4,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Michael Giacchino',
    },
  },
  {
    id: 26,
    title: 'Captain Marvel',
    gross: 1128274794,
    budget: 152000000,
    director: 'Anna Boden & Ryan Fleck',
    company: 'Disney Studios',
    year: 2019,
    imdbRating: 6.8,
    cinematicUniverse: 'Marvel Cinematic Universe',
    composer: {
      name: 'Pinar Toprak',
    },
  },
  {
    id: 27,
    title: 'Transformers: Dark of the Moon',
    gross: 1123794079,
    budget: 195000000,
    director: 'Michael Bay',
    company: 'Paramount Pictures',
    year: 2011,
    imdbRating: 6.2,
    cinematicUniverse: 'Transformers',
    composer: {
      name: 'Steve Jablonsky',
    },
  },
  {
    id: 28,
    title: 'Skyfall',
    gross: 1108561013,
    budget: 200000000,
    director: 'Sam Mendes',
    company: '20th Century Fox',
    year: 2012,
    imdbRating: 7.8,
    cinematicUniverse: 'James Bond',
    composer: {
      name: 'Thomas Newman',
    },
  },
  {
    id: 29,
    title: 'Transformers: Age of Extinction',
    gross: 1104054072,
    budget: 210000000,
    director: 'Michael Bay',
    company: 'Paramount Pictures',
    year: 2014,
    imdbRating: 5.6,
    cinematicUniverse: 'Transformers',
    composer: {
      name: 'Steve Jablonsky',
    },
  },
  {
    id: 30,
    title: 'The Dark Knight Rises',
    gross: 1081142612,
    budget: 250000000,
    director: 'Christopher Nolan',
    company: 'Warner Bros. Pictures',
    year: 2012,
    imdbRating: 8.4,
    cinematicUniverse: 'Batman',
    composer: {
      name: 'Hans Zimmer',
    },
  },
  {
    id: 31,
    title: 'Joker',
    gross: 1074251311,
    budget: 55000000,
    director: 'Todd Phillips',
    company: 'Warner Bros. Pictures',
    year: 2019,
    imdbRating: 8.4,
    cinematicUniverse: 'Batman',
    composer: {
      name: 'Hildur Guðnadóttir',
    },
  },
  {
    id: 32,
    title: 'Star Wars: The Rise of Skywalker',
    gross: 1074144248,
    budget: 275000000,
    director: 'J. J. Abrams',
    company: 'Disney Studios',
    year: 2019,
    imdbRating: 6.5,
    cinematicUniverse: 'Star Wars',
    composer: {
      name: 'John Williams',
    },
  },
  {
    id: 33,
    title: 'Toy Story 4',
    gross: 1073394593,
    budget: 200000000,
    director: 'Josh Cooley',
    company: 'Disney Studios',
    year: 2019,
    imdbRating: 7.7,
    cinematicUniverse: 'Toy Story',
    composer: {
      name: 'Randy Newman',
    },
  },
  {
    id: 34,
    title: 'Toy Story 3',
    gross: 1066969703,
    budget: 200000000,
    director: 'Lee Unkrich',
    company: 'Disney Studios',
    year: 2010,
    imdbRating: 8.3,
    cinematicUniverse: 'Toy Story',
    composer: {
      name: 'Randy Newman',
    },
  },
];

export const getMovieColumns = (): GridColDef[] => COLUMNS;
export const getMovieRows = (): GridRowModel<Movie>[] => ROWS;

export const useMovieData = () => {
  return {
    rows: ROWS,
    columns: COLUMNS,
  };
};

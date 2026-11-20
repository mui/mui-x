// Iconic TV Series Timeline Dataset
// Completed TV series grouped by network, spanning 1972 (M*A*S*H) to 2025 (Stranger Things)
// Resources are the TV networks, events are individual shows from premiere to finale

import type { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

export const defaultVisibleDate = new Date('2005-01-01T00:00:00');

export const resources: SchedulerResource[] = [
  { title: 'NBC', id: 'nbc', eventColor: 'blue' },
  { title: 'CBS', id: 'cbs', eventColor: 'teal' },
  { title: 'ABC', id: 'abc', eventColor: 'orange' },
  { title: 'FOX', id: 'fox', eventColor: 'red' },
  { title: 'HBO', id: 'hbo', eventColor: 'purple' },
  { title: 'AMC', id: 'amc', eventColor: 'green' },
  { title: 'FX', id: 'fx', eventColor: 'pink' },
  { title: 'Showtime', id: 'showtime', eventColor: 'indigo' },
  { title: 'Netflix', id: 'netflix', eventColor: 'lime' },
  { title: 'USA Network', id: 'usa', eventColor: 'amber' },
  { title: 'The CW', id: 'the-cw', eventColor: 'grey' },
  { title: 'PBS', id: 'pbs', eventColor: 'blue' },
  { title: 'Amazon', id: 'amazon', eventColor: 'orange' },
  { title: 'TNT', id: 'tnt', eventColor: 'teal' },
  { title: 'Syfy', id: 'syfy', eventColor: 'green' },
  { title: 'History', id: 'history', eventColor: 'red' },
  { title: 'Comedy Central', id: 'comedy-central', eventColor: 'amber' },
  { title: 'Starz', id: 'starz', eventColor: 'purple' },
  { title: 'BBC America', id: 'bbc-america', eventColor: 'indigo' },
  { title: 'Adult Swim', id: 'adult-swim', eventColor: 'lime' },
  { title: 'Hulu', id: 'hulu', eventColor: 'grey' },
];

export const initialEvents: SchedulerEvent[] = [
  // ============================================
  // NBC
  // ============================================
  {
    id: 'nbc-cheers',
    start: '1982-09-30',
    end: '1993-05-21',
    title: 'Cheers',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-seinfeld',
    start: '1989-07-05',
    end: '1998-05-15',
    title: 'Seinfeld',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-frasier',
    start: '1993-09-16',
    end: '2004-05-14',
    title: 'Frasier',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-friends',
    start: '1994-09-22',
    end: '2004-05-07',
    title: 'Friends',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-er',
    start: '1994-09-19',
    end: '2009-04-03',
    title: 'ER',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-west-wing',
    start: '1999-09-22',
    end: '2006-05-15',
    title: 'The West Wing',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-the-office',
    start: '2005-03-24',
    end: '2013-05-17',
    title: 'The Office',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-30-rock',
    start: '2006-10-11',
    end: '2013-02-01',
    title: '30 Rock',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-parks-and-rec',
    start: '2009-04-09',
    end: '2015-02-25',
    title: 'Parks and Recreation',
    resource: 'nbc',
    allDay: true,
  },
  // ============================================
  // CBS
  // ============================================
  {
    id: 'cbs-mash',
    start: '1972-09-17',
    end: '1983-03-01',
    title: 'M*A*S*H',
    resource: 'cbs',
    allDay: true,
  },
  {
    id: 'cbs-everybody-loves-raymond',
    start: '1996-09-13',
    end: '2005-05-17',
    title: 'Everybody Loves Raymond',
    resource: 'cbs',
    allDay: true,
  },
  {
    id: 'cbs-csi',
    start: '2000-10-06',
    end: '2015-09-28',
    title: 'CSI: Crime Scene Investigation',
    resource: 'cbs',
    allDay: true,
  },
  {
    id: 'cbs-himym',
    start: '2005-09-19',
    end: '2014-04-01',
    title: 'How I Met Your Mother',
    resource: 'cbs',
    allDay: true,
  },
  {
    id: 'cbs-criminal-minds',
    start: '2005-09-22',
    end: '2020-02-20',
    title: 'Criminal Minds',
    resource: 'cbs',
    allDay: true,
  },
  // ============================================
  // ABC
  // ============================================
  {
    id: 'abc-lost',
    start: '2004-09-22',
    end: '2010-05-24',
    title: 'Lost',
    resource: 'abc',
    allDay: true,
  },
  {
    id: 'abc-desperate-housewives',
    start: '2004-10-03',
    end: '2012-05-14',
    title: 'Desperate Housewives',
    resource: 'abc',
    allDay: true,
  },
  {
    id: 'abc-modern-family',
    start: '2009-09-23',
    end: '2020-04-09',
    title: 'Modern Family',
    resource: 'abc',
    allDay: true,
  },
  {
    id: 'abc-scandal',
    start: '2012-04-05',
    end: '2018-04-20',
    title: 'Scandal',
    resource: 'abc',
    allDay: true,
  },
  // ============================================
  // FOX
  // ============================================
  {
    id: 'fox-x-files',
    start: '1993-09-10',
    end: '2002-05-20',
    title: 'The X-Files',
    resource: 'fox',
    allDay: true,
  },
  {
    id: 'fox-that-70s-show',
    start: '1998-08-23',
    end: '2006-05-19',
    title: "That '70s Show",
    resource: 'fox',
    allDay: true,
  },
  {
    id: 'fox-24',
    start: '2001-11-06',
    end: '2010-05-25',
    title: '24',
    resource: 'fox',
    allDay: true,
  },
  {
    id: 'fox-house',
    start: '2004-11-16',
    end: '2012-05-22',
    title: 'House',
    resource: 'fox',
    allDay: true,
  },
  {
    id: 'fox-bones',
    start: '2005-09-13',
    end: '2017-03-29',
    title: 'Bones',
    resource: 'fox',
    allDay: true,
  },
  // ============================================
  // HBO
  // ============================================
  {
    id: 'hbo-oz',
    start: '1997-07-12',
    end: '2003-02-24',
    title: 'Oz',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-sex-and-the-city',
    start: '1998-06-06',
    end: '2004-02-23',
    title: 'Sex and the City',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-sopranos',
    start: '1999-01-10',
    end: '2007-06-11',
    title: 'The Sopranos',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-six-feet-under',
    start: '2001-06-03',
    end: '2005-08-22',
    title: 'Six Feet Under',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-the-wire',
    start: '2002-06-02',
    end: '2008-03-10',
    title: 'The Wire',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-true-blood',
    start: '2008-09-07',
    end: '2014-08-25',
    title: 'True Blood',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-boardwalk-empire',
    start: '2010-09-19',
    end: '2014-10-27',
    title: 'Boardwalk Empire',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-game-of-thrones',
    start: '2011-04-17',
    end: '2019-05-20',
    title: 'Game of Thrones',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-succession',
    start: '2018-06-03',
    end: '2023-05-29',
    title: 'Succession',
    resource: 'hbo',
    allDay: true,
  },
  // ============================================
  // AMC
  // ============================================
  {
    id: 'amc-mad-men',
    start: '2007-07-19',
    end: '2015-05-18',
    title: 'Mad Men',
    resource: 'amc',
    allDay: true,
  },
  {
    id: 'amc-breaking-bad',
    start: '2008-01-20',
    end: '2013-09-30',
    title: 'Breaking Bad',
    resource: 'amc',
    allDay: true,
  },
  {
    id: 'amc-walking-dead',
    start: '2010-10-31',
    end: '2022-11-21',
    title: 'The Walking Dead',
    resource: 'amc',
    allDay: true,
  },
  // ============================================
  // FX
  // ============================================
  {
    id: 'fx-the-shield',
    start: '2002-03-12',
    end: '2008-11-26',
    title: 'The Shield',
    resource: 'fx',
    allDay: true,
  },
  {
    id: 'fx-nip-tuck',
    start: '2003-07-22',
    end: '2010-03-04',
    title: 'Nip/Tuck',
    resource: 'fx',
    allDay: true,
  },
  {
    id: 'fx-sons-of-anarchy',
    start: '2008-09-03',
    end: '2014-12-10',
    title: 'Sons of Anarchy',
    resource: 'fx',
    allDay: true,
  },
  {
    id: 'fx-justified',
    start: '2010-03-16',
    end: '2015-04-15',
    title: 'Justified',
    resource: 'fx',
    allDay: true,
  },
  {
    id: 'fx-the-americans',
    start: '2013-01-30',
    end: '2018-05-31',
    title: 'The Americans',
    resource: 'fx',
    allDay: true,
  },
  // ============================================
  // Showtime
  // ============================================
  {
    id: 'showtime-weeds',
    start: '2005-08-07',
    end: '2012-09-17',
    title: 'Weeds',
    resource: 'showtime',
    allDay: true,
  },
  {
    id: 'showtime-dexter',
    start: '2006-10-01',
    end: '2013-09-23',
    title: 'Dexter',
    resource: 'showtime',
    allDay: true,
  },
  {
    id: 'showtime-homeland',
    start: '2011-10-02',
    end: '2020-04-27',
    title: 'Homeland',
    resource: 'showtime',
    allDay: true,
  },
  // ============================================
  // Netflix
  // ============================================
  {
    id: 'netflix-house-of-cards',
    start: '2013-02-01',
    end: '2018-11-03',
    title: 'House of Cards',
    resource: 'netflix',
    allDay: true,
  },
  {
    id: 'netflix-oitnb',
    start: '2013-07-11',
    end: '2019-07-27',
    title: 'Orange Is the New Black',
    resource: 'netflix',
    allDay: true,
  },
  {
    id: 'netflix-stranger-things',
    start: '2016-07-15',
    end: '2026-01-01',
    title: 'Stranger Things',
    resource: 'netflix',
    allDay: true,
  },
  // ============================================
  // USA Network
  // ============================================
  {
    id: 'usa-psych',
    start: '2006-07-07',
    end: '2014-03-27',
    title: 'Psych',
    resource: 'usa',
    allDay: true,
  },
  {
    id: 'usa-burn-notice',
    start: '2007-06-28',
    end: '2013-09-13',
    title: 'Burn Notice',
    resource: 'usa',
    allDay: true,
  },
  {
    id: 'usa-white-collar',
    start: '2009-10-23',
    end: '2014-12-19',
    title: 'White Collar',
    resource: 'usa',
    allDay: true,
  },
  {
    id: 'usa-suits',
    start: '2011-06-23',
    end: '2019-09-26',
    title: 'Suits',
    resource: 'usa',
    allDay: true,
  },
  {
    id: 'usa-mr-robot',
    start: '2015-06-24',
    end: '2019-12-23',
    title: 'Mr. Robot',
    resource: 'usa',
    allDay: true,
  },
  // ============================================
  // The CW
  // ============================================
  {
    id: 'cw-smallville',
    start: '2001-10-16',
    end: '2011-05-14',
    title: 'Smallville',
    resource: 'the-cw',
    allDay: true,
  },
  {
    id: 'cw-supernatural',
    start: '2005-09-13',
    end: '2020-11-20',
    title: 'Supernatural',
    resource: 'the-cw',
    allDay: true,
  },
  {
    id: 'cw-arrow',
    start: '2012-10-10',
    end: '2020-01-29',
    title: 'Arrow',
    resource: 'the-cw',
    allDay: true,
  },
  // ============================================
  // PBS
  // ============================================
  {
    id: 'pbs-downton-abbey',
    start: '2011-01-09',
    end: '2016-03-07',
    title: 'Downton Abbey',
    resource: 'pbs',
    allDay: true,
  },
  // ============================================
  // Amazon
  // ============================================
  {
    id: 'amazon-bosch',
    start: '2014-02-06',
    end: '2021-06-26',
    title: 'Bosch',
    resource: 'amazon',
    allDay: true,
  },
  {
    id: 'amazon-man-high-castle',
    start: '2015-01-15',
    end: '2019-11-16',
    title: 'The Man in the High Castle',
    resource: 'amazon',
    allDay: true,
  },
  {
    id: 'amazon-fleabag',
    start: '2016-07-21',
    end: '2019-04-09',
    title: 'Fleabag',
    resource: 'amazon',
    allDay: true,
  },
  // ============================================
  // TNT
  // ============================================
  {
    id: 'tnt-the-closer',
    start: '2005-06-13',
    end: '2012-08-14',
    title: 'The Closer',
    resource: 'tnt',
    allDay: true,
  },
  // ============================================
  // Syfy
  // ============================================
  {
    id: 'syfy-battlestar-galactica',
    start: '2004-10-18',
    end: '2009-03-21',
    title: 'Battlestar Galactica',
    resource: 'syfy',
    allDay: true,
  },
  // ============================================
  // History
  // ============================================
  {
    id: 'history-vikings',
    start: '2013-03-03',
    end: '2020-12-31',
    title: 'Vikings',
    resource: 'history',
    allDay: true,
  },
  // ============================================
  // Comedy Central
  // ============================================
  {
    id: 'cc-chappelles-show',
    start: '2003-01-22',
    end: '2006-07-10',
    title: "Chappelle's Show",
    resource: 'comedy-central',
    allDay: true,
  },
  {
    id: 'cc-key-and-peele',
    start: '2012-01-31',
    end: '2015-09-10',
    title: 'Key & Peele',
    resource: 'comedy-central',
    allDay: true,
  },
  // ============================================
  // Starz
  // ============================================
  {
    id: 'starz-spartacus',
    start: '2010-01-22',
    end: '2013-04-13',
    title: 'Spartacus',
    resource: 'starz',
    allDay: true,
  },
  {
    id: 'starz-power',
    start: '2014-06-07',
    end: '2020-02-10',
    title: 'Power',
    resource: 'starz',
    allDay: true,
  },
  // ============================================
  // BBC America
  // ============================================
  {
    id: 'bbca-killing-eve',
    start: '2018-04-08',
    end: '2022-04-11',
    title: 'Killing Eve',
    resource: 'bbc-america',
    allDay: true,
  },
  // ============================================
  // Adult Swim
  // ============================================
  {
    id: 'as-venture-bros',
    start: '2004-08-07',
    end: '2018-10-08',
    title: 'The Venture Bros.',
    resource: 'adult-swim',
    allDay: true,
  },
  // ============================================
  // Hulu
  // ============================================
  {
    id: 'hulu-handmaids-tale',
    start: '2017-04-26',
    end: '2025-05-28',
    title: "The Handmaid's Tale",
    resource: 'hulu',
    allDay: true,
  },
];

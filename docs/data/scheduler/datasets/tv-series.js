// Iconic TV Series Timeline Dataset
// Completed TV series grouped by network, spanning 1972 (M*A*S*H) to 2025 (Stranger Things)
// Resources are the TV networks, events are individual shows from premiere to finale

export const defaultVisibleDate = new Date('2005-01-01T00:00:00');

export const resources = [
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

export const initialEvents = [
  // ============================================
  // NBC
  // ============================================
  {
    id: 'nbc-cheers',
    start: '1982-09-30T00:00:00',
    end: '1993-05-20T00:00:00',
    title: 'Cheers',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-seinfeld',
    start: '1989-07-05T00:00:00',
    end: '1998-05-14T00:00:00',
    title: 'Seinfeld',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-frasier',
    start: '1993-09-16T00:00:00',
    end: '2004-05-13T00:00:00',
    title: 'Frasier',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-friends',
    start: '1994-09-22T00:00:00',
    end: '2004-05-06T00:00:00',
    title: 'Friends',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-er',
    start: '1994-09-19T00:00:00',
    end: '2009-04-02T00:00:00',
    title: 'ER',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-west-wing',
    start: '1999-09-22T00:00:00',
    end: '2006-05-14T00:00:00',
    title: 'The West Wing',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-the-office',
    start: '2005-03-24T00:00:00',
    end: '2013-05-16T00:00:00',
    title: 'The Office',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-30-rock',
    start: '2006-10-11T00:00:00',
    end: '2013-01-31T00:00:00',
    title: '30 Rock',
    resource: 'nbc',
    allDay: true,
  },
  {
    id: 'nbc-parks-and-rec',
    start: '2009-04-09T00:00:00',
    end: '2015-02-24T00:00:00',
    title: 'Parks and Recreation',
    resource: 'nbc',
    allDay: true,
  },
  // ============================================
  // CBS
  // ============================================
  {
    id: 'cbs-mash',
    start: '1972-09-17T00:00:00',
    end: '1983-02-28T00:00:00',
    title: 'M*A*S*H',
    resource: 'cbs',
    allDay: true,
  },
  {
    id: 'cbs-everybody-loves-raymond',
    start: '1996-09-13T00:00:00',
    end: '2005-05-16T00:00:00',
    title: 'Everybody Loves Raymond',
    resource: 'cbs',
    allDay: true,
  },
  {
    id: 'cbs-csi',
    start: '2000-10-06T00:00:00',
    end: '2015-09-27T00:00:00',
    title: 'CSI: Crime Scene Investigation',
    resource: 'cbs',
    allDay: true,
  },
  {
    id: 'cbs-himym',
    start: '2005-09-19T00:00:00',
    end: '2014-03-31T00:00:00',
    title: 'How I Met Your Mother',
    resource: 'cbs',
    allDay: true,
  },
  {
    id: 'cbs-criminal-minds',
    start: '2005-09-22T00:00:00',
    end: '2020-02-19T00:00:00',
    title: 'Criminal Minds',
    resource: 'cbs',
    allDay: true,
  },
  // ============================================
  // ABC
  // ============================================
  {
    id: 'abc-lost',
    start: '2004-09-22T00:00:00',
    end: '2010-05-23T00:00:00',
    title: 'Lost',
    resource: 'abc',
    allDay: true,
  },
  {
    id: 'abc-desperate-housewives',
    start: '2004-10-03T00:00:00',
    end: '2012-05-13T00:00:00',
    title: 'Desperate Housewives',
    resource: 'abc',
    allDay: true,
  },
  {
    id: 'abc-modern-family',
    start: '2009-09-23T00:00:00',
    end: '2020-04-08T00:00:00',
    title: 'Modern Family',
    resource: 'abc',
    allDay: true,
  },
  {
    id: 'abc-scandal',
    start: '2012-04-05T00:00:00',
    end: '2018-04-19T00:00:00',
    title: 'Scandal',
    resource: 'abc',
    allDay: true,
  },
  // ============================================
  // FOX
  // ============================================
  {
    id: 'fox-x-files',
    start: '1993-09-10T00:00:00',
    end: '2002-05-19T00:00:00',
    title: 'The X-Files',
    resource: 'fox',
    allDay: true,
  },
  {
    id: 'fox-that-70s-show',
    start: '1998-08-23T00:00:00',
    end: '2006-05-18T00:00:00',
    title: "That '70s Show",
    resource: 'fox',
    allDay: true,
  },
  {
    id: 'fox-24',
    start: '2001-11-06T00:00:00',
    end: '2010-05-24T00:00:00',
    title: '24',
    resource: 'fox',
    allDay: true,
  },
  {
    id: 'fox-house',
    start: '2004-11-16T00:00:00',
    end: '2012-05-21T00:00:00',
    title: 'House',
    resource: 'fox',
    allDay: true,
  },
  {
    id: 'fox-bones',
    start: '2005-09-13T00:00:00',
    end: '2017-03-28T00:00:00',
    title: 'Bones',
    resource: 'fox',
    allDay: true,
  },
  // ============================================
  // HBO
  // ============================================
  {
    id: 'hbo-oz',
    start: '1997-07-12T00:00:00',
    end: '2003-02-23T00:00:00',
    title: 'Oz',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-sex-and-the-city',
    start: '1998-06-06T00:00:00',
    end: '2004-02-22T00:00:00',
    title: 'Sex and the City',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-sopranos',
    start: '1999-01-10T00:00:00',
    end: '2007-06-10T00:00:00',
    title: 'The Sopranos',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-six-feet-under',
    start: '2001-06-03T00:00:00',
    end: '2005-08-21T00:00:00',
    title: 'Six Feet Under',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-the-wire',
    start: '2002-06-02T00:00:00',
    end: '2008-03-09T00:00:00',
    title: 'The Wire',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-true-blood',
    start: '2008-09-07T00:00:00',
    end: '2014-08-24T00:00:00',
    title: 'True Blood',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-boardwalk-empire',
    start: '2010-09-19T00:00:00',
    end: '2014-10-26T00:00:00',
    title: 'Boardwalk Empire',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-game-of-thrones',
    start: '2011-04-17T00:00:00',
    end: '2019-05-19T00:00:00',
    title: 'Game of Thrones',
    resource: 'hbo',
    allDay: true,
  },
  {
    id: 'hbo-succession',
    start: '2018-06-03T00:00:00',
    end: '2023-05-28T00:00:00',
    title: 'Succession',
    resource: 'hbo',
    allDay: true,
  },
  // ============================================
  // AMC
  // ============================================
  {
    id: 'amc-mad-men',
    start: '2007-07-19T00:00:00',
    end: '2015-05-17T00:00:00',
    title: 'Mad Men',
    resource: 'amc',
    allDay: true,
  },
  {
    id: 'amc-breaking-bad',
    start: '2008-01-20T00:00:00',
    end: '2013-09-29T00:00:00',
    title: 'Breaking Bad',
    resource: 'amc',
    allDay: true,
  },
  {
    id: 'amc-walking-dead',
    start: '2010-10-31T00:00:00',
    end: '2022-11-20T00:00:00',
    title: 'The Walking Dead',
    resource: 'amc',
    allDay: true,
  },
  // ============================================
  // FX
  // ============================================
  {
    id: 'fx-the-shield',
    start: '2002-03-12T00:00:00',
    end: '2008-11-25T00:00:00',
    title: 'The Shield',
    resource: 'fx',
    allDay: true,
  },
  {
    id: 'fx-nip-tuck',
    start: '2003-07-22T00:00:00',
    end: '2010-03-03T00:00:00',
    title: 'Nip/Tuck',
    resource: 'fx',
    allDay: true,
  },
  {
    id: 'fx-sons-of-anarchy',
    start: '2008-09-03T00:00:00',
    end: '2014-12-09T00:00:00',
    title: 'Sons of Anarchy',
    resource: 'fx',
    allDay: true,
  },
  {
    id: 'fx-justified',
    start: '2010-03-16T00:00:00',
    end: '2015-04-14T00:00:00',
    title: 'Justified',
    resource: 'fx',
    allDay: true,
  },
  {
    id: 'fx-the-americans',
    start: '2013-01-30T00:00:00',
    end: '2018-05-30T00:00:00',
    title: 'The Americans',
    resource: 'fx',
    allDay: true,
  },
  // ============================================
  // Showtime
  // ============================================
  {
    id: 'showtime-weeds',
    start: '2005-08-07T00:00:00',
    end: '2012-09-16T00:00:00',
    title: 'Weeds',
    resource: 'showtime',
    allDay: true,
  },
  {
    id: 'showtime-dexter',
    start: '2006-10-01T00:00:00',
    end: '2013-09-22T00:00:00',
    title: 'Dexter',
    resource: 'showtime',
    allDay: true,
  },
  {
    id: 'showtime-homeland',
    start: '2011-10-02T00:00:00',
    end: '2020-04-26T00:00:00',
    title: 'Homeland',
    resource: 'showtime',
    allDay: true,
  },
  // ============================================
  // Netflix
  // ============================================
  {
    id: 'netflix-house-of-cards',
    start: '2013-02-01T00:00:00',
    end: '2018-11-02T00:00:00',
    title: 'House of Cards',
    resource: 'netflix',
    allDay: true,
  },
  {
    id: 'netflix-oitnb',
    start: '2013-07-11T00:00:00',
    end: '2019-07-26T00:00:00',
    title: 'Orange Is the New Black',
    resource: 'netflix',
    allDay: true,
  },
  {
    id: 'netflix-stranger-things',
    start: '2016-07-15T00:00:00',
    end: '2025-12-31T00:00:00',
    title: 'Stranger Things',
    resource: 'netflix',
    allDay: true,
  },
  // ============================================
  // USA Network
  // ============================================
  {
    id: 'usa-psych',
    start: '2006-07-07T00:00:00',
    end: '2014-03-26T00:00:00',
    title: 'Psych',
    resource: 'usa',
    allDay: true,
  },
  {
    id: 'usa-burn-notice',
    start: '2007-06-28T00:00:00',
    end: '2013-09-12T00:00:00',
    title: 'Burn Notice',
    resource: 'usa',
    allDay: true,
  },
  {
    id: 'usa-white-collar',
    start: '2009-10-23T00:00:00',
    end: '2014-12-18T00:00:00',
    title: 'White Collar',
    resource: 'usa',
    allDay: true,
  },
  {
    id: 'usa-suits',
    start: '2011-06-23T00:00:00',
    end: '2019-09-25T00:00:00',
    title: 'Suits',
    resource: 'usa',
    allDay: true,
  },
  {
    id: 'usa-mr-robot',
    start: '2015-06-24T00:00:00',
    end: '2019-12-22T00:00:00',
    title: 'Mr. Robot',
    resource: 'usa',
    allDay: true,
  },
  // ============================================
  // The CW
  // ============================================
  {
    id: 'cw-smallville',
    start: '2001-10-16T00:00:00',
    end: '2011-05-13T00:00:00',
    title: 'Smallville',
    resource: 'the-cw',
    allDay: true,
  },
  {
    id: 'cw-supernatural',
    start: '2005-09-13T00:00:00',
    end: '2020-11-19T00:00:00',
    title: 'Supernatural',
    resource: 'the-cw',
    allDay: true,
  },
  {
    id: 'cw-arrow',
    start: '2012-10-10T00:00:00',
    end: '2020-01-28T00:00:00',
    title: 'Arrow',
    resource: 'the-cw',
    allDay: true,
  },
  // ============================================
  // PBS
  // ============================================
  {
    id: 'pbs-downton-abbey',
    start: '2011-01-09T00:00:00',
    end: '2016-03-06T00:00:00',
    title: 'Downton Abbey',
    resource: 'pbs',
    allDay: true,
  },
  // ============================================
  // Amazon
  // ============================================
  {
    id: 'amazon-bosch',
    start: '2014-02-06T00:00:00',
    end: '2021-06-25T00:00:00',
    title: 'Bosch',
    resource: 'amazon',
    allDay: true,
  },
  {
    id: 'amazon-man-high-castle',
    start: '2015-01-15T00:00:00',
    end: '2019-11-15T00:00:00',
    title: 'The Man in the High Castle',
    resource: 'amazon',
    allDay: true,
  },
  {
    id: 'amazon-fleabag',
    start: '2016-07-21T00:00:00',
    end: '2019-04-08T00:00:00',
    title: 'Fleabag',
    resource: 'amazon',
    allDay: true,
  },
  // ============================================
  // TNT
  // ============================================
  {
    id: 'tnt-the-closer',
    start: '2005-06-13T00:00:00',
    end: '2012-08-13T00:00:00',
    title: 'The Closer',
    resource: 'tnt',
    allDay: true,
  },
  // ============================================
  // Syfy
  // ============================================
  {
    id: 'syfy-battlestar-galactica',
    start: '2004-10-18T00:00:00',
    end: '2009-03-20T00:00:00',
    title: 'Battlestar Galactica',
    resource: 'syfy',
    allDay: true,
  },
  // ============================================
  // History
  // ============================================
  {
    id: 'history-vikings',
    start: '2013-03-03T00:00:00',
    end: '2020-12-30T00:00:00',
    title: 'Vikings',
    resource: 'history',
    allDay: true,
  },
  // ============================================
  // Comedy Central
  // ============================================
  {
    id: 'cc-chappelles-show',
    start: '2003-01-22T00:00:00',
    end: '2006-07-09T00:00:00',
    title: "Chappelle's Show",
    resource: 'comedy-central',
    allDay: true,
  },
  {
    id: 'cc-key-and-peele',
    start: '2012-01-31T00:00:00',
    end: '2015-09-09T00:00:00',
    title: 'Key & Peele',
    resource: 'comedy-central',
    allDay: true,
  },
  // ============================================
  // Starz
  // ============================================
  {
    id: 'starz-spartacus',
    start: '2010-01-22T00:00:00',
    end: '2013-04-12T00:00:00',
    title: 'Spartacus',
    resource: 'starz',
    allDay: true,
  },
  {
    id: 'starz-power',
    start: '2014-06-07T00:00:00',
    end: '2020-02-09T00:00:00',
    title: 'Power',
    resource: 'starz',
    allDay: true,
  },
  // ============================================
  // BBC America
  // ============================================
  {
    id: 'bbca-killing-eve',
    start: '2018-04-08T00:00:00',
    end: '2022-04-10T00:00:00',
    title: 'Killing Eve',
    resource: 'bbc-america',
    allDay: true,
  },
  // ============================================
  // Adult Swim
  // ============================================
  {
    id: 'as-venture-bros',
    start: '2004-08-07T00:00:00',
    end: '2018-10-07T00:00:00',
    title: 'The Venture Bros.',
    resource: 'adult-swim',
    allDay: true,
  },
  // ============================================
  // Hulu
  // ============================================
  {
    id: 'hulu-handmaids-tale',
    start: '2017-04-26T00:00:00',
    end: '2025-05-27T00:00:00',
    title: "The Handmaid's Tale",
    resource: 'hulu',
    allDay: true,
  },
];

// Self-reported trust in others (0-10 scale), ages 16-19.
// Representative values inspired by Eurostat data, ordered as in
// "The European Correspondent" visualization. Central and Eastern
// European youth became more trustful, their Western peers less so.
export const europeanYouthTrust = [
  { country: 'Croatia', trust2024: 7.6, trust2013: 6.8 },
  { country: 'Romania', trust2024: 7.4, trust2013: 6.5 },
  { country: 'Poland', trust2024: 7.0, trust2013: 6.0 },
  { country: 'Slovakia', trust2024: 6.8, trust2013: 6.2 },
  { country: 'Ireland', trust2024: 6.6, trust2013: 6.4 },
  { country: 'Italy', trust2024: 6.5, trust2013: 6.0 },
  { country: 'Latvia', trust2024: 6.4, trust2013: 5.8 },
  { country: 'Belgium', trust2024: 6.3, trust2013: 6.5 },
  { country: 'Serbia', trust2024: 6.2, trust2013: 5.5 },
  { country: 'Spain', trust2024: 6.4, trust2013: 6.2 },
  { country: 'Finland', trust2024: 7.2, trust2013: 7.6 },
  { country: 'Luxembourg', trust2024: 6.2, trust2013: 6.6 },
  { country: 'Netherlands', trust2024: 7.0, trust2013: 7.4 },
  { country: 'Bulgaria', trust2024: 6.0, trust2013: 5.2 },
  { country: 'Czechia', trust2024: 6.3, trust2013: 5.6 },
  { country: 'Greece', trust2024: 5.8, trust2013: 5.2 },
  { country: 'Germany', trust2024: 6.4, trust2013: 6.6 },
  { country: 'Estonia', trust2024: 6.2, trust2013: 5.7 },
  { country: 'Switzerland', trust2024: 7.0, trust2013: 7.3 },
  { country: 'Hungary', trust2024: 5.9, trust2013: 5.3 },
  { country: 'Portugal', trust2024: 6.0, trust2013: 5.6 },
  { country: 'Norway', trust2024: 7.3, trust2013: 7.6 },
  { country: 'Austria', trust2024: 6.5, trust2013: 6.8 },
  { country: 'Denmark', trust2024: 7.5, trust2013: 8.0 },
  { country: 'Lithuania', trust2024: 6.0, trust2013: 5.4 },
  { country: 'Malta', trust2024: 6.1, trust2013: 6.4 },
  { country: 'Sweden', trust2024: 7.0, trust2013: 7.5 },
  { country: 'Slovenia', trust2024: 6.2, trust2013: 6.5 },
  { country: 'Cyprus', trust2024: 5.5, trust2013: 5.9 },
  { country: 'Türkiye', trust2024: 5.0, trust2013: 5.6 },
  { country: 'France', trust2024: 5.6, trust2013: 6.2 },
];

export const euAverageTrust2024 =
  europeanYouthTrust.reduce((sum, d) => sum + d.trust2024, 0) /
  europeanYouthTrust.length;

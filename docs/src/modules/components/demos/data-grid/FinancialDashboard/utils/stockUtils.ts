export const logoNameMap: Record<string, string> = {
  MSFT: 'microsoft',
  GOOGL: 'alphabet',
  META: 'meta-platforms',
  NVDA: 'nvidia',
  TSLA: 'tesla',
  NFLX: 'netflix',
  CSCO: 'cisco',
  INTC: 'intel',
  ORCL: 'oracle',
  IBM: 'international-bus-mach',
  SAP: 'sap',
  AAPL: 'apple',
  AMZN: 'amazon',
  ELF: 'e-l-f-beauty',
  HPQ: 'hp',
  CRM: 'salesforce',
  BA: 'boeing',
  BBY: 'best-buy',
  VEEV: 'veeva-systems',
};

export const getLogoUrl = (symbol: string) => {
  const logoName = logoNameMap[symbol] || symbol.toLowerCase();
  return `https://s3-symbol-logo.tradingview.com/${logoName}--big.svg`;
};

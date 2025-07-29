export const colorMap: Record<string, string> = {
  Black: '#000000',
  White: '#FFFFFF',
  Red: '#FF0000',
  Blue: '#0000FF',
  Green: '#008000',
  Yellow: '#FFFF00',
  Purple: '#800080',
  Orange: '#FFA500',
  Pink: '#FFC0CB',
  Brown: '#A52A2A',
  Grey: '#808080',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
};

export const getColorValue = (colorName: string): string => {
  return colorMap[colorName] || '#E0E0E0';
};

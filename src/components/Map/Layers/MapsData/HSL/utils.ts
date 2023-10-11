export const getTypeColor = (
  type: 'BUS' | 'TRAM' | 'RAIL' | 'SUBWAY' | 'FERRY' | undefined,
) => {
  switch (type) {
    case 'BUS':
      return '#0074BF';
    case 'TRAM':
      return '#008151';
    case 'RAIL':
      return '#8C4799';
    case 'SUBWAY':
      return '#CA4000';
    case 'FERRY':
      return '#247c7b';
    default:
      return '#777';
  }
};

export const getStopUrl = (stopId: string, language: string) => {
  return `https://reittiopas.hsl.fi/pysakit/${stopId}?locale=${language}`;
};

export const getCityBikeStationUrl = (stationId: string, language: string) => {
  return `https://reittiopas.hsl.fi/pyoraasemat/${stationId}?locale=${language}`;
};

export const getRouteToStopUrl = (feature: any, language: string) => {
  // const start = `${startLabel}::${fromLat},${fromLng}`;
  const end = `${feature.properties.name || '-'}::${feature.coordinates[1]},${
    feature.coordinates[0]
  }`;
  const start = '-';
  return `https://reittiopas.hsl.fi/reitti/${start}/${end}?locale=${language}`;
};

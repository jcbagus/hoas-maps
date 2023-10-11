export type PopupInfoProps = {
  feature: any;
  coordinates: number[];
};

export interface DigiTransitStopFeatureProperties {
  code: string;
  desc?: string;
  gtfsId: string;
  name: string;
  parentStation: string;
  patterns: string;
  platform: string;
  type: 'BUS' | 'TRAM' | 'RAIL' | 'FERRY' | 'SUBWAY';
}

export interface DigiTransitCityBikeFeatureProperties {
  id: string;
  name: string;
  networks: string;
}

export interface DigiTransitStopPatterns {
  headsign: string;
  type: string;
  shortName: string;
}

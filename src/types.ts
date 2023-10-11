import { MapRef } from 'react-map-gl';

type GeoType = { type: string; coordinates: Array<any> };

export type PropertyType = {
  areas?: AreaType[];
  buildings?: BuildingType[];
  centroid: { type: string; coordinates: Array<any> };
  city: string;
  fid: number;
  geo: GeoType;
  id: number;
  name: string;
  nameEn: string;
  nameSv: string;
  region: string;
};

export type BuildingType = {
  address: string;
  fid: number;
  geo: GeoType;
  id: number;
  spaces: SpaceType[];
};

export type AreaType = {
  fid: number;
  geo: GeoType;
  id: number;
  name: string;
  nameEn: string;
  nameSv: string;
  category: CategoryType;
};

type FloorType = {
  id: string;
  floor: number;
  name: string;
};

export type SpaceType = {
  category: CategoryType;
  fid: number;
  floors: FloorType[];
  geo: GeoType;
  id: string;
  name: string;
  nameEn: string;
  nameSv: string;
};

export type CategoryType = {
  id: string;
  name: string;
  nameEn: string;
  nameSv: string;
  type: string;
};

export type MapsCategoryType = {
  checked: boolean;
  children: MapsCategoryType[];
  color: string;
  count: number;
  description: string;
  icon: boolean;
  id: number;
  name: string;
  name_en: string;
  name_sv: string;
  order: number;
  slug: string;
  type: string;
  upperLevel: { fi: string; sv: string; en: string };
};

export type POIType = {
  address: string;
  categories: string[];
  coordinates: { lat: number; lng: number };
  description: ' ';
  geoJson: string;
  image: string;
  link: string;
  link_en: string;
  link_sv: string;
  meta: {
    desc?: { S: string };
    gtfsId?: { S: string };
    locationType?: { S: string };
    routes?: { S: string };
    code?: { S: string };
    vehicleMode?: { S: string };
    description_en?: { S: string };
    description_sv?: { S: string };
    titleExtension_en?: { S: string };
    titleExtension_sv?: { S: string };
    name_en?: { S: string };
    name_sv?: { S: string };
  };
  name: string;
  slug: string;
  titleExtension: string;
};

export type MapsLineType = {
  name: string;
  titleExtension: string;
  slug: string;
  description: string;
  address: string;
  link: string;
  link_en: string;
  link_sv: string;
  image: string;
  geoJson: GeoJSON.Feature;
  categories: string[];
  coordinates: [];
  meta: {
    titleExtension_en: string;
    description_en: string;
    titleExtension_sv: string;
    description_sv: string;
    modeId: number;
    fid: string;
    line: {
      gtfsId: string;
      shortName: string;
      longName: string;
      mode: string;
    };
  };
};

export type MapsAreaType = {
  name: string;
  slug: string;
  description: string;
  geoJson: string;
  categories: string[];
  subCategories: string[];
  link: string;
  link_en: string;
  link_sv: string;
  meta: {
    name_en: string;
    name_sv: string;
    count: number;
    child: boolean;
    childCount: number;
    apartmentsCount: number;
    roomTypesCount: {
      solu: number;
      yksio: number;
      kaksio: number;
      kamppis: number;
      perhe: number;
      exchange: number;
    };
    city: { fi: string; sv: string; en: string };
    zip: string;
    district: { fi: string; sv: string; en: string };
    subDistrict: { fi: string; sv: string; en: string };
  };
};

export type AppStateType = {
  appLoading: boolean;
  mainMenuOpen: boolean;
  map: MapRef | null;
  categories: MapsCategoryType[];
  lines: any[];
  pois: POIType[];
  areas: MapsAreaType[];
  preSelectedProperty: PropertyType | null;
  selectedProperty: PropertyType | null;
  selectedBuilding: BuildingType | null;
};

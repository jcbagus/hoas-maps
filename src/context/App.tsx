import axios from 'axios';
import React, { createContext, useReducer, Dispatch, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  AppStateType,
  BuildingType,
  MapsCategoryType,
  PropertyType,
} from '../types';

type ContextProps = {
  state: AppStateType;
  preSelectProperty: Dispatch<any>;
  selectProperty: Dispatch<any>;
  selectBuilding: Dispatch<any>;
  fetchSettings: () => any;
  fetchMapData: () => any;
  fetchProperty: (id: number) => any;
  dispatch: React.Dispatch<any>;
};

const initialState: AppStateType = {
  categories: [],
  lines: [],
  areas: [],
  pois: [],
  selectedProperty: null,
  preSelectedProperty: null,
  selectedBuilding: null,
  appLoading: true,
  mainMenuOpen: false,
  map: null,
};

const mainReducer = (state: AppStateType, action: any): AppStateType => {
  switch (action.type) {
    case 'ADD_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    case 'ADD_POIS':
      return {
        ...state,
        pois: action.payload,
      };
    case 'ADD_AREAS':
      return {
        ...state,
        areas: action.payload,
      };
    case 'ADD_LINES':
      return {
        ...state,
        lines: action.payload,
      };
    case 'SELECT_PROPERTY':
      return {
        ...state,
        selectedProperty: action.payload || null,
      };
    case 'PRE_SELECT_PROPERTY':
      return {
        ...state,
        preSelectedProperty: action.payload || null,
      };
    case 'SELECT_BUILDING':
      return {
        ...state,
        selectedBuilding: action.payload || null,
      };
    case 'SET_APP_LOADING':
      return {
        ...state,
        appLoading: !!action.payload,
      };
    case 'SET_MAIN_MENU_OPEN':
      return {
        ...state,
        mainMenuOpen: !!action.payload,
      };
    case 'SET_MAP':
      return {
        ...state,
        map: action.payload,
      };
    default:
      return state;
  }
};

const AppContext = createContext<ContextProps>({
  state: initialState,
  preSelectProperty: (property: PropertyType) => property,
  selectProperty: (property: PropertyType) => property,
  selectBuilding: (building: BuildingType) => building,
  fetchSettings: () => null,
  fetchMapData: () => null,
  fetchProperty: (id: number) => null,
  dispatch: () => null,
});

export function AppProvider({ children }: any) {
  const [state, dispatch] = useReducer(mainReducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectDefaultFilters = (categories: MapsCategoryType[]) => {
    // select all 'default' categories if nothing already selected
    if (!searchParams.getAll('filters[]').length) {
      const defaults: Array<string> = [];
      categories.forEach((c) => {
        if (c.checked) {
          defaults.push(c.slug);
          c.children.forEach((child) => {
            defaults.push(child.slug);

            if (child.children.length) {
              child.children.forEach((subchild) => {
                defaults.push(subchild.slug);
              });
            }
          });
        }
      });

      const params: any = { 'filters[]': defaults };
      if (searchParams.has('selectedItem')) {
        params.selectedItem = searchParams.get('selectedItem');
      }

      if (searchParams.has('preSelectedItem')) {
        params.preSelectedItem = searchParams.get('preSelectedItem');
      }

      setSearchParams(params, { replace: false });
    }
  };

  // Actions for changing state
  const contextValue = React.useMemo(() => {
    const selectProperty = (property: PropertyType) => {
      dispatch({
        type: 'SELECT_PROPERTY',
        payload: property,
      });
    };

    const preSelectProperty = (property: PropertyType) => {
      dispatch({
        type: 'PRE_SELECT_PROPERTY',
        payload: property,
      });
    };

    const selectBuilding = (building: BuildingType) => {
      dispatch({
        type: 'SELECT_BUILDING',
        payload: building,
      });
    };

    const fetchSettings = async () => {
      dispatch({
        type: 'SET_APP_LOADING',
        payload: true,
      });

      return axios
        .get(`${process.env.REACT_APP_MAPS_API_URL}/settings`, {
          headers: {},
        })
        .then(({ data }: any) => {
          if (data) {
            data.forEach((v: any, key: any) => {
              if (v.categories) {
                const parsed = JSON.parse(v.categories);
                dispatch({
                  type: 'ADD_CATEGORIES',
                  payload: parsed,
                });

                selectDefaultFilters(parsed);
              }
            });
          }
        })
        .catch((e: any) => {
          console.log(e);
        })
        .finally(() => {
          dispatch({
            type: 'SET_APP_LOADING',
            payload: false,
          });
        });
    };

    const fetchMapData = async () => {
      dispatch({
        type: 'SET_APP_LOADING',
        payload: true,
      });

      return axios
        .all([
          axios.get(`${process.env.REACT_APP_MAPS_DATA_URL}/pois.json`),
          axios.get(`${process.env.REACT_APP_MAPS_DATA_URL}/lines.json`),
          axios.get(`${process.env.REACT_APP_MAPS_DATA_URL}/areas.json`),
        ])
        .then(
          axios.spread((poisRes: any, linesRes: any, areasRes: any) => {
            if (poisRes.data) {
              const pois = poisRes.data.map((poi: any) => {
                let { slug } = poi;
                if (poi.meta.code?.S) {
                  slug = `${poi.meta.code?.S}:${slug}`;
                }

                poi.slug = slug;
                return poi;
              });
              dispatch({ type: 'ADD_POIS', payload: pois });
            }
            if (linesRes.data) {
              dispatch({ type: 'ADD_LINES', payload: linesRes.data });
            }
            if (areasRes.data) {
              const areas = areasRes.data.map((a: any) => {
                const area = a;
                const geojson = JSON.parse(a.geoJson);
                area.subCategories =
                  geojson.properties?.childrenCategories || [];

                return area;
              });
              dispatch({ type: 'ADD_AREAS', payload: areas });
            }
          }),
        )
        .catch((e: any) => {
          console.log(e);
        })
        .finally(() => {
          dispatch({
            type: 'SET_APP_LOADING',
            payload: false,
          });
        });
    };

    const fetchProperty = async (id: number) => {
      return axios
        .get(`${process.env.REACT_APP_PROPERTIES_API_URL}/properties/${id}`, {
          headers: {},
        })
        .then(({ data }: any) => {
          if (data) {
            selectProperty(data);
          }

          return data;
        })
        .catch((e: any) => {
          console.log(e);
        });
    };

    return {
      state,
      fetchSettings,
      fetchMapData,
      fetchProperty,
      selectProperty,
      preSelectProperty,
      selectBuilding,
      dispatch,
    };
  }, [state]);

  useEffect(() => {
    contextValue.fetchSettings();
    contextValue.fetchMapData();
  }, []);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export default AppProvider;

export function useAppContext() {
  return React.useContext(AppContext);
}

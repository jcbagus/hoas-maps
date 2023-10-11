import React, { useEffect, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { useSearchParams } from 'react-router-dom';
import { LngLatBoundsLike } from 'mapbox-gl';
import {
  useColorModeValue,
  Icon,
  HStack,
  Text,
  Box,
  List,
  ListItem,
  Button,
  Image,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

import { useAppContext } from '../../../context/App';
import { useTranslation } from '../../../context/Translations';
import { MapsAreaType, POIType } from '../../../types';
import { CloseIcon, SearchIcon, HouseIcon, SchoolIcon } from '../../Icon';
import { getPolygonBounds } from '../../../utils';

const searchCategories = ['hoas-houses', 'residental-areas', 'schools'];

const options = {
  shouldSort: true,
  tokenize: true,
  includeMatches: true,
  matchAllTokens: false,
  threshold: 0.1,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    {
      name: 'description',
      weight: 0.125,
    },
    {
      name: 'meta.city.S',
      weight: 0.125,
    },
    {
      name: 'title',
      weight: 0.25,
    },
    {
      name: 'meta.schools.SS',
      weight: 0.25,
    },
    {
      name: 'name',
      weight: 0.25,
    },
    {
      name: 'children',
      weight: 0.25,
    },
  ],
};

type SearchItem = Fuse.FuseResult<POIType | MapsAreaType>;

function SearchResultItem({
  onClick,
  result,
}: {
  onClick: (searchItem: SearchItem) => void;
  result: SearchItem;
}) {
  const { translate } = useTranslation();
  const bg = useColorModeValue('white', 'black.200');
  const fontColor = useColorModeValue('black.200', 'white');
  let typeIcon = HouseIcon;
  let type = translate('asuinkohde-title');
  const title = result.item.name;
  if (result.item.categories.includes('residental-areas')) {
    typeIcon = '';
    type = translate('asuinalue-title');
  }
  const searchResultStyle = {
    borderBottom: '1px solid',
    borderColor: '#c7c7c7',
    borderRadius: 'none',
    bg: bg,
    color: fontColor,
    w: '100%',
    padding: '0.75rem 1.5rem',
  };

  if (result.item.categories.includes('schools')) {
    const matches = result.matches?.filter((m) => m.key === 'meta.schools.SS');
    if (!matches) {
      return null;
    }
    typeIcon = SchoolIcon;
    type = translate('koulu-title');
    return (
      <ListItem>
        {matches.map((m) => (
          <HStack key={m.value} role="menuitem" title={m.value}>
            <Button
              sx={searchResultStyle}
              variant="link"
              _hover={{ textDecoration: 'none' }}
              onClick={() =>
                onClick({
                  ...result,
                  item: { ...result.item, name: m.value || '' },
                })
              }
            >
              <HStack w="100%">
                <Text
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  align="left"
                  w="240px"
                >
                  {m.value}
                </Text>
                <Box w="20px">
                  <Image w="0.5rem" marginRight="0.5rem" src={typeIcon} />
                </Box>
                <Text className="type__name">{type}</Text>
              </HStack>
            </Button>
          </HStack>
        ))}
      </ListItem>
    );
  }

  return (
    <ListItem>
      <HStack
        role="menuitem"
        title={result.item.name}
        className="search__result-item"
      >
        <Button
          sx={searchResultStyle}
          variant="link"
          _hover={{ textDecoration: 'none' }}
          onClick={() => onClick(result)}
        >
          <HStack w="100%">
            <Text
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              align="left"
              w="240px"
              minW="240px"
            >
              {title}
            </Text>
            <Box w="20px">
              <Image w="0.5rem" marginRight="0.5rem" src={typeIcon} />
            </Box>
            <Text className="type__name">{type}</Text>
          </HStack>
        </Button>
      </HStack>
    </ListItem>
  );
}

function SearchResults({ itemOnClick, results, query }: any) {
  const { translate } = useTranslation();
  const bg = useColorModeValue('white', 'black.200');
  if (!query.length && !results.length) {
    return null;
  }

  const searchResultBoxStyle = {
    borderBottom: '1px',
    borderColor: '#c7c7c7',
    boxShadow: 'xl',
    marginTop: '4px',
    position: 'absolute',
    right: '0',
    zIndex: '2',
    maxH: '80vh',
    w: '100%',
    overflowY: 'auto',
    bg: bg,
  };

  if (query.length > 0 && !results.length) {
    return (
      <Box sx={searchResultBoxStyle}>
        <Box
          borderBottom="1px"
          borderColor="#d8d8d8"
          color="#959595"
          fontSize=".9em"
          padding=".75rem 1.5rem"
        >
          {translate('no-search-results')}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={searchResultBoxStyle}>
      <Text
        width="100%"
        borderBottom="1px"
        borderTop="1px"
        borderColor="#c7c7c7"
        padding=".75rem"
      >
        {translate('search-results-title')}
      </Text>
      <List maxH="80vh" overflow="scroll">
        {results.map((result: SearchItem) => (
          <SearchResultItem
            key={result.item.slug}
            onClick={itemOnClick}
            result={result}
          />
        ))}
      </List>
    </Box>
  );
}

function SearchInput({
  onSearch,
  query,
}: {
  onSearch: (q: string) => void;
  query: string;
}) {
  const { translate } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleSearch = (
    e: React.MouseEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    onSearch((e.target as HTMLInputElement).value);
  };

  const clearSearch = () => {
    onSearch('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  const bg = useColorModeValue('white', 'black.200');
  const searchButtonStyle = {
    position: 'absolute',
    padding: '0.8em',
    h: '100%',
    w: '3.5rem',
    right: '0rem',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '2px',
    bg: 'green.500',
  };
  return (
    <Box position="relative" className="search__input-wrap">
      <InputGroup h="56px">
        <Input
          bg={bg}
          ref={inputRef}
          id="search-input"
          onClick={(e) => handleSearch(e)}
          onChange={(e) => handleSearch(e)}
          value={query}
          placeholder={translate('search-placeholder')}
          border="1px"
          borderColor="#4B5D63"
          padding=".75rem 2.25rem .75rem .75rem"
          h="100%"
          _focusVisible={{ outline: 'none', boxShadow: '0 0 0 2px #008151' }}
        />
        <InputRightElement margin="0px" h="100%" width="4.5rem">
          {query.length === 0 ? (
            <Button sx={searchButtonStyle}>
              <Icon color="white" h="1.8rem" w="1.8rem" as={SearchIcon} />
            </Button>
          ) : (
            <Button onClick={clearSearch} sx={searchButtonStyle}>
              <Icon color="#fff" h="1.8rem" w="1.8rem" as={CloseIcon} />
            </Button>
          )}
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}

function Search() {
  const { state, dispatch } = useAppContext();
  const [results, setResults] = useState<Fuse.FuseResult<unknown>[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [resultsOpen, setResultsOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const list: any = React.useMemo(
    () =>
      state.pois
        .concat(state.areas as any)
        .filter(
          (p) => !!searchCategories.find((f) => p.categories.includes(f)),
        ),
    [state.pois, state.areas],
  );

  const onSearch = (q: string) => {
    setSearchQuery(q);
    if (q.length) {
      const fuse = new Fuse(list, options);
      const searchResults = fuse.search(q);
      setResults(searchResults);
    }
    setResultsOpen(q.length > 2);
  };

  useEffect(() => {
    function handleClickOutside(event: any): void {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        resultsOpen
      ) {
        setResultsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, resultsOpen]);

  const panToItem = async (result: SearchItem) => {
    return new Promise<void>((resolve) => {
      const feature: any = result.item;
      const geoJson = JSON.parse(feature.geoJson);
      if (feature.coordinates?.lat === 0 && feature.coordinates?.lng === 0) {
        // eslint-disable-next-line no-alert
        alert('Unavailable Coordinates');
      } else {
        const isArea =
          geoJson.geometry?.type.toLowerCase() === 'polygon' ||
          geoJson.geometry?.type.toLowerCase() === 'multipolygon';

        if (isArea) {
          const bounds = getPolygonBounds(geoJson.geometry);
          if (bounds) {
            state.map?.fitBounds(bounds as LngLatBoundsLike);
          }
        } else {
          state.map?.flyTo({ center: feature.coordinates, zoom: 14 });
        }

        state.map?.once('moveend', () => {
          resolve();
        });
      }
    });
  };

  const itemOnClick = async (result: SearchItem) => {
    setResultsOpen(false);
    // Close menu on mobile
    if (window.innerWidth <= 900) {
      dispatch({
        type: 'SET_MAIN_MENU_OPEN',
        payload: false,
      });
    }

    await panToItem(result);
    setSearchQuery(result.item.name);

    if (!result.item.categories.includes('residental-areas')) {
      // Set search params
      const params = new URLSearchParams(window.location.search);
      params.set('selectedItem', result.item.slug);

      result.item.categories.forEach((c) => {
        if (!params.has(c)) {
          params.append('filters[]', c);
        }
      });
      setSearchParams(params);
    }
  };

  return (
    <Box
      padding="1.2rem"
      position="relative"
      width="100%"
      borderBottom="1px"
      borderColor="#E0E0E0"
      ref={wrapperRef}
    >
      <SearchInput query={searchQuery} onSearch={onSearch} />
      {resultsOpen ? (
        <SearchResults
          itemOnClick={itemOnClick}
          results={results}
          query={searchQuery}
        />
      ) : null}
    </Box>
  );
}

export default Search;

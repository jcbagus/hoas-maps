import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-map-gl';
import {
  useColorMode,
  useColorModeValue,
  Button,
  chakra,
  IconButton,
} from '@chakra-ui/react';
import { useTranslation } from '../../context/Translations';

import { CloseIcon, LayersIcon } from '../Icon';
import RadioButton from '../RadioButton';

import './MapStyleSelect.scss';

type MapStyleItem = {
  url: string;
  title: string;
};

const MAPSTYLES: MapStyleItem[] = [
  {
    url: 'mapbox://styles/mapbox/dark-v9',
    title: 'mapstyle-dark',
  },
  {
    url: 'mapbox://styles/mapbox/light-v9',
    title: 'mapstyle-light',
  },
  {
    url: 'mapbox://styles/mapbox/satellite-v9',
    title: 'mapstyle-satellite',
  },
];

function MapStyleItem({
  mapstyle,
  onChange,
  current,
}: {
  mapstyle: MapStyleItem;
  onChange: (e: any) => void;
  current: string;
}) {
  const { translate } = useTranslation();
  return (
    <li className="mapstyle-select__item">
      <RadioButton
        onChange={onChange}
        id={mapstyle.url}
        value={mapstyle.url}
        name="layerStyle"
        label={translate(mapstyle.title)}
        checked={
          current === mapstyle.url ||
          (!current && mapstyle.url === MAPSTYLES[1].url)
        }
      />
    </li>
  );
}

function MapStyleSelect() {
  const [showList, setShowList] = useState<boolean>(false);
  const [currentStyle, setCurrentStyle] = useState<string>(
    localStorage.getItem('layerStyle') || '',
  );
  const { mainMap } = useMap();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setColorMode } = useColorMode();
  const onChange = (e: any) => {
    const { value } = e.target;
    localStorage.setItem('layerStyle', value);
    setCurrentStyle(value);
    mainMap.getMap().setStyle(value);
    if (value === 'mapbox://styles/mapbox/dark-v9') {
      setColorMode('dark');
    } else {
      setColorMode('light');
    }
  };

  useEffect(() => {
    function handleClickOutside(event: any): void {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        showList
      ) {
        setShowList(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, showList]);

  const bg = useColorModeValue('white', 'black.200');
  return (
    <chakra.div
      position="fixed"
      bottom="12rem"
      right="1rem"
      display="flex"
      alignItems="baseline"
      ref={wrapperRef}
      className="mapstyle-select"
    >
      <chakra.ul
        bg={bg}
        className={`mapstyle-select__list ${
          showList ? 'mapstyle-select__list--open' : ''
        }`}
      >
        {MAPSTYLES.map((mapstyle) => (
          <MapStyleItem
            key={mapstyle.url}
            onChange={onChange}
            mapstyle={mapstyle}
            current={currentStyle}
          />
        ))}
      </chakra.ul>

      <div className="mapstyle-select__toggle-btn-wrap">
        <IconButton
          aria-label="Select map style"
          bg="white"
          h="47px"
          w="47px"
          _hover={{ bg: 'white', color: 'black' }}
          onClick={() => setShowList((current) => !current)}
          type="button"
          className={`button mapstyle-select__toggle-btn ${
            showList ? 'mapstyle-select__toggle-btn--close' : ''
          }`}
        >
          {showList ? <CloseIcon /> : <LayersIcon />}
        </IconButton>
      </div>
    </chakra.div>
  );
}

export default MapStyleSelect;

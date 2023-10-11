import React, { useEffect, useState } from 'react';
import {
  useColorModeValue,
  Icon,
  VStack,
  Box,
  Text,
  Button,
} from '@chakra-ui/react';
import { NavLink, Link } from 'react-router-dom';
import { LngLatLike } from 'mapbox-gl';

import CategoryFilters from './Filters';
import Search from './Search';
import { useAppContext } from '../../context/App';

import { useTranslation } from '../../context/Translations';

import { MenuCloseIcon, Hamburger } from '../Icon';
import { isInIframe } from '../../utils';

function MenuHeader() {
  const { state } = useAppContext();
  const { translate } = useTranslation();
  const bg = useColorModeValue('#F6F7F7', 'black.200');
  return (
    <Box
      padding="1.5rem 0"
      display="flex"
      paddingLeft="5.5rem"
      width="100%"
      borderBottom="1px solid #e0e0e0"
      bg={bg}
    >
      <Text lineHeight="1" fontSize="1rem" as="b">
        {state.selectedProperty ? (
          <>
            <span>{translate('menu-title-property')}</span>
            <span style={{ marginLeft: '.5rem', fontWeight: 400 }}>
              KPID {state.selectedProperty.id}
            </span>
          </>
        ) : (
          translate('menu-title-home')
        )}
      </Text>
    </Box>
  );
}

function Navigation() {
  const { state, dispatch } = useAppContext();

  if (!state.categories.length) {
    return null;
  }

  return (
    <Box position="relative" w="100%">
      <CategoryFilters />
    </Box>
  );
}

function MenuToggleButton({ isOpen, onClick }: any) {
  const iconColor = useColorModeValue('black.100', 'white');
  const bg = useColorModeValue('#F6F7F7', 'black.200');
  return (
    <Button
      w="4.5rem"
      h="4rem"
      padding="1.4rem"
      borderWidth="0px"
      borderRight="1px"
      borderBottom="1px"
      borderColor="white.500"
      borderRadius="none"
      bg={bg}
      onClick={onClick}
      _hover={{ bg: bg }}
    >
      {isOpen ? (
        <Icon h="24px" w="24px" color={iconColor} as={MenuCloseIcon} />
      ) : (
        <>
          {/* <MenuCloseIcon /> */}
          <Icon as={Hamburger} color={iconColor} h="24px" w="24px" />
        </>
      )}
    </Button>
  );
}

function Menu() {
  const { state, dispatch } = useAppContext();

  const setMenuOpen = (open: boolean) => {
    dispatch({
      type: 'SET_MAIN_MENU_OPEN',
      payload: open,
    });
  };

  const bg = useColorModeValue('white', 'black.200');
  useEffect(() => {
    setMenuOpen(window.innerWidth > 900 && !isInIframe());
  }, []);

  return (
    <>
      <Box position="absolute" zIndex="1001" className="menu-toggle">
        <MenuToggleButton
          isOpen={state.mainMenuOpen}
          onClick={() => setMenuOpen(!state.mainMenuOpen)}
        />
      </Box>
      <Box
        zIndex="1000"
        overflow="hidden"
        position="absolute"
        left="0"
        top="0"
        h="calc(var(--vh, 1vh) * 100)"
        maxW="25rem"
        w="100%"
        transition="all 0.2s ease"
        bg={bg}
        transform={state.mainMenuOpen ? 'translate(0)' : 'translate(-100%)'}
        id="menu-panel"
      >
        <VStack>
          <MenuHeader />
          <Search />
          <Navigation />
        </VStack>
      </Box>
    </>
  );
}

export default Menu;

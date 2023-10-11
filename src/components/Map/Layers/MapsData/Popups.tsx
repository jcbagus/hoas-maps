import React from 'react';
import { Popup } from 'react-map-gl';
import {
  Image,
  useColorModeValue,
  Box,
  Text,
  Stack,
  VStack,
  Button,
  StackProps,
  List,
  ListItem,
  HStack,
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../../../context/App';

import { useTranslation } from '../../../../context/Translations';
import { MapsCategoryType } from '../../../../types';

import {
  DigiTransitCityBikeFeatureProperties,
  DigiTransitStopFeatureProperties,
  DigiTransitStopPatterns,
  PopupInfoProps,
} from './types';
import { getCityBikeStationUrl, getStopUrl, getTypeColor } from './HSL/utils';
import { getPublicTransportIcon } from '../../../../utils';

interface IPopupContentProps {
  properties: any;
  category?: MapsCategoryType;
  type?: 'full' | 'minimal';
}

function PopupImage({
  url,
  alt,
  size,
}: {
  url: string;
  alt: string;
  size: 'box' | 'cover';
}) {
  if (size === 'cover') {
    return <Image alt={alt} src={url} objectFit="cover" w="full" h="48" />;
  }
  return (
    <Image
      mt="4"
      ml="4"
      mr="-4"
      alt={alt}
      src={url}
      w="16"
      h="16"
      objectFit="cover"
    />
  );
}

function CityBikesPopupContent({
  properties,
  bg,
  type,
}: {
  properties: DigiTransitCityBikeFeatureProperties;
  bg: string;
  type: IPopupContentProps['type'];
}) {
  const { translate, currentLanguage } = useTranslation();

  return (
    <VStack
      boxShadow="lg"
      bg={bg}
      p="4"
      spacing="2"
      w="full"
      alignItems="flex-start"
    >
      <Text fontWeight="bold">{properties.name}</Text>
      <Text fontSize="sm" whiteSpace="pre-line">
        {translate('CITY_BIKE_STATION')}
      </Text>
      {type === 'full' && (
        <Button
          as="a"
          bg="green.600"
          w="full"
          href={getCityBikeStationUrl(properties.id, currentLanguage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate('city-bikes-link-txt')}
        </Button>
      )}
    </VStack>
  );
}

function HSLStopsPopupContent({
  properties,
  bg,
  type,
}: {
  bg: string;
  properties: DigiTransitStopFeatureProperties;
  type: IPopupContentProps['type'];
}) {
  const patterns: DigiTransitStopPatterns[] = JSON.parse(properties.patterns);
  const { translate, currentLanguage } = useTranslation();
  const color = getTypeColor(properties.type);
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <VStack
      boxShadow="lg"
      bg={bg}
      p="4"
      spacing="2"
      w="full"
      alignItems="flex-start"
    >
      <HStack color={color} fontSize="sm">
        <Image
          className="icon png-icon"
          src={getPublicTransportIcon(properties.type)}
          alt=""
        />
        <Box>{translate(`${properties.type}`)}</Box>
      </HStack>
      <Text fontWeight="bold">{properties.name}</Text>
      <Box fontSize="0.7rem" color={textColor}>
        {properties.code && (
          <code
            style={{
              border: '1px solid #757575',
              padding: '0.25em',
              borderRadius: '2px',
              marginRight: '0.25rem',
            }}
          >
            {properties.code}
          </code>
        )}
        {properties?.desc}
      </Box>
      {type === 'full' && (
        <>
          <Box maxH="10rem" overflow="auto">
            {patterns.map((p, i) => (
              <List key={p.shortName}>
                <ListItem fontSize="sm">
                  <span style={{ marginRight: '0.2rem', fontWeight: 'bold' }}>
                    {p.shortName}
                  </span>
                  <span>{p.headsign}</span>
                </ListItem>
              </List>
            ))}
          </Box>

          <Button
            as="a"
            href={getStopUrl(properties.gtfsId, currentLanguage)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: color }}
            className="btn btn--primary btn--wide"
          >
            {translate('public-transportation-link-txt')}
          </Button>
        </>
      )}
    </VStack>
  );
}

function PopupContent({ properties, category, type }: IPopupContentProps) {
  const { state } = useAppContext();
  const bg = useColorModeValue('white', 'gray.900');
  const { translate, currentLanguage } = useTranslation();

  if (properties.gtfsId !== undefined) {
    return <HSLStopsPopupContent properties={properties} bg={bg} type={type} />;
  }

  if (properties?.networks !== undefined) {
    return (
      <CityBikesPopupContent properties={properties} bg={bg} type={type} />
    );
  }

  const meta =
    typeof properties.meta === 'string'
      ? JSON.parse(properties.meta)
      : properties.meta;

  let title = properties[`name_${currentLanguage}`] || properties.name;
  let subTitle =
    properties[`titleExtension_${currentLanguage}`] ||
    properties.titleExtension;

  let description = '';
  let address = '';
  const link = properties.link?.trim();

  // If school
  if (meta?.schools) {
    // eslint-disable-next-line prefer-destructuring
    title =
      meta.schools.SS.length === 1 ? meta.schools.SS[0] : translate('schools');
    const city = meta.city ? meta.city.S : '';
    const streetAddress = meta.streetAddress ? meta.streetAddress.S : '';
    const postCode = meta.postCode ? meta.postCode.S : '';
    address = `${city} ${streetAddress}, ${postCode}`;
    subTitle = '';
    description = meta.schools.SS.length > 1 ? properties.description : '';
  }

  let residentalArea = null;
  if (type === 'full' && category?.slug === 'hoas-houses') {
    residentalArea = state.areas.find((area) => {
      const geoJson = JSON.parse(area.geoJson);
      return geoJson.properties.children.includes(properties.slug);
    }) as any;
  }

  return (
    <Stack
      w="full"
      direction={type === 'full' ? 'column' : 'row'}
      position="relative"
      boxShadow="lg"
      bg={bg}
      style={{
        paddingBottom: properties.categorySlug === 'hoas-houses' ? '1rem' : '',
      }}
    >
      {!!properties.image?.trim() && (
        <PopupImage
          url={properties.image}
          alt={properties.name}
          size={type === 'full' ? 'cover' : 'box'}
        />
      )}
      <VStack p="4" w="full" alignItems="flex-start" spacing={2}>
        {title && <Text fontWeight="bold">{title}</Text>}
        {subTitle ? (
          <Text fontSize="sm" whiteSpace="pre-line">
            {subTitle}
          </Text>
        ) : null}
        {address ? (
          <Box fontSize="sm" whiteSpace="pre-line">
            <Box>{translate('address')}</Box>
            <Text>{address}</Text>
          </Box>
        ) : null}

        {description &&
        description.replace(/<(?:.|\n)*?>/gm, '') !== subTitle &&
        category?.slug !== 'hoas-houses' ? (
          <Box
            fontSize="sm"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : null}

        {residentalArea && (
          <>
            <Box fontSize="sm" white-space="pre-line">
              <b>{translate('asuinalue-title')}: </b>
              {residentalArea.name}
            </Box>
            <Button
              as="a"
              bg="green.600"
              w="full"
              href={
                residentalArea[`link_${currentLanguage}`] || residentalArea.link
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {translate('residental-areas-btn-txt')}
            </Button>
          </>
        )}

        {type === 'full' && link ? (
          <Button
            as="a"
            bg="green.600"
            w="full"
            href={properties[`link_${currentLanguage}`] || link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {category ? translate(`${category.slug}-link-txt`) : 'Avaa sivu'}
          </Button>
        ) : null}
      </VStack>
    </Stack>
  );
}

export function HoverPopup({ data }: { data: PopupInfoProps }) {
  const { feature, coordinates } = data;
  const { properties } = feature;

  return (
    <Popup
      className={`popup popup--small popup-hover popup-small--${properties.categorySlug}`}
      closeButton={false}
      closeOnClick={false}
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      offset={30}
      maxWidth={
        properties.categorySlug === 'schools' ||
        properties.categorySlug === 'residental-areas'
          ? '22rem'
          : '19rem'
      }
      anchor="bottom"
    >
      <PopupContent properties={properties} type="minimal" />
    </Popup>
  );
}

export function MainPopup({ selectedItem }: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useAppContext();
  if (!selectedItem) {
    return null;
  }

  const category = state.categories.find((c) =>
    selectedItem.categories.includes(c.slug),
  );

  return (
    <Popup
      className={`popup popup-main popup--${category?.slug}`}
      closeButton
      closeOnClick
      longitude={selectedItem.coordinates.lng}
      latitude={selectedItem.coordinates.lat}
      offset={category?.slug === 'hoas-houses' ? 20 : 0}
      onClose={() => {
        const params = new URLSearchParams(window.location.search);
        params.delete('selectedItem');
        setSearchParams(params);
      }}
      maxWidth={
        category?.slug === 'schools' || category?.slug === 'residental-areas'
          ? '22rem'
          : 'none'
      }
      anchor={category?.slug === 'residental-areas' ? 'bottom' : 'top'}
    >
      <PopupContent properties={selectedItem} category={category} type="full" />
    </Popup>
  );
}

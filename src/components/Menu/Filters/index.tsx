import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useColorModeValue,
  Icon,
  HStack,
  Text,
  Image,
  Box,
  AbsoluteCenter,
  List,
  ListItem,
} from '@chakra-ui/react';
import { useAppContext } from '../../../context/App';
import { useTranslation } from '../../../context/Translations';
import { MapsCategoryType } from '../../../types';
import Checkbox from '../../Checkbox';
import {
  DropDown,
  HoasLegendIcon,
  BusIcon,
  StoresLegendIcon,
  HealthServiceLegendIcon,
  SchoolLegendIcon,
  LibraryLegendIcon,
  CityBikesLegendIcon,
  HSLLegendIcon,
  HouseIcon,
  PublicTransportMarkerIcon,
  StoresIcon,
  HealthServicesIcon,
  SchoolIcon,
  LibraryIcon,
  CityBikesIcon,
  BusMarkerIcon,
  TrainMarkerIcon,
  MetroMarkerIcon,
  TramMarkerIcon,
} from '../../Icon';

// function FilterListSubItem({
//   item,
//   parent,
//   level = 0,
// }: {
//   item: MapsCategoryType;
//   parent: MapsCategoryType;
//   level: number;
// }) {
//   const [submenuOpen, setSubmenuOpen] = useState<boolean>(false);
//   const [checked, setChecked] = useState<boolean>(true);
//   const [indeterminate, setIndeterminate] = useState<boolean>(false);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const toggleSubmenu = () => setSubmenuOpen((current) => !current);
//   const filterParams = searchParams.getAll('filters[]');

//   const { translate } = useTranslation();

//   useEffect(() => {
//     if (item.children.length) {
//       const count = item.children.filter((f) => filterParams.includes(f.slug));
//       if (count.length === item.children.length) {
//         setChecked(true);
//         setIndeterminate(false);
//       } else if (count.length === 0) {
//         setChecked(false);
//         setIndeterminate(false);
//       } else {
//         // indeterminate state
//         setIndeterminate(true);
//         setChecked(false);
//       }
//     } else {
//       setChecked(filterParams.includes(item.slug));
//     }
//   }, [searchParams]);

//   const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name } = e.target;
//     let params = searchParams.getAll('filters[]');

//     if (item.children.length) {
//       const subValues = item.children.map((s) => s.slug);

//       if (!e.target.checked) {
//         params = params.filter(
//           (s) => !subValues.includes(s) && s !== item.slug,
//         );
//       } else {
//         params.push(...subValues);
//         params.push(item.slug);
//       }
//     } else if (!item.children.length) {
//       if (!e.target.checked) {
//         params = params.filter((s) => s !== item.slug);
//       } else {
//         params.push(item.slug);
//       }
//     }

//     setSearchParams({ [name]: params }, { replace: false });
//   };

//   return (
//     <li className={`filters__list-item filters__list-item--level-${level}`}>
//       <div className="filter-item filter-item--subitem">
//         <div className="filter-item__checkbox">
//           <Checkbox
//             onChange={handleOnChange}
//             id={item.slug}
//             checked={filterParams.includes(item.slug)}
//             name="filters[]"
//             value={item.slug}
//           />
//         </div>
//         <label htmlFor={item.slug} className="filter-item__label">
//           <span className="filter-item__name">{item.name}</span>
//         </label>
//         {!item.children.length ? null : (
//           <div
//             tabIndex={0}
//             role="button"
//             onKeyDown={toggleSubmenu}
//             onClick={toggleSubmenu}
//             className="filter-item__actions"
//           >
//             <span
//               className={`dropdown-arrow ${
//                 submenuOpen ? 'dropdown-arrow--open' : ''
//               }`}
//             />
//           </div>
//         )}
//       </div>

//       {item.children.length ? (
//         <ul
//           className={`filters__sub-list ${
//             submenuOpen ? 'filters__sub-list--open' : ''
//           }`}
//         >
//           {item.children.map((c) => (
//             <FilterListSubItem
//               key={c.id}
//               item={c}
//               parent={item}
//               level={level + 1}
//             />
//           ))}
//         </ul>
//       ) : null}
//     </li>
//   );
// }

const getItemName = (item: MapsCategoryType, lang: string) => {
  if (lang === 'sv') {
    return item.name_sv || item.name;
  }

  if (lang === 'en') {
    return item.name_en || item.name;
  }

  return item.name;
};

function FilterListItem({
  item,
  parentChecked,
  level = 0,
}: {
  item: MapsCategoryType;
  parentChecked?: boolean;
  level: number;
}) {
  const { currentLanguage } = useTranslation();
  const [submenuOpen, setSubmenuOpen] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(true);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParams = searchParams.getAll('filters[]');

  const toggleSubmenu = () => setSubmenuOpen((current) => !current);

  useEffect(() => {
    if (item.children.length) {
      let checkedCount = 0;
      item.children.forEach((f) => {
        if (filterParams.includes(f.slug)) {
          checkedCount += 1;
        }
        if (f.children.length) {
          f.children.forEach((c) => {
            if (filterParams.includes(c.slug)) {
              checkedCount += 1;
            }
          });
        }
      });

      const subValues = [];
      item.children.forEach((s) => {
        subValues.push(s.slug);
        if (s.children.length) {
          s.children.forEach((c) => {
            subValues.push(c.slug);
          });
        }
      });
      // if all children checked
      if (checkedCount === subValues.length) {
        setChecked(true);
        setIndeterminate(false);
      } else if (checkedCount === 0) {
        setChecked(false);
        setIndeterminate(false);
      } else {
        // indeterminate state
        setIndeterminate(true);
        setChecked(false);
      }
    } else {
      setChecked(filterParams.includes(item.slug));
    }
  }, [searchParams, parentChecked]);

  const toggleFilter = (name: string, isChecked: boolean) => {
    let params = searchParams.getAll('filters[]');
    if (item.children.length) {
      const subValues: string[] = [];
      item.children.forEach((s) => {
        subValues.push(s.slug);
        if (s.children.length) {
          s.children.forEach((c) => {
            subValues.push(c.slug);
          });
        }
      });

      if (!isChecked) {
        params = params.filter(
          (s) => !subValues.includes(s) && s !== item.slug,
        );
        if (level > 1) {
          params.push(item.slug);
        }
      } else {
        params.push(...subValues);
      }
    } else if (!item.children.length) {
      if (!isChecked) {
        params = params.filter((s) => s !== item.slug);
        if (item.slug === 'tram-stop') {
          const line = 'tram-line';
          params = params.filter((s) => s !== line);
        }
        if (item.slug === 'subway-stop') {
          const line = 'metro-line';
          params = params.filter((s) => s !== line);
        }
        if (item.slug === 'rail-stop') {
          const line = 'railway-line';
          params = params.filter((s) => s !== line);
        }
      } else {
        params.push(item.slug);
        if (item.slug === 'tram-stop') {
          params.push('tram-line');
        }
        if (item.slug === 'subway-stop') {
          params.push('metro-line');
        }
        if (item.slug === 'rail-stop') {
          params.push('railway-line');
        }
      }
    }
    setSearchParams({ [name]: params }, { replace: false });
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked: isChecked } = e.target;
    toggleFilter(name, isChecked);
  };

  const bg = useColorModeValue('white', 'black.200');
  const dropdownColor = useColorModeValue('black', 'white');
  let legendIcon;
  let markerIcon;
  let markerSize = '15px';
  let showFilter = '';

  if (item.slug === 'hoas-houses') {
    legendIcon = HoasLegendIcon;
    markerIcon = HouseIcon;
    markerSize = '25px';
  } else if (item.slug === 'public-transportation') {
    legendIcon = BusIcon;
    markerIcon = PublicTransportMarkerIcon;
    markerSize = '12px';
  } else if (item.slug === 'stores') {
    legendIcon = StoresLegendIcon;
    markerIcon = StoresIcon;
  } else if (item.slug === 'health-services') {
    legendIcon = HealthServiceLegendIcon;
    markerIcon = HealthServicesIcon;
  } else if (item.slug === 'schools') {
    legendIcon = SchoolLegendIcon;
    markerIcon = SchoolIcon;
    markerSize = '25px';
  } else if (item.slug === 'library') {
    legendIcon = LibraryLegendIcon;
    markerIcon = LibraryIcon;
    markerSize = '25px';
  } else if (item.slug === 'city-bikes') {
    legendIcon = CityBikesLegendIcon;
    markerIcon = CityBikesIcon;
  } else if (item.slug === 'hsl-payment-zones') {
    legendIcon = HSLLegendIcon;
  } else if (item.slug === 'bus-stop') {
    legendIcon = HSLLegendIcon;
    markerIcon = BusMarkerIcon;
  } else if (item.slug === 'tram-stop') {
    legendIcon = HSLLegendIcon;
    markerIcon = TramMarkerIcon;
  } else if (item.slug === 'subway-stop') {
    legendIcon = HSLLegendIcon;
    markerIcon = MetroMarkerIcon;
  } else if (item.slug === 'rail-stop') {
    legendIcon = HSLLegendIcon;
    markerIcon = TrainMarkerIcon;
  } else if (
    item.slug === 'tram-line' ||
    item.slug === 'railway-line' ||
    item.slug === 'metro-line'
  ) {
    showFilter = 'none';
  }

  return (
    <ListItem
      w="100%"
      _last={{ borderBottom: 'none' }}
      display={showFilter}
      id={item.slug}
    >
      <HStack
        borderBottom="1px"
        borderColor="#c7c7c7"
        h="4rem"
        padding="1.5rem"
      >
        <Box mr="0.5rem" className="filter-item__checkbox">
          <Checkbox
            onChange={handleOnChange}
            id={item.slug}
            checked={checked || filterParams.includes(item.slug)}
            className={indeterminate ? 'checkbox--indeterminate' : ''}
            name="filters[]"
            value={item.slug}
          />
        </Box>
        {level === 0 ? (
          <Box minW="40px">
            <Image w="30px" h="30px" marginRight="0.5rem" src={legendIcon} />
          </Box>
        ) : null}
        <Text minW="160px" maxW="160px" className="filter-name">
          {getItemName(item, currentLanguage)}
        </Text>
        {level === 1 ? <Box minW="40px"> </Box> : null}
        <Box minW="40px" position="relative">
          <AbsoluteCenter>
            <Image maxW="40px" height={markerSize} src={markerIcon} />
          </AbsoluteCenter>
        </Box>
        {!item.children.length ? null : (
          <HStack
            justifyContent="center"
            w="55px"
            cursor="pointer"
            tabIndex={0}
            role="button"
            onKeyDown={toggleSubmenu}
            onClick={toggleSubmenu}
          >
            <Icon
              as={DropDown}
              h="1rem"
              w="0.8rem"
              color={dropdownColor}
              transform={` ${submenuOpen ? 'rotate(-180deg);' : ''}`}
            />
          </HStack>
        )}
      </HStack>

      {item.children.length ? (
        <List
          flexFlow="column"
          bg={bg}
          display={`${submenuOpen ? 'flex' : 'none'}`}
        >
          {item.children.map((c) => (
            <FilterListItem
              key={c.id}
              item={c}
              level={level + 1}
              parentChecked={checked}
            />
          ))}
        </List>
      ) : null}
    </ListItem>
  );
}

function CategoryFilters() {
  const { state } = useAppContext();

  return (
    <Box overflowY="scroll" height="100vh">
      <List marginBottom="40vh">
        {state.categories
          .filter((c) => c.type !== 'area')
          .map((category) => (
            <FilterListItem key={category.id} item={category} level={0} />
          ))}
      </List>
    </Box>
  );
}

export default CategoryFilters;

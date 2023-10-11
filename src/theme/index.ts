import { extendTheme } from '@chakra-ui/react';

import colors from './colors';
import fonts from './fonts';
import styles from './styles';

import components from './components';

const overrides = {
  colors,
  fonts,
  components,
  styles,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
};

export default extendTheme(overrides);

import { defineStyle } from '@chakra-ui/react';

const Link = defineStyle({
  baseStyle: {
    fontSize: '0.9em',
    w: '100%',
    padding: '1em 0',
    display: 'block',
    textAlign: 'center',
    border: 'none',
    color: '#fff',
    fontWeight: '700',
    transition: 'opacity 0.2s ease',
    borderRadius: '4px',
  },
});

export default Link;

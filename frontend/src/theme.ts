import { createTheme, MantineColorsTuple } from '@mantine/core';

const myColor: MantineColorsTuple = [
  '#eefcfb',
  '#dff5f4',
  '#b8ece9',
  '#90e2de',
  '#71dad5',
  '#5fd5cf',
  '#53d3cc',
  '#44bbb4',
  '#36a6a0',
  '#0b3634'
];

export const theme1 = createTheme({})
export const theme = createTheme({
  /** Put your mantine theme override here */
  defaultGradient: {
    from: 'dark',
    to: 'red',
    deg: 45,
  },
  colors: {
    dark: [
      '#fafcff',
      '#cad5e8',
      '#8697b5',
      '#4c5d7d',
      '#222833',
      '#222938',
      '#0b0f14',
      '#0b0f14',
      '#030405',
      '#000000'
    ],
    gray: [
      '#e3e7f1',
      '#d8ddeb',
      '#ced4e5',
      '#c3cadf',
      '#b8c1d9',
      '#b8c1d9',
      '#7b8cb8',
      '#4b5c8b',
      '#2a334d',
      '#090b10'
    ],
    blue: [
      '#ddf4ff',
      '#b6e3ff',
      '#80ccff',
      '#54aeff',
      '#218bff',
      '#0969da',
      '#0550ae',
      '#033d8b',
      '#0a3069',
      '#002155'
    ],
    green: [
      '#dafbe1',
      '#aceebb',
      '#6fdd8b',
      '#4ac26b',
      '#2da44e',
      '#1a7f37',
      '#116329',
      '#044f1e',
      '#003d16',
      '#002d11'
    ],
    yellow: [
      '#fff8c5',
      '#fae17d',
      '#eac54f',
      '#d4a72c',
      '#bf8700',
      '#9a6700',
      '#7d4e00',
      '#633c01',
      '#4d2d00',
      '#3b2300'
    ],
    orange: [
      '#fff1e5',
      '#ffd8b5',
      '#ffb77c',
      '#fb8f44',
      '#e16f24',
      '#bc4c00',
      '#953800',
      '#762c00',
      '#5c2200',
      '#471700'
    ],
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#fa5252',
      '#f03e3e',
      '#e03131',
      '#c92a2a'
    ],
    pink: [
      '#fff0f6',
      '#ffdeeb',
      '#fcc2d7',
      '#faa2c1',
      '#f783ac',
      '#f06595',
      '#e64980',
      '#d6336c',
      '#c2255c',
      '#a61e4d'
    ],
    grape: [
      '#f8f0fc',
      '#f3d9fa',
      '#eebefa',
      '#e599f7',
      '#da77f2',
      '#cc5de8',
      '#be4bdb',
      '#ae3ec9',
      '#9c36b5',
      '#862e9c'
    ],
    violet: [
      '#f3f0ff',
      '#e5dbff',
      '#d0bfff',
      '#b197fc',
      '#9775fa',
      '#845ef7',
      '#7950f2',
      '#7048e8',
      '#6741d9',
      '#5f3dc4'
    ],
    indigo: [
      '#edf2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7'
    ],
    cyan: [
      '#e3fafc',
      '#c5f6fa',
      '#99e9f2',
      '#66d9e8',
      '#3bc9db',
      '#22b8cf',
      '#15aabf',
      '#1098ad',
      '#0c8599',
      '#0b7285'
    ],
    teal: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997',
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b'
    ],
    lime: [
      '#f4fce3',
      '#e9fac8',
      '#d8f5a2',
      '#c0eb75',
      '#a9e34b',
      '#94d82d',
      '#82c91e',
      '#74b816',
      '#66a80f',
      '#5c940d'
    ],
    Kabooki: [
      "#f0f5f9",
      "#e2e8ed",
      "#bfcfdc",
      "#9ab5cb",
      "#7b9fbd",
      "#6792b4",
      "#5c8bb1",
      "#4c789c",
      "#416a8c",
      "#091117"
    ]
  },
  primaryColor: 'Kabooki',
  primaryShade: {
    light: 6,
    dark: 5
  },
});

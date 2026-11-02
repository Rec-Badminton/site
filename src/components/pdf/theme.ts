import { Font, StyleSheet } from '@react-pdf/renderer';
import barlowRegular from '@/assets/fonts/Barlow-Regular.ttf';
import barlowItalic from '@/assets/fonts/Barlow-Italic.ttf';
import barlowSemiBold from '@/assets/fonts/Barlow-SemiBold.ttf';
import barlowBold from '@/assets/fonts/Barlow-Bold.ttf';
import condensedBold from '@/assets/fonts/BarlowCondensed-Bold.ttf';
import condensedExtraBold from '@/assets/fonts/BarlowCondensed-ExtraBold.ttf';
import condensedExtraBoldItalic from '@/assets/fonts/BarlowCondensed-ExtraBoldItalic.ttf';

// Same palette as the @theme block of styles/index.css.
export const colors = {
  brand: '#da3124',
  brandDark: '#b3261e',
  brandLight: '#ff6b5e',
  brandTint: '#fbe5e2',
  ink: '#1f2421',
  inkDeep: '#141816',
  inkSoft: '#2a302c',
  inkLine: '#3a403c',
  sand: '#f4f2ee',
  line: '#ece8e2',
  muted: '#545a56',
  mutedLight: '#bdb8b0',
  softWhite: '#d6d2cb',
  white: '#ffffff'
};

// A4 portrait, in points
export const A4 = { width: 595.28, height: 841.89 };
export const MARGIN: number = 48;

export const SANS: string = 'Barlow';
export const DISPLAY: string = 'Barlow Condensed';

Font.register({
  family: SANS,
  fonts: [
    { src: barlowRegular, fontWeight: 400 },
    { src: barlowItalic, fontWeight: 400, fontStyle: 'italic' },
    { src: barlowSemiBold, fontWeight: 600 },
    { src: barlowBold, fontWeight: 700 }
  ]
});

Font.register({
  family: DISPLAY,
  fonts: [
    { src: condensedBold, fontWeight: 700 },
    { src: condensedExtraBold, fontWeight: 800 },
    { src: condensedExtraBoldItalic, fontWeight: 800, fontStyle: 'italic' }
  ]
});

// keep words whole: French hyphenation would split them oddly
Font.registerHyphenationCallback((word: string) => [word]);

export const base = StyleSheet.create({
  // no lineHeight here: react-pdf drops dynamic (page number) text that inherits one
  page: {
    fontFamily: SANS,
    fontSize: 10.5,
    color: colors.ink,
    backgroundColor: colors.white
  },
  body: {
    lineHeight: 1.45
  },
  displayTitle: {
    fontFamily: DISPLAY,
    fontWeight: 800,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    lineHeight: 0.95
  },
  eyebrow: {
    fontFamily: DISPLAY,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  badge: {
    fontFamily: DISPLAY,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 1.2,
    // condensed caps sit low in their box: push the padding to the top
    paddingHorizontal: 5,
    paddingTop: 2,
    paddingBottom: 0
  },
  strong: {
    fontWeight: 700
  }
});

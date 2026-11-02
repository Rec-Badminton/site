import react from '@mxreakit/configs/eslint/react';

export default [
  ...react,
  // French copy uses non-breaking spaces before ? ! : ; in JSX text
  { rules: { 'no-irregular-whitespace': ['error', { skipJSXText: true }] } }
];

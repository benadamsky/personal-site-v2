import coreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...coreWebVitals,
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts']
  }
];

export default config;

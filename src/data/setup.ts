export interface Gear {
  id: 'headphones' | 'mouse' | 'keyboard';
  label: string;
  name: string;
  url: string;
}

export const setup: Gear[] = [
  {
    id: 'headphones',
    label: 'headphones',
    name: 'Bose QuietComfort Ultra',
    url: 'https://www.bose.com/p/headphones/bose-quietcomfort-ultra-headphones/QCUH-HEADPHONEARN.html'
  },
  {
    id: 'mouse',
    label: 'mouse',
    name: 'Logitech MX Master 4 for Mac',
    url: 'https://www.logitech.com/en-us/shop/p/mx-master-4-for-mac'
  },
  {
    id: 'keyboard',
    label: 'keyboard',
    name: 'Varmilo Minilo75 Pro',
    url: 'https://varmilo.com/products/minilo75-pro'
  }
];

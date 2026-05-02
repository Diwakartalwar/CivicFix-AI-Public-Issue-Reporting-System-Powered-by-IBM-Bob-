import { render, screen } from '@testing-library/react';

jest.mock('react-router-dom', () => {
  const React = require('react');

  return {
    BrowserRouter: ({ children }) => React.createElement('div', null, children),
    Routes: () => null,
    Route: () => null,
    Link: ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children),
    useLocation: () => ({ pathname: '/' }),
  };
}, { virtual: true });

jest.mock('react-leaflet', () => {
  const React = require('react');

  return {
    MapContainer: ({ children }) => React.createElement('div', null, children),
    TileLayer: () => null,
    Marker: () => null,
    Popup: () => null,
    useMap: () => ({
      addLayer: () => {},
      removeLayer: () => {},
    }),
  };
});

jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: () => {},
    },
  },
  divIcon: (options) => options,
  marker: () => ({
    bindPopup: () => {},
  }),
  markerClusterGroup: () => ({
    addLayer: () => {},
  }),
}));

jest.mock('leaflet.markercluster', () => ({}), { virtual: true });

import App from './App.jsx';

test('renders CivicFix app shell', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /CivicFix/i })).toBeInTheDocument();
});

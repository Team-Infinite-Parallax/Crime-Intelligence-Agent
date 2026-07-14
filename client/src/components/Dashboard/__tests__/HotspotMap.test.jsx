import React from 'react';
import { render, screen } from '@testing-library/react';
import HotspotMap from '../HotspotMap';
import { FilterProvider } from '../../../contexts/FilterContext';
import { vi, describe, it, expect } from 'vitest';

// Mock react-leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  Circle: () => <div data-testid="circle" />,
  useMap: () => ({ setView: vi.fn(), flyTo: vi.fn() })
}));

describe('HotspotMap Component', () => {
  it('renders the map container successfully', () => {
    render(
      <FilterProvider>
        <HotspotMap activeLayers={{ heatmap: true, hotspots: true }} />
      </FilterProvider>
    );
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('renders the screen-reader fallback table', () => {
    render(
      <FilterProvider>
        <HotspotMap activeLayers={{ heatmap: true, hotspots: true }} />
      </FilterProvider>
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Crime Hotspots Data')).toBeInTheDocument();
  });
});

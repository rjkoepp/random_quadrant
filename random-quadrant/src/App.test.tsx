import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component - Initial Render', () => {
  it('should render all four quadrants', () => {
    render(<App />);
    
    // Find all quadrant elements
    const quadrants = screen.getAllByTestId('color-quadrant');
    
    // Check if there are exactly 4 quadrants
    expect(quadrants).toHaveLength(4);
    
    // Verify each quadrant has the correct styling classes
    quadrants.forEach(quadrant => {
      expect(quadrant).toHaveClass('aspect-square', 'rounded-lg');
    });
    
    // Verify the grid container has the correct layout classes
    const gridContainer = screen.getByTestId('quadrant-grid');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'gap-4');
  });
});

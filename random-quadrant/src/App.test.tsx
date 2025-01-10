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

  it('should have correct initial color positions', () => {
    render(<App />);
    
    // Find all quadrant elements
    const quadrants = screen.getAllByTestId('color-quadrant');
    
    // Verify initial color positions
    expect(quadrants[0]).toHaveAttribute('style', expect.stringContaining('red'));       // top-left
    expect(quadrants[1]).toHaveAttribute('style', expect.stringContaining('blue'));      // top-right
    expect(quadrants[2]).toHaveAttribute('style', expect.stringContaining('orange'));    // bottom-left
    expect(quadrants[3]).toHaveAttribute('style', expect.stringContaining('green'));     // bottom-right
  });
});

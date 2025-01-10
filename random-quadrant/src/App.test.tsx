import { render, screen, fireEvent } from '@testing-library/react';
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

  it('should have an accessible randomize button', () => {
    render(<App />);
    
    // Find the button
    const button = screen.getByRole('button', { name: /randomize colors/i });
    
    // Verify button presence and accessibility
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
    expect(button).toBeEnabled();
    expect(button).toHaveTextContent(/randomize colors/i);
    expect(button).toHaveClass('w-full');
  });

  it('should maintain all colors after randomization', () => {
    render(<App />);
    
    // Get initial colors
    const initialQuadrants = screen.getAllByTestId('color-quadrant');
    const initialColors = new Set(
      initialQuadrants.map(q => 
        q.getAttribute('style')?.match(/background-color:\s*(\w+)/)?.[1]
      ).filter(Boolean)
    );

    // Click randomize button
    const button = screen.getByRole('button', { name: /randomize colors/i });
    fireEvent.click(button);

    // Get new colors
    const newQuadrants = screen.getAllByTestId('color-quadrant');
    const newColors = new Set(
      newQuadrants.map(q => 
        q.getAttribute('style')?.match(/background-color:\s*(\w+)/)?.[1]
      ).filter(Boolean)
    );

    // Verify all colors are maintained
    expect(newColors.size).toBe(4);
    expect([...initialColors].sort()).toEqual([...newColors].sort());
  });

  it('should change color positions on button click', () => {
    render(<App />);
    
    // Get initial color positions
    const initialQuadrants = screen.getAllByTestId('color-quadrant');
    const initialPositions = initialQuadrants.map(q => 
      q.getAttribute('style')?.match(/background-color:\s*(\w+)/)?.[1]
    );

    // Click randomize button multiple times to ensure position changes
    const button = screen.getByRole('button', { name: /randomize colors/i });
    let positionsChanged = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!positionsChanged && attempts < maxAttempts) {
      fireEvent.click(button);
      
      const newQuadrants = screen.getAllByTestId('color-quadrant');
      const newPositions = newQuadrants.map(q => 
        q.getAttribute('style')?.match(/background-color:\s*(\w+)/)?.[1]
      );
      
      // Check if any position has changed
      positionsChanged = newPositions.some((color, index) => color !== initialPositions[index]);
      attempts++;
    }

    expect(positionsChanged).toBe(true);
  });

  it('should maintain color uniqueness after randomization', () => {
    render(<App />);
    
    const button = screen.getByRole('button', { name: /randomize colors/i });
    const numAttempts = 5;

    // Test multiple randomizations to ensure uniqueness is always maintained
    for (let i = 0; i < numAttempts; i++) {
      fireEvent.click(button);
      
      const quadrants = screen.getAllByTestId('color-quadrant');
      const colors = quadrants.map(q => 
        q.getAttribute('style')?.match(/background-color:\s*(\w+)/)?.[1]
      ).filter(Boolean);

      // Check for uniqueness
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(4);
      expect(colors).toHaveLength(4);
      
      // Verify all expected colors are present
      expect(uniqueColors).toContain('red');
      expect(uniqueColors).toContain('blue');
      expect(uniqueColors).toContain('orange');
      expect(uniqueColors).toContain('green');
    }
  });

  it('should distribute colors randomly', () => {
    render(<App />);
    
    const button = screen.getByRole('button', { name: /randomize colors/i });
    const iterations = 50;
    const colors = ['red', 'blue', 'orange', 'green'] as const;
    type Color = typeof colors[number];
    
    // Get initial positions
    const getColorPositions = () => {
      const quadrants = screen.getAllByTestId('color-quadrant');
      return quadrants.map(q => 
        q.getAttribute('style')?.match(/background-color:\s*(\w+)/)?.[1]
      ).filter((c): c is Color => c !== undefined && colors.includes(c as Color));
    };

    const initialPositions = getColorPositions();
    let positionsChanged = false;
    let allColorsUsed = new Set<Color>();

    // Perform multiple randomizations
    for (let i = 0; i < iterations && (!positionsChanged || allColorsUsed.size < colors.length); i++) {
      fireEvent.click(button);
      const currentPositions = getColorPositions();
      
      // Check if positions changed
      positionsChanged = positionsChanged || currentPositions.some((color, index) => color !== initialPositions[index]);
      
      // Track which colors are being used
      currentPositions.forEach(color => allColorsUsed.add(color));
    }

    // Verify randomization
    expect(positionsChanged).toBe(true);
    expect(allColorsUsed.size).toBe(colors.length);
  });

  it('should maintain proper layout and styling', () => {
    render(<App />);
    
    // Test grid container
    const gridContainer = screen.getByTestId('quadrant-grid');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'gap-4', 'mb-4');

    // Test quadrant styling
    const quadrants = screen.getAllByTestId('color-quadrant');
    quadrants.forEach(quadrant => {
      expect(quadrant).toHaveClass('aspect-square', 'rounded-lg');
      expect(quadrant).toHaveStyle({ minHeight: '200px' });
    });

    // Test button styling
    const button = screen.getByRole('button', { name: /randomize colors/i });
    expect(button).toHaveClass('w-full');

    // Test container responsiveness
    const container = gridContainer.parentElement;
    expect(container).toHaveClass('w-full', 'max-w-lg');

    // Test page layout
    const pageContainer = container?.parentElement;
    expect(pageContainer).toHaveClass(
      'min-h-screen',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'bg-gray-100',
      'p-4'
    );
  });
});

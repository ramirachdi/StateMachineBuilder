// __tests__/Toolbox.unit.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toolbox from '../components/Toolbox';

describe('Toolbox Component', () => {
  test('renders the Toolbox component with all items', () => {
    render(<Toolbox />);
    
    // Check if all toolbox items are rendered
    expect(screen.getByText(/Initial State/i)).toBeInTheDocument();
    expect(screen.getByText(/Regular State/i)).toBeInTheDocument();
    expect(screen.getByText(/Final State/i)).toBeInTheDocument();
    expect(screen.getByText(/Choice Node/i)).toBeInTheDocument();
    expect(screen.getByText(/Fork Node/i)).toBeInTheDocument();
    expect(screen.getByText(/Join Node/i)).toBeInTheDocument();
    expect(screen.getByText(/Region/i)).toBeInTheDocument();
  });

  test('allows dragging toolbox items', () => {
    render(<Toolbox />);
    
    const toolboxItem = screen.getByText(/Initial State/i);
    const dataTransfer = {
      setData: jest.fn(),
      effectAllowed: '',
    };
    
    const dragStartEvent = new Event('dragstart', { bubbles: true });
    Object.assign(dragStartEvent, { dataTransfer });
    
    toolboxItem.dispatchEvent(dragStartEvent);
    
    expect(dataTransfer.setData).toHaveBeenCalledWith('application/reactflow', 'initialState');
    expect(dataTransfer.effectAllowed).toBe('move');
  });
});

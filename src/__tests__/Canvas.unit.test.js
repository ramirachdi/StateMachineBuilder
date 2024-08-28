// __tests__/Canvas.unit.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Canvas from '../components/Canvas';

describe('Canvas Component', () => {
  test('renders the Canvas component with initial elements', () => {
    render(<Canvas />);
    
    // Check if the input field and button are rendered
    const inputElement = screen.getByPlaceholderText(/Enter main canvas name/i);
    expect(inputElement).toBeInTheDocument();
    
    const saveButton = screen.getByText(/Save Name/i);
    expect(saveButton).toBeInTheDocument();
    
    // Check if the file input is rendered

  });

  test('allows inputting and saving the main canvas name', () => {
    render(<Canvas />);
    
    const inputElement = screen.getByPlaceholderText(/Enter main canvas name/i);
    const saveButton = screen.getByText(/Save Name/i);
    
    fireEvent.change(inputElement, { target: { value: 'TestCanvas' } });
    fireEvent.click(saveButton);
    
    expect(screen.getByText(/TestCanvas/i)).toBeInTheDocument();
  });

  test('handles file upload correctly', () => {
    render(<Canvas />);
    

  });
});

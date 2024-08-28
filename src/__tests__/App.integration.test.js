// __tests__/App.integration.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component', () => {
  test('renders Toolbox and Canvas components', () => {
    render(<App />);
    
    // Check for Toolbox and Canvas components
    expect(screen.getByText(/Initial State/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter main canvas name/i)).toBeInTheDocument();
  });
});

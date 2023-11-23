// AuthComponent.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Login from './pages/login/Login'; 
test('renders authentication form', () => {
  render(<Login />);
  
  // Check if the authentication form is rendered
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});

test('allows user to log in', async () => {
  render(<Login />);
  
  // Simulate user input
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testPassword' } });

  // Trigger login
  fireEvent.click(screen.getByText(/login/i));

  // Wait for the login process (assuming it's asynchronous)
  await waitFor(() => {
    expect(screen.getByText(/login successful/i)).toBeInTheDocument();
  });
});

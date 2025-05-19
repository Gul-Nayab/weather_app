import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

//Mock fetch for tests
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.startsWith('http://localhost:5000')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Data stored' }),
      });
    }

    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          name: 'Test City',
          main: { temp: 70, feels_like: 67, humidity: 55 },
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        }),
    });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

//Test 1: check if the input and submit button are created when page renders (key features for weather app)
test('renders input and button', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/zipcode/i)).toBeInTheDocument();
  expect(screen.getByText(/submit/i)).toBeInTheDocument();
});

//Test 2: test if you can input a zipcode
test('allows user to type zipcode', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/zipcode/i);
  fireEvent.change(input, { target: { value: '95192' } });
  expect(input.value).toBe('95192');
});

//Test 3: test if submit send zipcode and fetches data that is then displayed
test('fetches and displays weather data after submit', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/zipcode/i);
  fireEvent.change(input, { target: { value: '95192' } });

  const button = screen.getByText(/submit/i);
  fireEvent.click(button);

  //wait for table to display fetched data and icon
  await waitFor(() => {
    expect(screen.getByText(/test city/i)).toBeInTheDocument();
    expect(screen.getByText(/70/)).toBeInTheDocument();
    expect(screen.getByText(/67/)).toBeInTheDocument();
    expect(screen.getByText(/55%/)).toBeInTheDocument();
    expect(screen.getByText(/clear/i)).toBeInTheDocument();
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('src', expect.stringContaining('01d'));
    expect(icon).toHaveAttribute('title', 'clear sky');
  });
});

//Test 4: check if user can toggle between units
test('can change units', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/zipcode/i);
  fireEvent.change(input, { target: { value: '95192' } });

  fireEvent.click(screen.getByText(/submit/i));
  await waitFor(() => {
    expect(screen.getByText(/70/)).toBeInTheDocument();
  });

  fireEvent.change(screen.getByDisplayValue(/fahrenheit/i), {
    target: { value: 'metric' },
  });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(3); //confirm changing to metric results in an additional fetch call (F fetch, C fetch, and Post request)
  });
});

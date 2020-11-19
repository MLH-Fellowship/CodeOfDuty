import { render, screen } from '@testing-library/react';

import App from './App';

describe('App', () => {
  test("renders welcome message and log in button", async () => {
    render(<App />);
    expect(screen.getByText('Welcome, warrior!')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});

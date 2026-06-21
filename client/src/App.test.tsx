import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import App from './App';
import { describe } from 'vitest';

describe('App', () => {
  it('renders the docker multi container app', () => {
    render(<App />);
    expect(screen.getByText('Docker Multi Container App')).toBeInTheDocument();
  });
});

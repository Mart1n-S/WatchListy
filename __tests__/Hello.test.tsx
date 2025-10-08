import { render, screen } from '@testing-library/react';
import Hello from '../src/components/Hello';

describe('Hello component', () => {
  it('renders the correct greeting', () => {
    render(<Hello name="WatchListy" />);
    const heading = screen.getByText('Hello, WatchListy!');
    expect(heading).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const heading = screen.getByText(/make your own atta/i);
  expect(heading).toBeInTheDocument();
});

const PRESET_LABELS = [
  /protein rich/i,
  /diabetes friendly/i,
  /calorie conscious/i,
  /gut health/i,
  /senior friendly/i,
  /pcos friendly/i,
  /cardiocare/i,
];

test.each(PRESET_LABELS)('health blend preset "%s" totals 100%%', (label) => {
  render(<App />);

  userEvent.click(screen.getByText(label));
  userEvent.click(screen.getByText(/set quantities →/i));

  expect(screen.getByText('100%')).toBeInTheDocument();
  expect(screen.getByText(/review summary →/i)).toBeEnabled();
});

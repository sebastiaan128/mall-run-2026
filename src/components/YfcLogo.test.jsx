import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import YfcLogo from './YfcLogo.jsx';

describe('YfcLogo', () => {
  it('toont standaard alleen het vierkant', () => {
    const { container } = render(<YfcLogo />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 167.239 141.732');
  });

  it('toont de volledige lockup als daarom gevraagd wordt', () => {
    const { container } = render(<YfcLogo variant="full" />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 167.239 189.681');
  });

  it('heeft een toegankelijke naam', () => {
    render(<YfcLogo title="Youth for Christ Veenendaal" />);
    expect(screen.getByRole('img', { name: 'Youth for Christ Veenendaal' })).toBeInTheDocument();
  });

  it('is verborgen voor schermlezers zonder titel', () => {
    const { container } = render(<YfcLogo />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});

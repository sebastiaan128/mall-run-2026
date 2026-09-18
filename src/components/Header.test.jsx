import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Header from './Header.jsx';

describe('Header', () => {
  it('toont de naam van het evenement', () => {
    render(<Header />);
    expect(screen.getByText('The Mall Run')).toBeInTheDocument();
  });

  it('vermeldt wie het organiseert, met een link naar YFC', () => {
    render(<Header />);
    const link = screen.getByRole('link', { name: /Youth for Christ Veenendaal/i });
    expect(link).toHaveAttribute('href', 'https://veenendaal.yfc.nl/');
  });

  it('opent de YFC-link in een nieuw tabblad zonder referrer-lek', () => {
    render(<Header />);
    const link = screen.getByRole('link', { name: /Youth for Christ Veenendaal/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('zet het woordmerk in de eigen letter, niet in de sitebrede letter', () => {
    render(<Header />);
    const wordmark = screen.getByRole('link', { name: 'The Mall Run' });
    expect(wordmark).toHaveClass('font-wordmark');
    expect(wordmark).not.toHaveClass('u-wide');
  });
});

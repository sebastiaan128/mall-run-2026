import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProgressBar from './ProgressBar.jsx';

describe('ProgressBar', () => {
  it('leest bedrag, doel en percentage voor aan schermlezers', () => {
    render(<ProgressBar raised={4200} goal={10000} />);
    expect(
      screen.getByRole('img', { name: '€4.200 opgehaald van €10.000, 42 procent' })
    ).toBeInTheDocument();
  });

  it('gaat niet over de honderd procent heen', () => {
    render(<ProgressBar raised={99999} goal={10000} />);
    expect(screen.getByText('100% van het doel')).toBeInTheDocument();
  });

  it('valt terug op nul procent bij een doel van nul', () => {
    render(<ProgressBar raised={500} goal={0} />);
    expect(screen.getByText('0% van het doel')).toBeInTheDocument();
  });

  it('toont het stretchdoel alleen als het meegegeven is', () => {
    const { rerender } = render(<ProgressBar raised={100} goal={1000} />);
    expect(screen.queryByText(/Lukt het/)).not.toBeInTheDocument();
    rerender(<ProgressBar raised={100} goal={1000} stretch={2000} />);
    expect(screen.getByText(/Lukt het/)).toBeInTheDocument();
  });
});

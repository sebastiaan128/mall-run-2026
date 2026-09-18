import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RouteSectionShell from './RouteSectionShell.jsx';

describe('RouteSectionShell', () => {
  it('meldt zich als halte bij de routelijn', () => {
    const { container } = render(
      <RouteSectionShell id="waarom" label="Waarom">inhoud</RouteSectionShell>
    );
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-route-stop');
    expect(section).toHaveAttribute('data-route-side', 'left');
  });

  it('kan aan de rechterkant hangen', () => {
    const { container } = render(
      <RouteSectionShell id="route" label="Route" side="right">inhoud</RouteSectionShell>
    );
    expect(container.querySelector('section')).toHaveAttribute('data-route-side', 'right');
  });

  it('toont het label en de inhoud', () => {
    render(<RouteSectionShell id="waarom" label="Waarom">de inhoud</RouteSectionShell>);
    expect(screen.getByText('Waarom')).toBeInTheDocument();
    expect(screen.getByText('de inhoud')).toBeInTheDocument();
  });

  it('is te vinden via zijn id', () => {
    const { container } = render(
      <RouteSectionShell id="waarom" label="Waarom">inhoud</RouteSectionShell>
    );
    expect(container.querySelector('#waarom')).not.toBeNull();
  });

  it('centreert de inhoud met align="center" in plaats van de zijdelingse 62%-maat', () => {
    render(
      <RouteSectionShell id="inschrijven" label="Inschrijven" align="center">
        inhoud
      </RouteSectionShell>
    );
    const content = screen.getByText('inhoud');
    expect(content).toHaveClass('mx-auto', 'w-full', 'max-w-[720px]');
    expect(content).not.toHaveClass('md:max-w-[62%]');
  });

  it('gebruikt zonder align nog steeds de zijdelingse 62%-maat', () => {
    render(<RouteSectionShell id="waarom" label="Waarom">inhoud</RouteSectionShell>);
    const content = screen.getByText('inhoud');
    expect(content).toHaveClass('md:max-w-[62%]');
    expect(content).not.toHaveClass('mx-auto');
  });
});

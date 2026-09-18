import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RouteSectionShell from './RouteSectionShell.jsx';
import { LEFT_X, RIGHT_X } from '../../lib/buildRoutePath.js';

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

  it('legt het ringetje op de linker x-positie bij een halte aan de linkerkant', () => {
    const { container } = render(
      <RouteSectionShell id="waarom" label="Waarom">inhoud</RouteSectionShell>
    );
    const ring = container.querySelector('section > span');
    expect(ring.style.left).toBe(`${LEFT_X}%`);
  });

  it('legt het ringetje op de rechter x-positie bij side="right"', () => {
    const { container } = render(
      <RouteSectionShell id="route" label="Route" side="right">inhoud</RouteSectionShell>
    );
    const ring = container.querySelector('section > span');
    expect(ring.style.left).toBe(`${RIGHT_X}%`);
  });

  it('verbergt het ringetje voor schermlezers', () => {
    const { container } = render(
      <RouteSectionShell id="waarom" label="Waarom">inhoud</RouteSectionShell>
    );
    const ring = container.querySelector('section > span');
    expect(ring).toHaveAttribute('aria-hidden', 'true');
  });
});

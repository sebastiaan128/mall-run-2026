import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ParticipantCard from './ParticipantCard.jsx';

function renderRow(participant) {
  return render(
    <MemoryRouter>
      <ParticipantCard participant={participant} />
    </MemoryRouter>
  );
}

describe('ParticipantCard', () => {
  const base = {
    id: 'abc',
    name: 'Sanne',
    distance: '14 km',
    team: 'Team Veenendaal',
    quote: 'Ik loop voor The Mall.',
    raisedAmount: 75,
    goalAmount: 150,
  };

  it('linkt naar de eigen pagina van de deelnemer', () => {
    renderRow(base);
    expect(screen.getByRole('link', { name: /Sanne/ })).toHaveAttribute('href', '/deelnemer/abc');
  });

  it('toont de afstand zonder dubbele eenheid', () => {
    renderRow(base);
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('overleeft een deelnemer zonder doelbedrag', () => {
    renderRow({ ...base, goalAmount: 0, raisedAmount: 0 });
    expect(screen.getByRole('link', { name: /Sanne/ })).toBeInTheDocument();
  });
});

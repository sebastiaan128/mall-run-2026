import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RegistrationForm from './RegistrationForm.jsx';

vi.mock('../hooks/useRegistrations.js', () => ({
  submitRegistration: vi.fn().mockResolvedValue(undefined),
}));

describe('RegistrationForm', () => {
  it('toont de gekozen afstand als geselecteerd', () => {
    render(<RegistrationForm distance="14 km" onDistanceChange={() => {}} />);
    expect(screen.getByRole('radio', { name: '14 km' })).toBeChecked();
  });

  it('meldt een gewijzigde afstand aan de pagina', async () => {
    const onDistanceChange = vi.fn();
    render(<RegistrationForm distance="7 km" onDistanceChange={onDistanceChange} />);
    await userEvent.click(screen.getByRole('radio', { name: '21,1 km' }));
    expect(onDistanceChange).toHaveBeenCalledWith('21,1 km');
  });
});

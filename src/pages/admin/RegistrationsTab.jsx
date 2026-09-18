import { useRegistrationsList } from '../../hooks/useRegistrations.js';

function formatDate(ts) {
  if (!ts?.toDate) return '-';
  return ts.toDate().toLocaleString('nl-NL');
}

function toCsv(rows) {
  const headers = ['Naam', 'E-mail', 'Telefoon', 'Afstand', 'Team', 'Motivatie', 'Donatie (€)', 'Datum'];
  const lines = rows.map((r) =>
    [
      r.name,
      r.email,
      r.phone,
      r.distance,
      r.team,
      (r.motivation || '').replace(/\n/g, ' '),
      r.donationAmount ?? '',
      formatDate(r.createdAt),
    ]
      .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
      .join(',')
  );
  return [headers.join(','), ...lines].join('\n');
}

function downloadCsv(rows) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mall-run-inschrijvingen-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RegistrationsTab() {
  const { registrations, loading } = useRegistrationsList();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-sans semiwide font-bold text-lg">
          Inschrijvingen {!loading && `(${registrations.length})`}
        </h2>
        {registrations.length > 0 && (
          <button
            onClick={() => downloadCsv(registrations)}
            className="bg-paper text-ink px-4 py-2 rounded font-sans semiwide font-bold text-xs"
          >
            Exporteer als CSV
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-white/50 text-sm">Laden…</p>
      ) : registrations.length === 0 ? (
        <p className="text-white/50 text-sm">Nog geen inschrijvingen binnengekomen.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-white/60 font-sans semiwide text-xs">
                <th className="py-2 pr-4">Naam</th>
                <th className="py-2 pr-4">Contact</th>
                <th className="py-2 pr-4">Afstand</th>
                <th className="py-2 pr-4">Team</th>
                <th className="py-2 pr-4">Donatie</th>
                <th className="py-2 pr-4">Datum</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id} className="border-b border-white/10 text-white align-top">
                  <td className="py-3 pr-4 font-semibold">{r.name}</td>
                  <td className="py-3 pr-4 text-white/80">
                    <div>{r.email}</div>
                    {r.phone && <div className="text-xs text-white/60">{r.phone}</div>}
                    {r.motivation && (
                      <div className="text-xs text-white/60 mt-1 max-w-xs italic">"{r.motivation}"</div>
                    )}
                  </td>
                  <td className="py-3 pr-4">{r.distance}</td>
                  <td className="py-3 pr-4">{r.team || '-'}</td>
                  <td className="py-3 pr-4">{r.donationAmount ? `€${r.donationAmount}` : '-'}</td>
                  <td className="py-3 pr-4 text-white/60 text-xs whitespace-nowrap">
                    {formatDate(r.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

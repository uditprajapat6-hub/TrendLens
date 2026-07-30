export default function TopCountriesTable({ regions }) {

    const sorted = [...regions]
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  
    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur-lg shadow-2xl p-6 mt-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Top 50 Countries
        </h2>
  
        <div className="overflow-auto">
  
          <table className="w-full">
  
          <thead className="bg-slate-800">
              <tr>
  
                <th className="text-left p-3">Rank</th>
                <th className="text-left p-3">Country</th>
                <th className="text-left p-3">Interest</th>
  
              </tr>
  
            </thead>
  
            <tbody>
  
              {sorted.map((item, index) => (
  
  <tr
  key={item.region}
  className="border-b border-slate-700 hover:bg-slate-800 transition"
>
  
                  <td className="p-3 text-slate-300">
                    #{index + 1}
                  </td>
  
                  <td className="p-3 text-slate-300">
                    {item.region}
                  </td>
  
                  <td className="p-3 font-semibold">
                    {item.score}
                  </td>
  
                </tr>
  
              ))}
  
            </tbody>
  
          </table>
  
        </div>
  
      </div>
    );
  }
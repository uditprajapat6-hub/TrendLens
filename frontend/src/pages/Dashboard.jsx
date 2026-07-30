import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import { FiSearch, FiDownload } from 'react-icons/fi'
import StatCard from "../components/StatCard";
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import exportReport from "../utils/exportReport";

function Skeleton({ className }) {
  return <div className={`skeleton ${className}`} />
}

export default function Dashboard() {
    const handleExport = () => {
        exportReport({
          keyword,
          regions,
        });
      };

  const { user } = useAuth()
  const [keyword, setKeyword] = useState(
    localStorage.getItem("keyword") || ""
  );
  
  const [searchKeyword, setSearchKeyword] = useState(
    localStorage.getItem("keyword") || ""
  );
  const [loading, setLoading] = useState(true)
  const [series, setSeries] = useState([])
  const [regions, setRegions] = useState([])
  const [related, setRelated] = useState({ top: [], rising: [] })
  const averageInterest =
  series.length > 0
    ? Math.round(series.reduce((sum, item) => sum + item.value, 0) / series.length)
    : 0

const peakInterest =
  series.length > 0
    ? Math.max(...series.map((item) => item.value))
    : 0
    const topRegion =
    regions.length > 0
      ? [...regions].sort((a, b) => b.score - a.score)[0].region
      : "No regional data";
  
  const topQuery =
    related?.top?.length > 0
      ? related.top[0].query
      : "No related queries";
  const [recentSearches, setRecentSearches] = useState([])
  const [searchStats, setSearchStats] = useState([])
  const deleteSearch = async (keyword) => {
    try {
      await api.delete(`/dashboard/history/${keyword}`)
  
      const { data } = await api.get('/dashboard/overview')
      setRecentSearches(data.recent_searches)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [overviewRes, searchStatsRes] = await Promise.all([
          api.get("/dashboard/overview"),
          api.get("/dashboard/search-stats"),
        ]);
  
        setRecentSearches(overviewRes.data.recent_searches);
        setSearchStats(searchStatsRes.data.stats);
      } catch (err) {
        console.error(err);
      }
    };
      
  
    fetchOverview();
  }, []);
  useEffect(() => {
    const savedKeyword = localStorage.getItem("keyword");
  
    if (savedKeyword && savedKeyword !== searchKeyword) {
      setKeyword(savedKeyword);
      setSearchKeyword(savedKeyword);
    }
  }, []);
  useEffect(() => {
    
        const fetchData = async () => {
          setLoading(true);
      
          try {
            const interestRes = await api.get(
              `/dashboard/interest?keyword=${searchKeyword}&days=90`
            );
            setSeries(interestRes.data.series);
          } catch (err) {
            console.error("Interest API failed", err);
            setSeries([]);
          }
      
          try {
            const regionRes = await api.get(
              `/dashboard/regions?keyword=${searchKeyword}`
            );
            setRegions(regionRes.data.regions);
          } catch (err) {
            console.error("Regions API failed", err);
            setRegions([]);
          }
      
          try {
            const relatedRes = await api.get(
              `/dashboard/related?keyword=${searchKeyword}`
            );
            setRelated(relatedRes.data);
          } catch (err) {
            console.error("Related API failed", err);
            setRelated({ top: [], rising: [] });
          }
      
          setLoading(false);
        };
      
        if (searchKeyword.trim()) {
          fetchData();
        }
      }, [searchKeyword]);
  const growthPct = useMemo(() => {
    if (series.length < 2) return 0
    const first = series[0].value
    const last = series[series.length - 1].value
    return Math.round(((last - first) / first) * 1000) / 10
  }, [series])

  return (
    
    <div className="flex">
      <Sidebar />
      <main className="flex-1 px-6 py-8 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Level {user?.level ?? 1} · {user?.xp ?? 0} XP
            </p>
          </div>
          <button
  onClick={handleExport}
  className="btn-secondary"
>
  Export report
</button>
        </div>

        <form
  onSubmit={(e) => {
    e.preventDefault();

    if (!keyword.trim()) return;

    localStorage.setItem("keyword", keyword.trim());
    setSearchKeyword(keyword.trim());
  }}
  className="glass-panel flex items-center gap-3 p-3 mb-8"
>
          <FiSearch className="ml-3 text-slate-400" />
          <input
  value={keyword}
  onChange={(e) => setKeyword(e.target.value)}
  onKeyDown={(e) => {
    console.log(e.key);

    if (e.key === "Enter") {
        e.preventDefault();
      
        if (!keyword.trim()) return;
      
        localStorage.setItem("keyword", keyword.trim());
      
        setSearchKeyword(keyword.trim());
      }
  }}
  className="flex-1 bg-transparent px-1 py-2 text-sm outline-none"
  placeholder="(e.g. electric vehicles)"
/>
        <div className="flex gap-2">
  <button
    type="submit"
    className="btn-primary !py-2 !px-5 text-sm"
  >
    Analyze
  </button>

  <button
    type="button"
    onClick={() => {
      setKeyword("")
      setSearchKeyword("")
      setSeries([])
      setRegions([])
      setRelated({ top: [], rising: [] })
    }}
    className="btn-secondary !py-2 !px-5 text-sm"
  >
    Clear
  </button>
</div>
        </form>
       
        
        <div className="glass-panel p-5 mb-8">
  <h3 className="font-display font-semibold mb-4">Recent Searches</h3>

  {recentSearches.length === 0 ? (
    <p className="text-slate-500">No recent searches.</p>
  ) : (
    <div className="flex flex-wrap gap-2">
     {recentSearches.map((item) => (
  <button
    key={item._id || item.searched_at}
    onClick={() => {
        localStorage.setItem("keyword", item.keyword);
      
        setKeyword(item.keyword);
        setSearchKeyword(item.keyword);
      }}
    className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
  >
    <span>{item.keyword}</span>

    <span
      onClick={(e) => {
        e.stopPropagation()
        deleteSearch(item.keyword)
      }}
      className="text-red-500 font-bold cursor-pointer"
    >
      ×
    </span>
  </button>
))}
    </div>
  )}
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
<StatCard label="Avg Interest" value={averageInterest} />
<StatCard label="Peak Interest" value={peakInterest} />
<StatCard label="Top Region" value={topRegion} />
<StatCard label="Top Query" value={topQuery} />
</div>


<div id="analytics-section">  

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="glass-panel p-5">
            <h3 className="font-display font-semibold mb-4">Interest over time — “{searchKeyword}”</h3>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
             
             
          
              <ResponsiveContainer width="100%" height={260}>
              <LineChart data={series}>
  <CartesianGrid strokeDasharray="3 6" />
  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />

  <Tooltip
    content={({ active, payload, label }) => {
      if (!active || !payload?.length) return null;

      return (
        <div
          style={{
            background: "#1E293B",
            border: "1px solid #3B82F6",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <p style={{ color: "#FFFFFF", margin: 0, fontWeight: "bold" }}>
            {label}
          </p>

          <p style={{ color: "#4285F4", marginTop: 5 }}>
            Interest: {payload[0].value}
          </p>
        </div>
      );
    }}
  />

  <Line
    type="monotone"
    dataKey="value"
    stroke="#4285F4"
    strokeWidth={2.5}
    dot={false}
  />
</LineChart>
                </ResponsiveContainer>
              
            )}
          </div>

          <div className="glass-panel p-5">
            <h3 className="font-display font-semibold mb-4">Interest by region</h3>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={regions}>
                  <CartesianGrid strokeDasharray="3 6" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
  dataKey="region"
  tick={{ fontSize: 10 }}
  interval={0}
  angle={-45}
  textAnchor="end"
  height={80}
/>

<Tooltip
content={({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#1E293B",
        border: "1px solid #3B82F6",
        borderRadius: "10px",
        padding: "10px",
      }}
    >
      <p style={{ color: "#FFFFFF", margin: 0, fontWeight: 600 }}>
        {label}
      </p>

      <p style={{ color: "#4285F4", margin: "6px 0 0" }}>
        Value: {payload[0].value}
      </p>
    </div>
  );
}}
/>
                  <Bar dataKey="score" fill="#34A853" radius={[6, 6, 0, 0]} />
                </BarChart>
</ResponsiveContainer>

<hr className="my-4" />

<h3 className="font-display font-semibold mb-3">
  Related Queries (Top)
</h3>

<ul className="space-y-2">
{(related?.top ?? []).slice(0, 10).map((item, index) => (
    <li
      key={index}
      className="flex justify-between border-b border-slate-200 pb-2"
    >
      <span>{item.query}</span>
      <span>{item.value}</span>
    </li>
  ))}
                  </ul>
                  <hr className="my-4" />

<h3 className="font-display font-semibold mb-3">
  Related Queries (Rising)
</h3>

<ul className="space-y-2">
{(related?.rising ?? []).slice(0, 10).map((item, index) => (
    <li
      key={index}
      className="flex justify-between border-b border-slate-200 pb-2"
    >
      <span>🔥 {item.query}</span>
      <span>{item.value}</span>
    </li>
  ))}
</ul>

  </>
)}
                      </div>
                      </div>
        </div>
        <div className="glass-panel p-5 mt-6">
  <h3 className="font-display font-semibold mb-4">
    Most Searched Keywords
  </h3>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={searchStats}>
      <CartesianGrid strokeDasharray="3 6" />
      <XAxis dataKey="keyword" />
      <YAxis />
      <Tooltip />

      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
        {searchStats.map((entry, index) => (
          <Cell
            key={index}
            fill={
              index % 4 === 0
                ? "#4285F4"
                : index % 4 === 1
                ? "#34A853"
                : index % 4 === 2
                ? "#FBBC05"
                : "#EA4335"
            }
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>
      </main>
    </div>
  )
}

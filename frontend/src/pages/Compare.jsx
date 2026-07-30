import { useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import CountUp from "react-countup";
import Chart from "react-apexcharts";
import { useEffect } from "react";
import {
    AreaChart,
    Area,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";
 
export default function Compare() {
    


    
        useEffect(() => {
            const saved = localStorage.getItem("recentComparisons");
    
            if (saved) {
                setRecentComparisons(JSON.parse(saved));
            }
        }, []);
    
    
    
  const [keyword1, setKeyword1] = useState("");
    const [keyword2, setKeyword2] = useState("");
    const [compareData, setCompareData] = useState(null);
    const [days, setDays] = useState(
        Number(localStorage.getItem("timeRange")) || 90
      );
    const [loading, setLoading] = useState(false);
    const [recentComparisons, setRecentComparisons] = useState([]);
    const handleCompare = async () => {
        console.log("Button clicked");
        
        if (!keyword1.trim() || !keyword2.trim()) {
            alert("Enter both keywords");
            return;
        }
        
      
        setLoading(true);
      
        try {
          const { data } = await api.get(
            `/dashboard/compare?keywords=${encodeURIComponent(
              `${keyword1},${keyword2}`
            )}&days=${days}`
            );
            console.log(data);
      
            setCompareData(data);
            const updated = [
                { keyword1, keyword2 },
                ...recentComparisons.filter(
                  item =>
                    !(
                      item.keyword1 === keyword1 &&
                      item.keyword2 === keyword2
                    )
                ),
              ].slice(0, 5);
              
              setRecentComparisons(updated);
              localStorage.setItem(
                "recentComparisons",
                JSON.stringify(updated)
              );
        } catch (err) {
          console.error(err);
          alert("Comparison failed");
        } finally {
          setLoading(false);
        }
      };
    const color1 = "#3B82F6"; // Blue
    const color2 = "#EF4444"; // Red
    const loadComparison = async (item) => {
        setKeyword1(item.keyword1);
        setKeyword2(item.keyword2);
      
        setLoading(true);
      
        try {
          const { data } = await api.get(
            `/dashboard/compare?keywords=${encodeURIComponent(
              `${item.keyword1},${item.keyword2}`
            )}&days=${days}`
          );
      
            setCompareData(data);
            const updated = [
                item,
                ...recentComparisons.filter(
                  x =>
                    !(x.keyword1 === item.keyword1 &&
                      x.keyword2 === item.keyword2)
                ),
              ].slice(0, 5);
              
              setRecentComparisons(updated);
              
              localStorage.setItem(
                "recentComparisons",
                JSON.stringify(updated)
              );
        } finally {
          setLoading(false);
        }
      };
    const getStats = () => {
        if (!compareData) return null;
      
        const key1 = compareData.keywords[0];
        const key2 = compareData.keywords[1];
      
        const values1 = compareData.data.map((d) => d[key1]);
        const values2 = compareData.data.map((d) => d[key2]);
      
        const max1 = Math.max(...values1);
        const max2 = Math.max(...values2);
      
        const avg1 =
          values1.reduce((a, b) => a + b, 0) / values1.length;
      
        const avg2 =
          values2.reduce((a, b) => a + b, 0) / values2.length;
         
        return {
          max1,
          max2,
          avg1: avg1.toFixed(1),
          avg2: avg2.toFixed(1),
          winner:
            avg1 > avg2
              ? key1
              : avg2 > avg1
              ? key2
              : "Tie",
        };
      };
      
    const stats = getStats();
    const chartOptions = {
        chart: {
          type: "area",
          background: "transparent",
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
            enabled: false,
          },
        theme: {
          mode: "dark",
        },
      
        stroke: {
            curve: "smooth",
            width: 4,
            lineCap: "round",
          },
      
        colors: ["#3B82F6", "#FF4D6D"],
      
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0,
            stops: [0, 100],
          },
        },
      
        grid: {
          borderColor: "#334155",
          strokeDashArray: 5,
        },
      
        xaxis: {
          categories: compareData
            ? compareData.data.map((d) => d.date)
            : [],
        },
      
        tooltip: {
            theme: "dark",
            shared: true,
            intersect: false,
            x: {
              show: true,
            },
          },
    };
    const chartSeries = compareData
? [
  {
    name: compareData.keywords[0],
    data: compareData.data.map(
      (d) => d[compareData.keywords[0]]
    ),
  },
  {
    name: compareData.keywords[1],
    data: compareData.data.map(
      (d) => d[compareData.keywords[1]]
    ),
  },
]
: [];
    const data = compareData?.data || [];
const keywords = compareData?.keywords || [];

let summary = [];

if (data.length >= 2 && keywords.length === 2) {
  const k1 = keywords[0];
  const k2 = keywords[1];

  const avg1 = data.reduce((s, d) => s + d[k1], 0) / data.length;
  const avg2 = data.reduce((s, d) => s + d[k2], 0) / data.length;

  const max1 = Math.max(...data.map(d => d[k1]));
  const max2 = Math.max(...data.map(d => d[k2]));

  summary = [
    `${avg1 > avg2 ? k1 : k2} maintained a higher average search interest.`,
    `Highest interest recorded was ${Math.max(max1, max2).toFixed(1)}.`,
    `${max1 > max2 ? k1 : k2} achieved the highest peak.`,
    `${Math.abs(avg1 - avg2).toFixed(1)} average point difference between both keywords.`
  ];
}
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Compare Keywords</h1>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="First keyword"
            value={keyword1}
            onChange={(e) => setKeyword1(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-400 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />

          <input
            type="text"
            placeholder="Second keyword"
            value={keyword2}
            onChange={(e) => setKeyword2(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-400 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        <div className="flex gap-3 mb-6">
  {[7, 30, 90, 365].map((d) => (
    <button
      key={d}
      onClick={() => {
        setDays(d);
      
        if (!keyword1.trim() || !keyword2.trim()) return;
      
        api
          .get(
            `/dashboard/compare?keywords=${encodeURIComponent(
              `${keyword1},${keyword2}`
            )}&days=${d}`
          )
          .then(({ data }) => setCompareData(data))
          .catch((err) => console.error(err));
      }}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        days === d
          ? "bg-blue-600 text-white shadow-lg"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      {d} Days
    </button>
  ))}
</div>
        <button
  onClick={handleCompare}
  className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
>
  Compare
              </button>
              <p className="text-slate-400 mt-3">
    Showing data for the last <span className="text-blue-400 font-semibold">{days}</span> days
              </p>
              {recentComparisons.length > 0 && (
  <div className="mt-6">

    <h3 className="text-sm font-semibold text-slate-400 mb-3">
      🕒 Recent Comparisons
    </h3>

    <div className="flex flex-wrap gap-3">

      {recentComparisons.map((item, index) => (
        <button
          key={index}
          onClick={() => loadComparison(item)}
          className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-700 transition"
        >
          {item.keyword1} ↔ {item.keyword2}
        </button>
      ))}

    </div>

  </div>
)}
<div className="mt-10 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
{loading ? (
<div className="animate-pulse">

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

  {[1,2,3,4,5].map((i) => (
    <div
      key={i}
      className="h-32 rounded-2xl bg-slate-800"
    />
  ))}

</div>

<div className="h-[520px] rounded-2xl bg-slate-800" />

</div>
  
) : !compareData ? (
    
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center">

<div className="text-7xl mb-6">
    📈
</div>

<h2 className="text-3xl font-bold text-white">
Compare Search Trends
</h2>

<p className="text-slate-400 mt-4 text-lg max-w-lg leading-8">
    Enter two keywords and discover their search interest,
    trends, peak popularity and detailed comparison analytics.
</p>

      </div>

  ) : (
<>{stats && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">

    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-300">
    <p className="text-gray-400 text-sm uppercase tracking-wider">
    Peak Interest
</p>
<h2 className="text-3xl font-bold text-blue-400">
<CountUp
  end={stats.max1}
  duration={2}
  decimals={1}
/>
</h2>
      <p className="text-gray-300 mt-2">
        {compareData.keywords[0]}
      </p>
    </div>

    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-300">
    <p className="text-gray-400 text-sm uppercase tracking-wider">
    Peak Interest
</p>
<h2 className="text-3xl font-bold text-red-400">
<CountUp
  end={stats.max2}
  duration={2}
  decimals={1}
/>
</h2>
      <p className="text-gray-300 mt-2">
        {compareData.keywords[1]}
      </p>
    </div>

    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-300">
    <p className="text-gray-400 text-sm uppercase tracking-wider">
    Average Interest
</p>
<h2 className="text-3xl font-bold text-cyan-400">
<CountUp
  end={Number(stats.avg1)}
  duration={2}
  decimals={1}
/>
{" / "}
<CountUp
  end={Number(stats.avg2)}
  duration={2}
  decimals={1}
/>
</h2>
    </div>

<div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 rounded-2xl p-6 border border-emerald-500/30 shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-2 transition-all duration-300">

<div className="flex items-center justify-between">
    <p className="text-gray-400 uppercase tracking-wider">
        🏆 Winner
    </p>

    <span className="text-2xl">👑</span>
</div>

<h2 className="text-4xl font-bold text-green-400 mt-4">
    {stats.winner}
</h2>

<p className="text-gray-300 mt-2">
    Higher Average Interest
</p>

<p className="text-green-400 font-semibold mt-2">
    +{Math.abs(stats.avg1 - stats.avg2).toFixed(1)} Points
</p>

</div>
<div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 rounded-2xl p-6 border border-indigo-500/30 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-300">

    <p className="text-gray-400 uppercase tracking-wider">
        📈 Difference
    </p>

    <h2 className="text-4xl font-bold text-indigo-400 mt-4">
        {Math.abs(Number(stats.avg1) - Number(stats.avg2)).toFixed(1)}
    </h2>

    <p className="text-gray-300 mt-2">
        Average Point Gap
    </p>

</div>
  </div>
  
)}
   <div className="flex items-center justify-between mb-6">

<div>
    <h2 className="text-2xl font-bold text-white">
        📈 Interest Comparison
    </h2>

    <p className="text-slate-400 mt-1">
        Search trend comparison over the last {days} days
    </p>
</div>

<div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300">
    {compareData.data.length} Data Points
</div>

</div>
     <div className="flex items-center gap-6 mb-4">
  <div className="flex items-center gap-2">
    <span
      className="w-4 h-4 rounded-full"
      style={{ backgroundColor: color1 }}
    ></span>
    <span
      className="font-semibold text-lg"
      style={{ color: color1 }}
    >
      {compareData.keywords[0]}
    </span>
  </div>

  <div className="flex items-center gap-2">
    <span
      className="w-4 h-4 rounded-full"
      style={{ backgroundColor: color2 }}
    ></span>
    <span
      className="font-semibold text-lg"
      style={{ color: color2 }}
    >
      {compareData.keywords[1]}
    </span>
  </div>
</div>

<div className="mt-10 bg-slate-950 rounded-2xl border border-slate-700 p-6">

<h2 className="text-2xl font-bold text-white mb-6">
  🚀 ApexCharts Preview
</h2>

<Chart
  options={chartOptions}
  series={chartSeries}
  type="area"
  height={550}
/>

</div>       
    <div className="mt-10 bg-slate-800 rounded-xl p-6 border border-slate-700">
  <h2 className="text-2xl font-bold text-white mb-4">
    📊 Comparison Summary
  </h2>

  <div className="space-y-3">
    {summary.map((item, index) => (
      <div
        key={index}
        className="flex items-center gap-3 bg-slate-900 rounded-lg p-4"
      >
        <span className="text-green-400 text-xl">✔</span>
        <p className="text-slate-300">{item}</p>
      </div>
    ))}
  </div>
</div>
</>
)}
</div>
      </main>
    </div>
  );
}
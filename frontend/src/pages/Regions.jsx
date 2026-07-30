import Sidebar from "../components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import FullScreenMap from "../components/Regions/FullScreenMap";
import TopCountriesTable from "../components/Regions/TopCountriesTable";
const API_URL = "https://trendlens-1.onrender.com";

const continents = [
  "All",
  "Asia",
  "Europe",
  "Africa",
  "North America",
  "South America",
  "Oceania",
];

const continentMap = {
  Asia: [
    "India","Pakistan","Bangladesh","China","Japan","South Korea","North Korea",
    "Nepal","Bhutan","Sri Lanka","Afghanistan","Iran","Iraq","Saudi Arabia",
    "United Arab Emirates","Qatar","Oman","Kuwait","Thailand","Vietnam",
    "Indonesia","Malaysia","Singapore","Philippines","Myanmar (Burma)","Cambodia","Laos"
  ],

  Europe: [
    "United Kingdom","France","Germany","Spain","Italy","Portugal","Netherlands",
    "Belgium","Switzerland","Austria","Poland","Ukraine","Norway","Sweden",
    "Finland","Denmark","Ireland","Russia"
  ],

  Africa: [
    "Egypt","Nigeria","Kenya","South Africa","Morocco","Algeria","Ethiopia",
    "Sudan","Tunisia","Ghana"
  ],

  "North America": [
    "United States",
    "Canada",
    "Mexico"
  ],

  "South America": [
    "Brazil",
    "Argentina",
    "Chile",
    "Peru",
    "Colombia",
    "Uruguay",
    "Paraguay",
    "Bolivia",
    "Ecuador"
  ],

  Oceania: [
    "Australia",
    "New Zealand"
  ]
};

export default function Regions() {

  const [regions,setRegions]=useState([]);
  const [loading,setLoading]=useState(true);
    const [continent, setContinent] = useState("All");
    const [searchCountry, setSearchCountry] = useState("");

  useEffect(()=>{

    const keyword = localStorage.getItem("keyword") || "AI";

    async function fetchRegions(){

      try{

        const response = await axios.get(
            `${API_URL}/api/dashboard/regions?keyword=${keyword}`
          );
          console.log("Keyword:", keyword);
console.log("API Response:");
console.table(response.data.regions.slice(0, 10));
          console.log("Keyword:", keyword);
console.log("Response:");
console.table(response.data.regions.slice(0, 10));
console.log(response.data.regions);
const fetchedRegions = Array.isArray(response.data)
  ? response.data
  : response.data.regions || [];

console.log("Fetched:", fetchedRegions);


setRegions(fetchedRegions);

console.table(fetchedRegions);
      }catch(err){
        console.log(err);
      }

      setLoading(false);
    }

    fetchRegions();

  },[]);

  const filteredRegions = useMemo(() => {
    let filtered = regions;
  
    // Filter by continent
    if (continent !== "All") {
      filtered = filtered.filter((r) =>
        continentMap[continent]?.includes(r.region)
      );
    }
  
    // Filter by search
    if (searchCountry.trim() !== "") {
      filtered = filtered.filter((r) =>
        r.region.toLowerCase().includes(searchCountry.toLowerCase())
      );
    }
  
    return filtered;
  }, [regions, continent, searchCountry]);
  console.log("Current Continent:", continent);
console.log("Filtered Regions:", filteredRegions);
    console.table(regions);
    console.log("Regions state:");
console.table(regions);

if (regions.length > 0) {
  console.log("Top region:", regions[0]);
}
return (
<div className="flex min-h-screen bg-slate-950">
  
    <Sidebar />
  
        <main className="flex-1 overflow-y-auto p-6">
  
        <h1 className="text-4xl font-bold text-white mb-6">
          🌍 Regions Analysis
        </h1>
  
        {/* Continent Buttons */}
  
        <div className="flex flex-wrap gap-3 mb-6">
  {continents.map((item) => (
    <button
      key={item}
      onClick={() => setContinent(item)}
      className={`px-5 py-2 rounded-xl transition-all duration-300 border
        ${
          continent === item
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg"
            : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
        }`}
    >
      {item}
    </button>
  ))}
</div>

<div className="mb-6 flex justify-end">
  <input
    type="text"
    placeholder="🔍 Search country..."
    value={searchCountry}
    onChange={(e) => setSearchCountry(e.target.value)}
    className="w-80 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{loading ? (
  <h2 className="text-white">Loading...</h2>
) : (
  <>
    <FullScreenMap regions={filteredRegions} />
    <TopCountriesTable regions={regions} />
  </>
            )}

</main>
    </div>
  );
}
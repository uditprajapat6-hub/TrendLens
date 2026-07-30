const countryNameMap = {
    "United States of America": "United States",
    "Puerto Rico": "United States",
    "Russian Federation": "Russia",
    "Czech Republic": "Czechia",
    "Turkey": "Türkiye",
    "Korea, Republic of": "South Korea",
    "Korea, Democratic People's Republic of": "North Korea",
    "United Republic of Tanzania": "Tanzania",
    "Lao People's Democratic Republic": "Laos",
    "Viet Nam": "Vietnam",
    "Syrian Arab Republic": "Syria",
    "Iran (Islamic Republic of)": "Iran",
    "Bolivia (Plurinational State of)": "Bolivia",
    "Venezuela (Bolivarian Republic of)": "Venezuela",
    "Brunei Darussalam": "Brunei",
    "Moldova, Republic of": "Moldova"
  };
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
  } from "react-simple-maps";
  import { useMemo, useState } from "react";
  
  const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
  
export default function FullScreenMap({ regions }) {
    regions = Array.isArray(regions) ? regions : [];
    const [position, setPosition] = useState({
        coordinates: [0, 0],
        zoom: 1,
      });
    const dataMap = useMemo(() => {
      const map = {};
  
      regions.forEach((item) => {
        map[item.region] = item.score;
      });
  
      return map;
    }, [regions]);
  
    const getColor = (score) => {
        if (score >= 90) return "#7f0000";   // Dark Red
        if (score >= 70) return "#b30000";   // Red
        if (score >= 50) return "#d7301f";   // Medium Red
        if (score >= 30) return "#ef6548";   // Light Red
        if (score > 0)  return "#fcbba1";    // Very Light Red
      
        return "#ECECEC";                    // No data
      };
  
    const handleZoomIn = () => {
      if (position.zoom >= 4) return;
  
      setPosition({
        ...position,
        zoom: position.zoom * 1.5,
      });
    };
    const handleReset = () => {
        setPosition({
          coordinates: [0, 0],
          zoom: 1,
        });
      };
  
    const handleZoomOut = () => {
      if (position.zoom <= 1) return;
  
      setPosition({
        ...position,
        zoom: position.zoom / 1.5,
      });
    };
    const mapWidth = 1200 * position.zoom;
const mapHeight = 700 * position.zoom;
    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur-lg shadow-2xl p-6 mb-6">
  
        <div className="flex justify-between mb-4">
  
          <h2 className="text-2xl font-semibold">
            World Map
          </h2>
  
          <div className="flex gap-2">

<button
  onClick={handleZoomIn}
  className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition"
  title="Zoom In"
>
  +
</button>

<button
  onClick={handleZoomOut}
  className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition"
  title="Zoom Out"
>
  −
</button>

<button
  onClick={handleReset}
  className="px-4 h-12 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-lg"
  title="Reset Map"
>
  Reset
</button>

</div>
  
        </div>
  
        <div
  className="overflow-auto border border-slate-700 rounded-xl"
  style={{
    width: "100%",
    height: "650px",
  }}
>
<div
  style={{
    width: `${mapWidth}px`,
    height: `${mapHeight}px`,
  }}
>
   <ComposableMap
  width={mapWidth}
  height={mapHeight}
      projectionConfig={{
        scale: 165,
      }}
    >
        <ZoomableGroup
    center={position.coordinates}
    zoom={position.zoom}
    minZoom={1}
    maxZoom={3}
    filterZoomEvent={() => false}
    onMoveEnd={({ coordinates, zoom }) =>
        setPosition({
            coordinates,
            zoom,
        })
    }
>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  
  
                  let country = geo.properties.name;

const aliases = {
  "United States of America": "United States",
  "Russian Federation": "Russia",
  "Czech Republic": "Czechia",
  "Korea, Republic of": "South Korea",
  "Korea, Democratic People's Republic of": "North Korea",
  "Viet Nam": "Vietnam",
  "Syrian Arab Republic": "Syria",
  "Lao People's Democratic Republic": "Laos",
  "United Republic of Tanzania": "Tanzania",
  "Republic of the Congo": "Congo",
  "Democratic Republic of the Congo": "DR Congo",
};

country = aliases[country] || country;

const score = dataMap[country] || 0;
  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getColor(score)}
                      stroke="#FFFFFF"
                      strokeWidth={0.4}
                      style={{
                        default: {
                          outline: "none",
                        },
                        hover: {
                          fill: "#2563eb",
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                      onClick={() =>
                        setPosition({
                          coordinates: geo.properties.centroid || [0, 20],
                          zoom: 2.5,
                        })
                      }
                    >
                      <title>
                        {country}
                        {"\n"}
                        Interest: {score}
                      </title>
                    </Geography>
                  );
                })
              }
            </Geographies>
            </ZoomableGroup>
</ComposableMap>
  </div>
</div>

</div>
);
}
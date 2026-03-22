// import { useState } from "react";
// import "./App.css";
// import NBACard from "./NBACard";

// function App() {
//   const [activePage, setActivePage] = useState("player");
//   const [playerName, setPlayerName] = useState("");
//   const [playerData, setPlayerData] = useState(null);
//   const [error, setError] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [lineupAnalysis, setLineupAnalysis] = useState(null);
//   const [lineupError, setLineupError] = useState("");
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   const [lineup, setLineup] = useState({
//     PG: null,
//     SG: null,
//     SF: null,
//     PF: null,
//     C: null,
//   });

//   const [activeSlot, setActiveSlot] = useState("PG");
//   const [lineupSearch, setLineupSearch] = useState("");
//   const [lineupSuggestions, setLineupSuggestions] = useState([]);

//   const [compareLineupA, setCompareLineupA] = useState({
//   PG: null,
//   SG: null,
//   SF: null,
//   PF: null,
//   C: null,
// });

//   const [compareLineupB, setCompareLineupB] = useState({
//   PG: null,
//   SG: null,
//   SF: null,
//   PF: null,
//   C: null,
// });

//   const [activeCompareSide, setActiveCompareSide] = useState("A");
//   const [activeCompareSlot, setActiveCompareSlot] = useState("PG");
//   const [compareSearch, setCompareSearch] = useState("");
//   const [compareSuggestions, setCompareSuggestions] = useState([]);

//   const handlePlayerSearch = async () => {
//     try {
//       setError("");
//       setPlayerData(null);

//       const response = await fetch(
//         `http://127.0.0.1:5000/player?name=${encodeURIComponent(playerName)}`
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.error || "Something went wrong");
//         return;
//       }

//       setPlayerData(data);
//       setSuggestions([]);
//     } catch {
//       setError("Could not connect to backend");
//     }
//   };

//   const handlePlayerInputChange = async (e) => {
//     const value = e.target.value;
//     setPlayerName(value);

//     if (value.length < 3) {
//       setSuggestions([]);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:5000/players?search=${encodeURIComponent(value)}`
//       );

//       const data = await response.json();
//       setSuggestions(data);
//     } catch {
//       setSuggestions([]);
//     }
//   };

//   const handleAnalyzeLineup = async () => {
//   try {
//     setLineupError("");
//     setLineupAnalysis(null);

//     const hasEmptySlot = Object.values(lineup).some((p) => p === null);

//     if (hasEmptySlot) {
//       setLineupError("Please fill all five positions before analyzing.");
//       return;
//     }

//     setIsAnalyzing(true);

//     const response = await fetch("http://127.0.0.1:5000/analyze-lineup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ lineup })
//     });

//     const data = await response.json();

//     setLineupAnalysis(data);

//   } catch {
//     setLineupError("Could not connect to backend");
//   } finally {
//     setIsAnalyzing(false);
//   }
// };

//   const handleLineupInputChange = async (e) => {
//     const value = e.target.value;
//     setLineupSearch(value);

//     if (value.length < 3) {
//       setLineupSuggestions([]);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:5000/players?search=${encodeURIComponent(value)}`
//       );

//       const data = await response.json();
//       setLineupSuggestions(data);
//     } catch {
//       setLineupSuggestions([]);
//     }
//   };

//   const handleSelectLineupPlayer = async (playerName) => {
//     try {
//       const response = await fetch(
//         `http://127.0.0.1:5000/player?name=${encodeURIComponent(playerName)}`
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         return;
//       }

//       setLineup((prev) => ({
//         ...prev,
//         [activeSlot]: data,
//       }));

//       setLineupSearch("");
//       setLineupSuggestions([]);
//     } catch {
//       console.log("Could not load player");
//     }
//   };

//   const clearSlot = (slot) => {
//     setLineup((prev) => ({
//       ...prev,
//       [slot]: null,
//     }));
//   };

//   return (
//     <div className="app">
//       <nav className="navbar">
//         <div className="brand">NBA Lineup Analyzer</div>

//         <div className="nav-links">
//           <button
//             className={activePage === "player" ? "active" : ""}
//             onClick={() => setActivePage("player")}
//           >
//             Player Lookup
//           </button>

//           <button
//             className={activePage === "lineup" ? "active" : ""}
//             onClick={() => setActivePage("lineup")}
//           >
//             Lineup Builder
//           </button>

//           <button
//             className={activePage === "compare" ? "active" : ""}
//             onClick={() => setActivePage("compare")}
//           >
//             Compare Lineups
//           </button>
//         </div>
//       </nav>

//       <main className="page-content">
//         {activePage === "player" && (
//           <section className="page-section">
//             <h1>Player Lookup</h1>
//             <p>Search for a player and view current season stats.</p>

//             <div className="player-search">
//               <input
//                 type="text"
//                 placeholder="Enter player name..."
//                 value={playerName}
//                 onChange={handlePlayerInputChange}
//               />
//               <button onClick={handlePlayerSearch}>Search</button>
//             </div>

//             {suggestions.length > 0 && (
//               <div className="suggestions">
//                 {suggestions.map((p) => (
//                   <div
//                     key={p.id}
//                     className="suggestion-item"
//                     onClick={() => {
//                       setPlayerName(p.name);
//                       setSuggestions([]);
//                     }}
//                   >
//                     {p.name}
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="player-results">
//               {error && <p>{error}</p>}
//               {!error && !playerData && <p>No player selected.</p>}
//               {playerData && <NBACard player={playerData} />}
//             </div>
//           </section>
//         )}

//         {activePage === "lineup" && (
//           <section className="page-section">
//             <h1>Lineup Builder</h1>
//             <p>Click a position, search for a player, and build your lineup.</p>

//             <div className="lineup-builder-layout">
//               <div className="lineup-slots">
//                 {Object.entries(lineup).map(([position, player]) => (
//                   <div
//                     key={position}
//                     className={`lineup-slot ${activeSlot === position ? "slot-active" : ""}`}
//                     onClick={() => setActiveSlot(position)}
//                   >
//                     <div className="lineup-slot-top">
//                       <span className="slot-position">{position}</span>
//                       {player && (
//                         <button
//                           className="slot-clear"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             clearSlot(position);
//                           }}
//                         >
//                           ×
//                         </button>
//                       )}
//                     </div>

//                     <div className="slot-player">
//                       {player ? player.name : "Empty"}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="lineup-search-panel">
//                 <h2>Selected Position: {activeSlot}</h2>

//                 <div className="player-search">
//                   <input
//                     type="text"
//                     placeholder={`Search player for ${activeSlot}...`}
//                     value={lineupSearch}
//                     onChange={handleLineupInputChange}
//                   />
//                 </div>

//                 {lineupSuggestions.length > 0 && (
//                   <div className="suggestions">
//                     {lineupSuggestions.map((p) => (
//                       <div
//                         key={p.id}
//                         className="suggestion-item"
//                         onClick={() => handleSelectLineupPlayer(p.name)}
//                       >
//                         {p.name}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <button className="analyze-button" onClick={handleAnalyzeLineup}>
//                   Analyze Lineup
//                 </button>

//                 {lineupError && <p className="lineup-error">{lineupError}</p>}

//                 {isAnalyzing && <p className="analysis-loading">Analyzing lineup...</p>}
                
//                 {lineupAnalysis && (
//                 <div className="analysis-panel">
//                   <h2>Lineup Analysis</h2>

//                   <div className="analysis-scores">
//                     <p>Offense: {lineupAnalysis.offense.offense_score}</p>
//                     <p>Defense: {lineupAnalysis.defense.defense_score}</p>
//                     <p>Overall: {lineupAnalysis.overall.overall_score}</p>
//                   </div>

//                   <h3>Identity</h3>
//                   <p>{lineupAnalysis.insights.identity}</p>

//                   <h3>Strengths</h3>
//                   {lineupAnalysis.insights.strengths.length > 0 ? (
//                     <ul>
//                       {lineupAnalysis.insights.strengths.map((s, i) => (
//                         <li key={i}>{s}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No major strengths detected.</p>
//                   )}

//                   <h3>Weaknesses</h3>
//                   {lineupAnalysis.insights.weaknesses.length > 0 ? (
//                     <ul>
//                       {lineupAnalysis.insights.weaknesses.map((w, i) => (
//                         <li key={i}>{w}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No major weaknesses detected.</p>
//                   )}
//                 </div>
//               )}

//                 <div className="lineup-preview">
//                   {lineup[activeSlot] ? (
//                     <NBACard player={lineup[activeSlot]} />
//                   ) : (
//                     <p>No player selected for {activeSlot}.</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}

//         {activePage === "compare" && (
//   <section className="page-section">

//     <h1>Compare Lineups</h1>
//     <p>Compare two lineups and identify key advantages.</p>

//     <div className="compare-layout">

//       {/* Lineup A */}
//       <div className="compare-lineup">
//         <h2>Lineup A</h2>

//         {Object.entries(compareLineupA).map(([position, player]) => (
//           <div
//             key={position}
//             className="lineup-slot"
//             onClick={() => {
//               setActiveCompareSide("A");
//               setActiveCompareSlot(position);
//             }}
//           >
//             <span className="slot-position">{position}</span>
//             <div>{player ? player.name : "Empty"}</div>
//           </div>
//         ))}
//       </div>

//       {/* Lineup B */}
//       <div className="compare-lineup">
//         <h2>Lineup B</h2>

//         {Object.entries(compareLineupB).map(([position, player]) => (
//           <div
//             key={position}
//             className="lineup-slot"
//             onClick={() => {
//               setActiveCompareSide("B");
//               setActiveCompareSlot(position);
//             }}
//           >
//             <span className="slot-position">{position}</span>
//             <div>{player ? player.name : "Empty"}</div>
//           </div>
//         ))}
//       </div>


//       {/* Player Search */}
//       <div className="compare-search-panel">
//         <h3>
//           Selected: {activeCompareSide} — {activeCompareSlot}
//         </h3>

//         <input
//           type="text"
//           placeholder="Search player..."
//           value={compareSearch}
//           onChange={handleCompareInputChange}
//         />

//         {compareSuggestions.length > 0 && (
//           <div className="suggestions">
//             {compareSuggestions.map((p) => (
//               <div
//                 key={p.id}
//                 className="suggestion-item"
//                 onClick={() => handleSelectComparePlayer(p.name)}
//               >
//                 {p.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//     </div>

//   </section>
// )}
//       </main>
//     </div>
//   );
// }

// const handleCompareInputChange = async (e) => {
//   const value = e.target.value;
//   setCompareSearch(value);

//   if (value.length < 3) {
//     setCompareSuggestions([]);
//     return;
//   }

//   try {
//     const response = await fetch(
//       `http://127.0.0.1:5000/players?search=${encodeURIComponent(value)}`
//     );

//     const data = await response.json();
//     setCompareSuggestions(data);
//   } catch {
//     setCompareSuggestions([]);
//   }
// };

// const handleSelectComparePlayer = async (playerName) => {
//   try {
//     const response = await fetch(
//       `http://127.0.0.1:5000/player?name=${encodeURIComponent(playerName)}`
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       return;
//     }

//     if (activeCompareSide === "A") {
//       setCompareLineupA((prev) => ({
//         ...prev,
//         [activeCompareSlot]: data,
//       }));
//     } else {
//       setCompareLineupB((prev) => ({
//         ...prev,
//         [activeCompareSlot]: data,
//       }));
//     }

//     setCompareSearch("");
//     setCompareSuggestions([]);
//   } catch {
//     console.log("Could not load compare player");
//   }
// };

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import PlayerSearchPage from "./pages/PlayerSearchPage";
import ComparePlayersPage from "./pages/ComparePlayersPage";
import LineupAnalyzePage from "./pages/LineupBuilderPage";
import CompareLineupsPage from "./pages/CompareLineupsPage";
import RosterBuilderPage from "./pages/RosterBuilderPage";
import MinutesSimulationPage from "./pages/MinutesSimulationPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players/search" element={<PlayerSearchPage />} />
            <Route path="/players/compare" element={<ComparePlayersPage />} />
            <Route path="/lineups/analyze" element={<LineupAnalyzePage />} />
            <Route path="/lineups/compare" element={<CompareLineupsPage />} />
            <Route path="/roster/build" element={<RosterBuilderPage />} />
            <Route path="/roster/simulate" element={<MinutesSimulationPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
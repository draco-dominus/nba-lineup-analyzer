// import { useState } from "react";
// import NBACard from "../NBACard";

// function LineupAnalyzePage() {
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
//   const isLineupComplete = Object.values(lineup).every((player) => player !== null

//   const handleAnalyzeLineup = async () => {
//   try {
//     setLineupError("");
//     setLineupAnalysis(null);
//     setIsAnalyzing(true);

//     const response = await fetch("import.meta.env.VITE_API_URL/analyze-lineup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ lineup }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       setLineupError(data.error || "Something went wrong");
//       return;
//     }

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
//         `import.meta.env.VITE_API_URL/players?search=${encodeURIComponent(value)}`
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
//         `import.meta.env.VITE_API_URL/player?name=${encodeURIComponent(playerName)}`
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
//     <section className="page-section">
//       <h1>Analyze Lineup</h1>
//       <p>Click a position, search for a player, and build your lineup.</p>

//       <div className="lineup-builder-layout">
//         <div className="lineup-slots">
//           {Object.entries(lineup).map(([position, player]) => (
//             <div
//               key={position}
//               className={`lineup-slot ${activeSlot === position ? "slot-active" : ""}`}
//               onClick={() => setActiveSlot(position)}
//             >
//               <div className="lineup-slot-top">
//                 <span className="slot-position">{position}</span>
//                 {player && (
//                   <button
//                     className="slot-clear"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       clearSlot(position);
//                     }}
//                   >
//                     ×
//                   </button>
//                 )}
//               </div>

//               <div className="slot-player">
//                 {player ? player.name : "Empty"}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="lineup-search-panel">
//           <h2>Selected Position: {activeSlot}</h2>

//           <div className="player-search">
//             <input
//               type="text"
//               placeholder={`Search player for ${activeSlot}...`}
//               value={lineupSearch}
//               onChange={handleLineupInputChange}
//             />
//           </div>

//           {lineupSuggestions.length > 0 && (
//             <div className="suggestions">
//               {lineupSuggestions.map((p) => (
//                 <div
//                   key={p.id}
//                   className="suggestion-item"
//                   onClick={() => handleSelectLineupPlayer(p.name)}
//                 >
//                   {p.name}
//                 </div>
//               ))}
//             </div>
//           )}

//           {isLineupComplete && (
//             <button className="analyze-button" onClick={handleAnalyzeLineup}>
//                 Analyze Lineup
//             </button>
//             )}

//           {lineupError && <p className="lineup-error">{lineupError}</p>}
//           {isAnalyzing && <p className="analysis-loading">Analyzing lineup...</p>}

//           {lineupAnalysis && (
//             <div className="analysis-panel">
//               <h2>Lineup Analysis</h2>

//               <div className="analysis-scores">
//                 <p>Offense: {lineupAnalysis.offense.offense_score}</p>
//                 <p>Defense: {lineupAnalysis.defense.defense_score}</p>
//                 <p>Overall: {lineupAnalysis.overall.overall_score}</p>
//               </div>

//               <h3>Identity</h3>
//               <p>{lineupAnalysis.insights.identity}</p>

//               <h3>Strengths</h3>
//               {lineupAnalysis.insights.strengths.length > 0 ? (
//                 <ul>
//                   {lineupAnalysis.insights.strengths.map((s, i) => (
//                     <li key={i}>{s}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No major strengths detected.</p>
//               )}

//               <h3>Weaknesses</h3>
//               {lineupAnalysis.insights.weaknesses.length > 0 ? (
//                 <ul>
//                   {lineupAnalysis.insights.weaknesses.map((w, i) => (
//                     <li key={i}>{w}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No major weaknesses detected.</p>
//               )}
//             </div>
//           )}

//           <div className="lineup-preview">
//             {lineup[activeSlot] ? (
//               <NBACard player={lineup[activeSlot]} />
//             ) : (
//               <p>No player selected for {activeSlot}.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default LineupAnalyzePage;

import { useState } from "react";
import PlayerCard from "../NBACard";

function LineupBuilderPage() {
  const [lineup, setLineup] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const allPlayers = [
    {
      id: 2544,
      name: "LeBron James",
      pts: 25.3,
      ast: 8.3,
      reb: 7.1,
      stl: 1.2,
      blk: 0.6,
      fg3_pct: 0.387,
    },
    {
      id: 201939,
      name: "Stephen Curry",
      pts: 26.4,
      ast: 5.1,
      reb: 4.5,
      stl: 0.7,
      blk: 0.4,
      fg3_pct: 0.408,
    },
    {
      id: 203999,
      name: "Nikola Jokic",
      pts: 29.6,
      ast: 10.2,
      reb: 12.7,
      stl: 1.8,
      blk: 0.9,
      fg3_pct: 0.359,
    },
  ];

  const addToLineup = (player) => {
    if (lineup.length >= 5) return;

    if (lineup.find((p) => p.id === player.id)) return;

    setLineup([...lineup, player]);
  };

  const removeFromLineup = (id) => {
    setLineup(lineup.filter((p) => p.id !== id));
  };

  const analyzeLineup = async () => {
    try {
      setError("");
      setAnalysis(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/analyze-lineup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lineup }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setAnalysis(data);
    } catch {
      setError("Could not connect to backend");
    }
  };

  return (
    <section className="page-section">
      <h1>Lineup Builder</h1>
      <p>Click players to build your lineup.</p>

      <div className="lineup-page">
        {/* LEFT: Players */}
        <div className="player-browser">
          <h2>Players</h2>

          {allPlayers.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              onClick={() => addToLineup(p)}
            />
          ))}
        </div>

        {/* RIGHT: Lineup */}
        <div className="lineup">
          <h2>Your Lineup</h2>

          {lineup.length === 0 && <p>No players added yet.</p>}

          {lineup.map((p) => (
            <div key={p.id}>
              {p.name}
              <button onClick={() => removeFromLineup(p.id)}>
                Remove
              </button>
            </div>
          ))}

          {lineup.length > 0 && (
            <button onClick={analyzeLineup}>
              Analyze Lineup
            </button>
          )}

          {error && <p>{error}</p>}

          {analysis && (
            <div>
              <h3>Analysis</h3>
              <p>Offense: {analysis.offense?.offense_score}</p>
              <p>Defense: {analysis.defense?.defense_score}</p>
              <p>Overall: {analysis.overall?.overall_score}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LineupBuilderPage;
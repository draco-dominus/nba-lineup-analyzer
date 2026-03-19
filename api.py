from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats, leaguedashplayerstats


def search_player(name):

    results = players.find_players_by_full_name(name)

    if len(results) == 0:
        return None

    player = results[0]
    player_id = player["id"]

    career = playercareerstats.PlayerCareerStats(player_id=player_id)
    df = career.get_data_frames()[0]

    latest_season = df.iloc[-1]
    games_played = latest_season["GP"]

    if games_played == 0:
        return None

    return {
    "id": player_id,
    "name": player["full_name"],
    "pts": round(latest_season["PTS"] / games_played, 1),
    "ast": round(latest_season["AST"] / games_played, 1),
    "reb": round(latest_season["REB"] / games_played, 1),
    "stl": round(latest_season["STL"] / games_played, 1),
    "blk": round(latest_season["BLK"] / games_played, 1),
    "fg3m": round(latest_season["FG3M"] / games_played, 1),
    "fg3_pct": round(latest_season["FG3_PCT"], 3)
}


def search_players(query):
    results = players.find_players_by_full_name(query)

    filtered = []

    query_lower = query.lower()

    for p in results:
        name_lower = p["full_name"].lower()

        if not p["is_active"]:
            continue

        if query_lower not in name_lower:
            continue

        filtered.append({
            "id": p["id"],
            "name": p["full_name"]
        })

    filtered.sort(key=lambda p: p["name"].lower().startswith(query_lower), reverse=True)

    return filtered[:5]

def get_top_players(limit=12, season="2024-25"):
    featured_players = [
        {"id": 1628983, "name": "Shai Gilgeous-Alexander", "team": "OKC", "position": "G", "pts": 32.7, "reb": 5.0, "ast": 6.4},
        {"id": 1641705, "name": "Victor Wembanyama", "team": "SAS", "position": "C", "pts": 24.3, "reb": 11.0, "ast": 3.7},
        {"id": 203999, "name": "Nikola Jokic", "team": "DEN", "position": "C", "pts": 29.6, "reb": 12.7, "ast": 10.2},
        {"id": 1629029, "name": "Luka Doncic", "team": "LAL", "position": "G", "pts": 28.2, "reb": 8.2, "ast": 7.7},
        {"id": 1630595, "name": "Cade Cunningham", "team": "DET", "position": "G", "pts": 25.7, "reb": 6.1, "ast": 9.2},
        {"id": 1630162, "name": "Anthony Edwards", "team": "MIN", "position": "G", "pts": 27.6, "reb": 5.7, "ast": 4.5},
        {"id": 203507, "name": "Giannis Antetokounmpo", "team": "MIL", "position": "F", "pts": 30.4, "reb": 11.9, "ast": 6.5},
        {"id": 1628369, "name": "Jayson Tatum", "team": "BOS", "position": "F", "pts": 26.8, "reb": 8.7, "ast": 6.0},
        {"id": 2544, "name": "LeBron James", "team": "LAL", "position": "F", "pts": 25.3, "reb": 7.1, "ast": 8.3},
        {"id": 201939, "name": "Stephen Curry", "team": "GSW", "position": "G", "pts": 26.4, "reb": 4.5, "ast": 5.1},
        {"id": 201142, "name": "Kevin Durant", "team": "HOU", "position": "F", "pts": 26.6, "reb": 6.0, "ast": 4.2},
        {"id": 1628378, "name": "Donovan Mitchell", "team": "CLE", "position": "G", "pts": 26.1, "reb": 5.1, "ast": 6.1},
    ]

    return featured_players[:limit]


from nba_api.stats.endpoints import commonplayerinfo


def get_all_active_players():
    all_players = players.get_players()
    active_players = []

    active_only = [p for p in all_players if p["is_active"]][:100]

    for p in active_only:
        try:
            info = commonplayerinfo.CommonPlayerInfo(player_id=p["id"])
            df = info.get_data_frames()[0]

            active_players.append({
                "id": p["id"],
                "name": p["full_name"],
                "team": df.iloc[0]["TEAM_ABBREVIATION"],
                "position": df.iloc[0]["POSITION"]
            })

        except:
            continue

    active_players.sort(key=lambda p: p["name"])

    return active_players
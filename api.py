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

def get_top_players(limit=50, season="2024-25"):
    stats = leaguedashplayerstats.LeagueDashPlayerStats(
        season=season,
        season_type_all_star="Regular Season",
        per_mode_detailed="PerGame"
    )

    df = stats.get_data_frames()[0]

    # Keep only active players and sort by points per game
    df = df.sort_values("PTS", ascending=False).head(limit)

    players_list = []

    for _, row in df.iterrows():
        players_list.append({
            "id": int(row["PLAYER_ID"]),
            "name": row["PLAYER_NAME"],
            "team": row["TEAM_ABBREVIATION"],
            "pts": round(float(row["PTS"]), 1),
            "reb": round(float(row["REB"]), 1),
            "ast": round(float(row["AST"]), 1),
        })

    return players_list


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
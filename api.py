from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats


from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats


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
        "blk": round(latest_season["BLK"] / games_played, 1)
    }
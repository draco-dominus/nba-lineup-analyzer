def calculate_offense_score(lineup):

    total_points = 0
    total_assists = 0

    for player in lineup.values():
        total_points += player["pts"]
        total_assists += player["ast"]

    offense_score = total_points + total_assists

    return {
        "points": round(total_points, 1),
        "assists": round(total_assists, 1),
        "offense_score": round(offense_score, 1)
    }


def calculate_defense_score(lineup):

    total_steals = 0
    total_blocks = 0
    total_rebounds = 0

    for player in lineup.values():
        total_steals += player["stl"]
        total_blocks += player["blk"]
        total_rebounds += player["reb"]

    defense_score = (total_steals * 3) + (total_blocks * 3) + (total_rebounds * 1.5)

    return {
        "steals": round(total_steals, 1),
        "blocks": round(total_blocks, 1),
        "rebounds": round(total_rebounds, 1),
        "defense_score": round(defense_score, 1)
    }


def calculate_overall_score(lineup):

    offense = calculate_offense_score(lineup)
    defense = calculate_defense_score(lineup)

    overall_score = offense["offense_score"] + defense["defense_score"]

    return {
        "overall_score": round(overall_score, 1)
    }
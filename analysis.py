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


def analyze_strengths_weaknesses(lineup):

    offense = calculate_offense_score(lineup)
    defense = calculate_defense_score(lineup)

    strengths = []
    weaknesses = []

    # Offensive evaluation
    if offense["offense_score"] > 120:
        strengths.append("Strong scoring lineup")

    if offense["assists"] > 25:
        strengths.append("Good playmaking")

    if offense["offense_score"] < 100:
        weaknesses.append("Limited offensive production")

    # Defensive evaluation
    if defense["defense_score"] > 80:
        strengths.append("Strong defensive presence")

    if defense["defense_score"] < 70:
        weaknesses.append("Weak overall defense")

    if defense["rebounds"] < 32:
        weaknesses.append("Below-average rebounding")

    if defense["blocks"] < 3:
        weaknesses.append("Limited rim protection")

    # NEW: Lineup identity classification
    lineup_identity = "Balanced lineup"

    if offense["offense_score"] - defense["defense_score"] > 30:
        lineup_identity = "Offensive-heavy lineup"

    elif defense["defense_score"] - offense["offense_score"] > 30:
        lineup_identity = "Defensive lineup"

    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "identity": lineup_identity
    }


def compare_lineups(lineup_a, lineup_b):

    overall_a = calculate_overall_score(lineup_a)
    overall_b = calculate_overall_score(lineup_b)

    score_a = overall_a["overall_score"]
    score_b = overall_b["overall_score"]

    if score_a > score_b:
        winner = "Lineup A"
    elif score_b > score_a:
        winner = "Lineup B"
    else:
        winner = "Tie"

    return {
        "lineup_a_score": score_a,
        "lineup_b_score": score_b,
        "winner": winner
    }
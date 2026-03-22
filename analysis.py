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

    # Spacing evaluation
    spacing_shooters = 0

    for player in lineup.values():
        if player.get("fg3_pct", 0) >= 0.35 and player.get("fg3m", 0) >= 1.5:
            spacing_shooters += 1

    if spacing_shooters >= 4:
        strengths.append("Excellent spacing")

    elif spacing_shooters <= 1:
        weaknesses.append("Poor floor spacing")

     # Lineup identity classification
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

    offense_a = calculate_offense_score(lineup_a)
    offense_b = calculate_offense_score(lineup_b)

    defense_a = calculate_defense_score(lineup_a)
    defense_b = calculate_defense_score(lineup_b)

    overall_a = calculate_overall_score(lineup_a)
    overall_b = calculate_overall_score(lineup_b)

    offense_score_a = offense_a["offense_score"]
    offense_score_b = offense_b["offense_score"]

    defense_score_a = defense_a["defense_score"]
    defense_score_b = defense_b["defense_score"]

    overall_score_a = overall_a["overall_score"]
    overall_score_b = overall_b["overall_score"]

    if offense_score_a > offense_score_b:
        offense_advantage = "Lineup A"
    elif offense_score_b > offense_score_a:
        offense_advantage = "Lineup B"
    else:
        offense_advantage = "Tie"

    if defense_score_a > defense_score_b:
        defense_advantage = "Lineup A"
    elif defense_score_b > defense_score_a:
        defense_advantage = "Lineup B"
    else:
        defense_advantage = "Tie"

    if overall_score_a > overall_score_b:
        winner = "Lineup A"
    elif overall_score_b > overall_score_a:
        winner = "Lineup B"
    else:
        winner = "Tie"

    offense_gap = round(abs(offense_score_a - offense_score_b), 1)
    defense_gap = round(abs(defense_score_a - defense_score_b), 1)

    if offense_gap > defense_gap:
        key_area = "Offense"
        key_gap = offense_gap
        key_team = offense_advantage
    elif defense_gap > offense_gap:
        key_area = "Defense"
        key_gap = defense_gap
        key_team = defense_advantage
    else:
        key_area = "Balanced"
        key_gap = offense_gap
        key_team = "Neither"

    return {
        "lineup_a_offense": offense_score_a,
        "lineup_b_offense": offense_score_b,
        "lineup_a_defense": defense_score_a,
        "lineup_b_defense": defense_score_b,
        "lineup_a_score": overall_score_a,
        "lineup_b_score": overall_score_b,
        "offense_advantage": offense_advantage,
        "defense_advantage": defense_advantage,
        "winner": winner,
        "key_area": key_area,
        "key_gap": key_gap,
        "key_team": key_team
    }


def analyze_lineup(lineup):
    offense = calculate_offense_score(lineup)
    defense = calculate_defense_score(lineup)
    overall = calculate_overall_score(lineup)
    insights = analyze_strengths_weaknesses(lineup)

    return {
        "offense": offense,
        "defense": defense,
        "overall": overall,
        "insights": insights
    }
from api import search_player
from utils import get_empty_positions, print_lineup
from analysis import (
    calculate_offense_score,
    calculate_defense_score,
    calculate_overall_score,
    analyze_strengths_weaknesses,
    compare_lineups
)


def build_lineup():

    lineup = {
        "PG": None,
        "SG": None,
        "SF": None,
        "PF": None,
        "C": None
    }

    while None in lineup.values():

        print_lineup(lineup)

        available_positions = get_empty_positions(lineup)
        print("\nAvailable positions:", available_positions)

        position = input("Choose a position: ").upper()

        if position not in available_positions:
            print("Invalid position. Try again.")
            continue

        player_name = input("Enter player name: ")
        player_data = search_player(player_name)

        if player_data is None:
            print("Player not found. Try again.")
            continue

        lineup[position] = player_data

    return lineup


def analyze_single_lineup(lineup):

    print("\nFinal Lineup:")
    print_lineup(lineup)

    offense = calculate_offense_score(lineup)
    print("\nLineup Offense Analysis")
    print("-----------------------")
    print("Total Points:", offense["points"])
    print("Total Assists:", offense["assists"])
    print("Offense Score:", offense["offense_score"])

    defense = calculate_defense_score(lineup)
    print("\nLineup Defense Analysis")
    print("-----------------------")
    print("Total Steals:", defense["steals"])
    print("Total Blocks:", defense["blocks"])
    print("Total Rebounds:", defense["rebounds"])
    print("Defense Score:", defense["defense_score"])

    overall = calculate_overall_score(lineup)
    print("\nLineup Overall Rating")
    print("---------------------")
    print("Overall Score:", overall["overall_score"])

    insights = analyze_strengths_weaknesses(lineup)

    print("\nLineup Strengths")
    print("----------------")
    if len(insights["strengths"]) == 0:
        print("No major strengths detected")
    else:
        for s in insights["strengths"]:
            print("-", s)

    print("\nLineup Weaknesses")
    print("-----------------")
    if len(insights["weaknesses"]) == 0:
        print("No major weaknesses detected")
    else:
        for w in insights["weaknesses"]:
            print("-", w)

    print("\nLineup Identity")
    print("----------------")
    print(insights["identity"])


def main():

    print("NBA Lineup Analyzer")
    print("-------------------")
    print("1. Analyze one lineup")
    print("2. Compare two lineups")

    choice = input("Choose an option: ")

    if choice == "1":
        lineup = build_lineup()
        analyze_single_lineup(lineup)

    elif choice == "2":
        print("\nBuild Lineup A")
        lineup_a = build_lineup()

        print("\nBuild Lineup B")
        lineup_b = build_lineup()

        result = compare_lineups(lineup_a, lineup_b)

        print("\nLineup Comparison")
        print("-----------------")
        print("Lineup A Score:", result["lineup_a_score"])
        print("Lineup B Score:", result["lineup_b_score"])
        print("Winner:", result["winner"])

    else:
        print("Invalid option. Please restart and choose 1 or 2.")


if __name__ == "__main__":
    main()
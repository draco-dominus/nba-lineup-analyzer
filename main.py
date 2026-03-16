from api import search_player
from utils import print_header, get_empty_positions, print_lineup, choose_position
from analysis import calculate_offense_score, calculate_defense_score, calculate_overall_score

def main():

    from api import search_player
from utils import get_empty_positions, print_lineup, choose_position


def main():

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

        position = choose_position(available_positions)

        player_name = input("Enter player name: ")

        player_data = search_player(player_name)

        lineup[position] = player_data

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


if __name__ == "__main__":
    main()
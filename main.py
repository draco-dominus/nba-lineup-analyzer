from api import search_player
from analysis import analyze_lineup
from utils import print_header
from utils import get_empty_positions
from utils import get_empty_positions, print_lineup
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

        lineup[position] = player_name

    print("\nFinal Lineup:")
    print_lineup(lineup)


if __name__ == "__main__":
    main()
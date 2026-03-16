def print_header(title):
    print(f"\n=== {title} ===\n")


# Returns a list of lineup positions that do not yet have a player assigned
# Input: lineup dictionary with positions as keys
# Output: list of positions where the value is None
def get_empty_positions(lineup):
    empty_positions = []

    for position in lineup:
        if lineup[position] is None:
            empty_positions.append(position)

    return empty_positions


# Prints the lineup in a clean, readable format
def print_lineup(lineup):

    print("\nCurrent Lineup")
    print("--------------")

    for position, player in lineup.items():

        if player is None:
            print(f"{position}: Empty")
        else:
            print(f"{position}: {player['name']}")


# Ask the user to choose a position from the available ones
# Keeps asking until a valid position is entered
def choose_position(available_positions):

    while True:

        print(f"\nAvailable positions: {', '.join(available_positions)}")

        user_choice = input("Choose a position: ").upper()

        if user_choice in available_positions:
            return user_choice
        else:
            print("Invalid position. Please choose from the available positions.")


def search_players(query):

    results = players.find_players_by_full_name(query)

    player_list = []

    for p in results[:5]:
        player_list.append({
            "id": p["id"],
            "name": p["full_name"]
        })

    return player_list
from flask import Flask, request, jsonify
from flask_cors import CORS
from api import search_player, search_players, get_top_players
from analysis import analyze_lineup, compare_lineups

app = Flask(__name__)
CORS(app)

@app.route("/player", methods=["GET"])
def get_player():
    name = request.args.get("name")

    if not name:
        return jsonify({"error": "Missing player name"}), 400

    player = search_player(name)

    if player is None:
        return jsonify({"error": "Player not found"}), 404

    return jsonify(player)

@app.route("/players/all", methods=["GET"])
def get_all_players_route():
    players_list = get_top_players(limit=50)
    return jsonify(players_list)

@app.route("/analyze-lineup", methods=["POST"])
def analyze_lineup_route():
    data = request.get_json()

    if not data or "lineup" not in data:
        return jsonify({"error": "Missing lineup data"}), 400

    lineup = data["lineup"]
    result = analyze_lineup(lineup)

    return jsonify(result)

@app.route("/compare-lineups", methods=["POST"])
def compare_lineups_route():
    data = request.get_json()

    if not data or "lineup_a" not in data or "lineup_b" not in data:
        return jsonify({"error": "Missing lineup data"}), 400

    lineup_a = data["lineup_a"]
    lineup_b = data["lineup_b"]

    result = compare_lineups(lineup_a, lineup_b)
    return jsonify(result)


@app.route("/players/all", methods=["GET"])
def get_all_players():
    players_list = get_all_active_players()
    return jsonify(players_list)

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
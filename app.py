from flask import Flask, request, jsonify
from flask_cors import CORS
from api import search_player, search_players
from analysis import analyze_lineup

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

@app.route("/players", methods=["GET"])
def get_players():
    query = request.args.get("search")

    if not query:
        return jsonify([])

    results = search_players(query)
    return jsonify(results)

@app.route("/analyze-lineup", methods=["POST"])
def analyze_lineup_route():
    data = request.get_json()

    if not data or "lineup" not in data:
        return jsonify({"error": "Missing lineup data"}), 400

    lineup = data["lineup"]
    result = analyze_lineup(lineup)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
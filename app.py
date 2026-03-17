from flask import Flask, request, jsonify
from flask_cors import CORS
from api import search_player

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


if __name__ == "__main__":
    app.run(debug=True, port=5000)
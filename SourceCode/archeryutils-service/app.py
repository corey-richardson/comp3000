from flask import Flask, jsonify, request

import archeryutils as au
import archeryutils.load_rounds as load_rounds
from archeryutils import classifications, handicaps

app = Flask(__name__)

# fmt: off
all_rounds = {
    **au.load_rounds.AGB_indoor,
    **au.load_rounds.AGB_outdoor_imperial,
    **au.load_rounds.AGB_outdoor_metric,
    **au.load_rounds.WA_indoor,
    **au.load_rounds.WA_outdoor,
    **au.load_rounds.WA_experimental,
    # **au.load_rounds.WA_field,
    **au.load_rounds.misc
}
# fmt: on


def cap_classification_level(calculated_classification, venue, competition_status):

    if not calculated_classification or calculated_classification == "NC":
        return calculated_classification

    qualifies_mb = competition_status == "RECORD_STATUS_COMPETITION"
    qualifies_b = competition_status in [
        "CLUB_EVENT",
        "OPEN_COMPETITION",
        "RECORD_STATUS_COMPETITION",
    ]

    if venue == "INDOOR":
        if "M" in calculated_classification:
            if not qualifies_mb:
                calculated_classification = "I-B1"

        if "B" in calculated_classification:
            if not qualifies_b:
                calculated_classification = "I-A1"
    else:  # Outdoor
        if "M" in calculated_classification:
            if not qualifies_mb:
                calculated_classification = "B1"

        if "B" in calculated_classification:
            if not qualifies_b:
                calculated_classification = "A1"

    return calculated_classification


@app.route("/calculate", methods=["POST"])
def calculate_metrics():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    try:
        raw_score = data.get("score")
        round_codename = data.get("roundCodeName")

        bowstyle = classifications.AGB_bowstyles[data.get("bowstyle").upper()]
        sex_category = classifications.AGB_genders[data.get("sex").upper()]
        age_category = classifications.AGB_ages[
            "AGE_" + data.get("ageCategory").upper()
        ]

        competition_status = data.get("competition")
        venue = data.get("venue", "INDOOR").upper()

        round_object = all_rounds.get(round_codename)
        if not round_object:
            return jsonify({"error": f"Round '{round_codename}' not found"}), 400

        try:
            handicap_value = handicaps.handicap_from_score(
                float(raw_score), round_object, "AGB", int_prec=True
            )
        except Exception:
            handicap_value = None

        try:
            if venue == "INDOOR":
                uncapped_classification_value = (
                    classifications.calculate_agb_indoor_classification(
                        raw_score, round_codename, bowstyle, sex_category, age_category
                    )
                )
            else:  # OUTDOOR
                uncapped_classification_value = (
                    classifications.calculate_agb_outdoor_classification(
                        raw_score, round_codename, bowstyle, sex_category, age_category
                    )
                )

            classification_value = cap_classification_level(
                uncapped_classification_value, venue, competition_status
            )

        except Exception:
            classification_value = "NC"
            uncapped_classification_value = "NC"

        return jsonify(
            {
                "handicap": int(handicap_value) if handicap_value is not None else None,
                "classification": classification_value,
                "uncapped_classification": uncapped_classification_value,
                "max_score": round_object.max_score(),
                "num_arrows": round_object.n_arrows,
            }
        )

    except KeyError as e:
        return jsonify({"error": f"Invalid Enum Value: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/rounds", methods=["GET"])
def get_rounds():

    MISC_INDOOR_EXPLICIT = {"lancaster", "lancaster_triple"}

    indoor_dict = [load_rounds.AGB_indoor, load_rounds.WA_indoor]

    outdoor_dict = [
        load_rounds.AGB_outdoor_imperial,
        load_rounds.AGB_outdoor_metric,
        load_rounds.WA_outdoor,
        load_rounds.WA_experimental,
    ]

    indoor_rounds = []
    outdoor_rounds = []

    for round_dict in indoor_dict:
        for code_name, round_obj in round_dict.items():
            indoor_rounds.append(
                {
                    "codename": code_name,
                    "name": round_obj.name,
                    "max_score": round_obj.max_score(),
                    "num_arrows": round_obj.n_arrows,
                    "venue": "INDOOR",
                }
            )

    for round_dict in outdoor_dict:
        for code_name, round_obj in round_dict.items():
            outdoor_rounds.append(
                {
                    "codename": code_name,
                    "name": round_obj.name,
                    "max_score": round_obj.max_score(),
                    "num_arrows": round_obj.n_arrows,
                    "venue": "OUTDOOR",
                }
            )

    for code_name, round_obj in load_rounds.misc.items():
        round_data = {
            "codename": code_name,
            "name": round_obj.name,
            "max_score": round_obj.max_score(),
            "num_arrows": round_obj.n_arrows,
        }

        if code_name in MISC_INDOOR_EXPLICIT:
            round_data["venue"] = "INDOOR"
            indoor_rounds.append(round_data)
        else:
            round_data["venue"] = "OUTDOOR"
            outdoor_rounds.append(round_data)

    return jsonify(
        {
            "INDOOR": sorted(indoor_rounds, key=lambda x: x["name"]),
            "OUTDOOR": sorted(outdoor_rounds, key=lambda x: x["name"]),
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

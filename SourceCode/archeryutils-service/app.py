from flask import Flask, request, jsonify
import archeryutils as au
from archeryutils import handicaps, classifications
import archeryutils.load_rounds as load_rounds

app = Flask(__name__)

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

@app.route("/calculate", methods=["POST"])
def calculate_metrics():
    data = request.get_json()
    if not data:
        return jsonify({ "error": "No JSON data provided" }), 400
    
    try:
        raw_score = data.get("score")
        round_codename = data.get("roundCodeName")
        
        bowstyle = classifications.AGB_bowstyles[data.get("bowstyle").upper()]
        sex_category = classifications.AGB_genders[data.get("sex").upper()]
        age_category = classifications.AGB_ages["AGE_" + data.get("ageCategory").upper()]
        
        venue = data.get("venue", "INDOOR").upper()
        
        round_object = all_rounds.get(round_codename)
        if not round_object:
            return jsonify({"error": f"Round '{round_codename}' not found"}), 400
        
        try:
            handicap_value = handicaps.handicap_from_score(
                float(raw_score),
                round_object,
                "AGB",
                int_prec=True
            )
        except Exception:
            handicap_value = None
        
        try:
            if venue == "INDOOR":
                classification_value = classifications.calculate_agb_indoor_classification(
                    raw_score,
                    round_codename,
                    bowstyle,
                    sex_category,
                    age_category
                )
            else: # OUTDOOR
                classification_value = classifications.calculate_agb_outdoor_classification(
                    raw_score,
                    round_codename,
                    bowstyle,
                    sex_category,
                    age_category
                )
        except Exception:
            classification_value = "UC"
            
        return jsonify({
            "handicap": int(handicap_value),
            "classification": classification_value
        })
        
    except KeyError as e:
        return jsonify({ "error": f"Invalid Enum Value: {str(e)}" }), 400
    except Exception as e:
        return jsonify({ "error": str(e) }), 500


@app.route("/rounds", methods=["GET"])
def get_rounds():
    
    MISC_INDOOR_EXPLICIT = { "lancaster", "lancaster_triple" }
    
    indoor_dict = [
        load_rounds.AGB_indoor,
        load_rounds.WA_indoor
    ]
    
    outdoor_dict = [
        load_rounds.AGB_outdoor_imperial,
        load_rounds.AGB_outdoor_metric,
        load_rounds.WA_outdoor,
        load_rounds.WA_experimental
    ]
    
    indoor_rounds = []
    outdoor_rounds = []
    
    for round in indoor_dict:
        for code_name, object in round.items():
            indoor_rounds.append({ 
                "codename": code_name, 
                "name": object.name, 
                "max_score": object.max_score(), 
                "num_arrows": object.n_arrows 
            })
            
    for round in outdoor_dict:
        for code_name, object in round.items():
            outdoor_rounds.append({ 
                "codename": code_name, 
                "name": object.name, 
                "max_score": object.max_score(), 
                "num_arrows": object.n_arrows 
            })
            
    for code_name, object in load_rounds.misc.items():
        round_data = { 
            "codename": code_name, 
            "name": object.name, 
            "max_score": object.max_score(),
            "num_arrows": object.n_arrows 
        }
        if code_name in MISC_INDOOR_EXPLICIT:
            indoor_rounds.append(round_data)
        else:
            outdoor_rounds.append(round_data)
            
    return jsonify({
        "INDOOR": sorted(indoor_rounds, key=lambda x: x["name"]),
        "OUTDOOR": sorted(outdoor_rounds, key=lambda x: x["name"])
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
    
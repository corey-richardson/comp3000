import pytest


@pytest.fixture
def valid_indoor_score():
    return {
        "score": 571,
        "roundCodeName": "portsmouth_compound_triple",
        "bowstyle": "compound",
        "sex": "male",
        "ageCategory": "UNDER_21",
        "competition": "CLUB_EVENT",
        "venue": "INDOOR",
    }


@pytest.fixture
def valid_outdoor_score():
    return {
        "score": 640,
        "roundCodeName": "wa720_50_c",
        "bowstyle": "compound",
        "sex": "male",
        "ageCategory": "ADULT",
        "competition": "CLUB_EVENT",
        "venue": "OUTDOOR",
    }


def test_calculate_metrics_indoor_success(client, valid_indoor_score):
    response = client.post("/calculate", json=valid_indoor_score)
    data = response.get_json()

    assert response.status_code == 200
    assert data["classification"] == "I-B1"
    assert data["handicap"] == 19
    assert data["num_arrows"] == 60
    assert data["max_score"] == 600


def test_calculate_metrics_outdoor_success(client, valid_outdoor_score):
    response = client.post("/calculate", json=valid_outdoor_score)
    data = response.get_json()

    assert response.status_code == 200
    assert data["classification"] == "B1"
    assert data["handicap"] == 21
    assert data["num_arrows"] == 72
    assert data["max_score"] == 720


@pytest.mark.parametrize("payload", [None, {}, ""])
def test_no_data_cases(client, payload):
    response = client.post("/calculate", json=payload)

    assert response.status_code == 400
    assert response.get_json()["error"] == "No JSON data provided"


def test_calculate_invalid_round(client, valid_indoor_score):
    mockScore = {**valid_indoor_score, "roundCodeName": "not_a_real_round"}

    response = client.post("/calculate", json=mockScore)

    assert response.status_code == 400
    assert "not found" in response.get_json()["error"]


def test_calculate_invalid_enum(client, valid_indoor_score):
    mockScore = {**valid_indoor_score, "bowstyle": "not_a_real_bowstyle"}

    response = client.post("/calculate", json=mockScore)

    assert response.status_code == 400
    assert "Invalid Enum Value" in response.get_json()["error"]


def test_calculate_handles_out_of_range_scores(client, valid_indoor_score):
    mockScore = {**valid_indoor_score, "score": 50000}

    response = client.post("/calculate", json=mockScore)
    data = response.get_json()

    assert response.status_code == 200
    assert data["classification"] == "NC"
    assert data["handicap"] is None


def test_calculate_capping_integration(client, valid_indoor_score):
    mockScore = {**valid_indoor_score, "score": 600}
    response = client.post("/calculate", json=mockScore)
    data = response.get_json()

    assert data["uncapped_classification"] == "I-GMB"
    assert data["classification"] == "I-B1"


def test_handicap_exception(client, mocker, valid_indoor_score):
    mocker.patch(
        "app.handicaps.handicap_from_score",
        side_effect=Exception("Handicap system blew up"),
    )

    response = client.post("/calculate", json=valid_indoor_score)

    assert response.status_code == 200
    assert response.get_json()["handicap"] is None


def test_classification_exception(client, mocker, valid_indoor_score):
    mocker.patch(
        "app.classifications.calculate_agb_indoor_classification",
        side_effect=Exception("Classification system blew up"),
    )

    response = client.post("/calculate", json=valid_indoor_score)

    assert response.status_code == 200
    assert response.get_json()["classification"] == "NC"

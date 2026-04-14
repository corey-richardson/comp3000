def test_get_rounds_structure(client):
    response = client.get("/rounds")
    data = response.get_json()

    assert response.status_code == 200
    assert "INDOOR" in data
    assert "OUTDOOR" in data
    assert isinstance(data["INDOOR"], list)
    assert isinstance(data["OUTDOOR"], list)


def test_get_rounds_content_format(client):
    response = client.get("/rounds")
    data = response.get_json()

    if data["INDOOR"]:
        sample = data["INDOOR"][0]
        assert "codename" in sample
        assert "name" in sample
        assert "max_score" in sample
        assert "num_arrows" in sample
        assert "venue" in sample
        assert sample["venue"] == "INDOOR"


def test_misc_indoor_explicit_logic(client):
    response = client.get("/rounds")
    data = response.get_json()

    indoor_codenames = [r["codename"] for r in data["INDOOR"]]
    assert "lancaster" in indoor_codenames


def test_get_rounds_empty_library(client, mocker):
    mocker.patch("app.load_rounds.AGB_indoor", {})
    mocker.patch("app.load_rounds.WA_indoor", {})
    mocker.patch("app.load_rounds.AGB_outdoor_imperial", {})
    mocker.patch("app.load_rounds.AGB_outdoor_metric", {})
    mocker.patch("app.load_rounds.WA_outdoor", {})
    mocker.patch("app.load_rounds.WA_experimental", {})
    mocker.patch("app.load_rounds.misc", {})

    response = client.get("/rounds")
    data = response.get_json()

    assert response.status_code == 200
    assert data["INDOOR"] == []
    assert data["OUTDOOR"] == []

import pytest

from app import cap_classification_level


@pytest.mark.parametrize(
    "calculated_classification, venue, competition_status, expected_result",
    [
        # --- INDOOR TESTS ---
        # Master Bowman scores require Record Status events
        ("I-MB", "INDOOR", "RECORD_STATUS_COMPETITION", "I-MB"),
        ("I-MB", "INDOOR", "OPEN_COMPETITION", "I-B1"),
        ("I-MB", "INDOOR", "CLUB_EVENT", "I-B1"),
        ("I-MB", "INDOOR", "PRACTICE", "I-A1"),
        # Bowman scores required competitive events
        ("I-B1", "INDOOR", "RECORD_STATUS_COMPETITION", "I-B1"),
        ("I-B1", "INDOOR", "OPEN_COMPETITION", "I-B1"),
        ("I-B1", "INDOOR", "CLUB_EVENT", "I-B1"),
        ("I-B1", "INDOOR", "PRACTICE", "I-A1"),
        # Archer scores don't apply a cap
        ("I-A1", "INDOOR", "RECORD_STATUS_COMPETITION", "I-A1"),
        ("I-A1", "INDOOR", "OPEN_COMPETITION", "I-A1"),
        ("I-A1", "INDOOR", "CLUB_EVENT", "I-A1"),
        ("I-A1", "INDOOR", "PRACTICE", "I-A1"),
        # --- OUTDOOR TESTS ---
        # Master Bowman scores require Record Status events
        ("MB", "OUTDOOR", "RECORD_STATUS_COMPETITION", "MB"),
        ("MB", "OUTDOOR", "OPEN_COMPETITION", "B1"),
        ("MB", "OUTDOOR", "CLUB_EVENT", "B1"),
        ("MB", "OUTDOOR", "PRACTICE", "A1"),
        # Bowman scores required competitive events
        ("B1", "OUTDOOR", "RECORD_STATUS_COMPETITION", "B1"),
        ("B1", "OUTDOOR", "OPEN_COMPETITION", "B1"),
        ("B1", "OUTDOOR", "CLUB_EVENT", "B1"),
        ("B1", "OUTDOOR", "PRACTICE", "A1"),
        # Archer scores don't apply a cap
        ("A1", "OUTDOOR", "RECORD_STATUS_COMPETITION", "A1"),
        ("A1", "OUTDOOR", "OPEN_COMPETITION", "A1"),
        ("A1", "OUTDOOR", "CLUB_EVENT", "A1"),
        ("A1", "OUTDOOR", "PRACTICE", "A1"),
        # --- EDGE CASES ---
        ("NC", "INDOOR", "CLUB_EVENT", "NC"),
        ("", "INDOOR", "CLUB_EVENT", ""),
        (None, "INDOOR", "CLUB_EVENT", None),
    ],
)
def test_cap_classification_level(
    calculated_classification, venue, competition_status, expected_result
):
    assert (
        cap_classification_level(calculated_classification, venue, competition_status)
        == expected_result
    )

import pandas as pd
import random

# -------------------------------------------------
# FIXED DEMO WARDS (ID → NAME → ZONE)
# From demoData.js - 24 wards across South, Central, West, East
# -------------------------------------------------
DEMO_WARDS = {
    "W001": ("A", "South"),
    "W002": ("B", "South"),
    "W003": ("C", "South"),
    "W004": ("D", "South"),
    "W005": ("E", "South"),
    "W006": ("F/N", "Central"),
    "W007": ("F/S", "South"),
    "W008": ("G/N", "Central"),
    "W009": ("G/S", "Central"),
    "W010": ("H/E", "West"),
    "W011": ("H/W", "West"),
    "W012": ("K/E", "West"),
    "W013": ("K/W", "West"),
    "W014": ("L", "East"),
    "W015": ("M/E", "East"),
    "W016": ("M/W", "East"),
    "W017": ("N", "East"),
    "W018": ("P/N", "West"),
    "W019": ("P/S", "West"),
    "W020": ("R/C", "West"),
    "W021": ("R/N", "West"),
    "W022": ("R/S", "West"),
    "W023": ("S", "East"),
    "W024": ("T", "East"),
}

# -------------------------------------------------
# EXTRA WARDS (NON-CRITICAL IDS) - Not used, all data from DEMO_WARDS
# -------------------------------------------------
EXTRA_WARDS = {}

# -------------------------------------------------
# ZONE → FESTIVAL WEIGHT (UNCHANGED)
# -------------------------------------------------
zone_festival_weight = {
    "South": 0.95,
    "Central": 0.90,
    "West": 0.85,
    "East": 0.70,
}

# -------------------------------------------------
# WEIGHTED WARD PICKER
# -------------------------------------------------
def choose_ward():
    # All wards from demoData.js
    wid = random.choice(list(DEMO_WARDS.keys()))
    name, zone = DEMO_WARDS[wid]
    return wid, name, zone

# -------------------------------------------------
# DATA GENERATION (LOGIC UNTOUCHED)
# -------------------------------------------------
rows = []

for _ in range(2500):
    ward_id, ward_name, zone = choose_ward()

    month = random.randint(1, 12)
    day = random.randint(1, 28)

    is_festival = 1 if month in [3, 8, 9, 10, 11] and random.random() > 0.25 else 0

    festival_intensity = (
        zone_festival_weight[zone]
        if is_festival
        else round(random.uniform(0, 0.15), 2)
    )

    complaint_intensity = int(random.uniform(25, 85) * (1 + festival_intensity * 1.3))
    crowd_index = int(random.uniform(40, 92) * (1 + festival_intensity * 1.4))
    weather_risk = random.randint(10, 60)

    wpi = int(
        0.45 * complaint_intensity +
        0.40 * crowd_index +
        0.15 * weather_risk
    ) // 2

    rows.append([
        ward_id,
        ward_name,
        zone,
        month,
        day,
        is_festival,
        round(festival_intensity, 2),
        complaint_intensity,
        crowd_index,
        weather_risk,
        min(wpi, 100)
    ])

# -------------------------------------------------
# EXPORT
# -------------------------------------------------
df = pd.DataFrame(rows, columns=[
    "ward_id",
    "ward_name",
    "zone",
    "month",
    "day_of_month",
    "is_festival_window",
    "festival_intensity",
    "complaint_intensity",
    "crowd_index",
    "weather_risk",
    "wpi"
])

df.to_csv("bmc_waste_festival_ml_data.csv", index=False)

print("✅ Dataset generated:", len(df))
print("✅ Demo ward IDs EXACTLY matched")
print("✅ Zone names aligned with frontend")

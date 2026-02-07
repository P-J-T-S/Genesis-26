import pandas as pd
import random

# -------------------------------------------------
# FIXED DEMO WARDS (ID → NAME → ZONE)
# -------------------------------------------------
DEMO_WARDS = {
    "W001": ("Colaba", "South"),
    "W002": ("Bandra West", "West"),
    "W003": ("Andheri East", "West"),
    "W004": ("Dadar", "Central"),
    "W005": ("Kurla", "East"),
    "W006": ("Borivali", "North"),
    "W007": ("Mulund", "North"),
    "W008": ("Worli", "South"),
}

# -------------------------------------------------
# EXTRA WARDS (NON-CRITICAL IDS)
# -------------------------------------------------
EXTRA_WARDS = {
    "X001": ("Fort", "Island City"),
    "X002": ("Churchgate", "Island City"),
    "X003": ("Cuffe Parade", "Island City"),
    "X004": ("Marine Lines", "Island City"),

    "X005": ("Andheri West", "West"),
    "X006": ("Juhu", "West"),

    "X007": ("Ghatkopar", "East"),
    "X008": ("Vikhroli", "East"),

    "X009": ("Parel", "Central"),
    "X010": ("Byculla", "Central"),

    "X011": ("Dahisar", "North"),
    "X012": ("Kandarpada", "North"),
}

# -------------------------------------------------
# ZONE → FESTIVAL WEIGHT (UNCHANGED)
# -------------------------------------------------
zone_festival_weight = {
    "South": 0.95,
    "Island City": 0.92,
    "Central": 0.90,
    "West": 0.85,
    "East": 0.70,
    "North": 0.60,
}

# -------------------------------------------------
# WEIGHTED WARD PICKER
# -------------------------------------------------
def choose_ward():
    # 70% demo wards
    if random.random() < 0.7:
        wid = random.choice(list(DEMO_WARDS.keys()))
        name, zone = DEMO_WARDS[wid]
    else:
        wid = random.choice(list(EXTRA_WARDS.keys()))
        name, zone = EXTRA_WARDS[wid]
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

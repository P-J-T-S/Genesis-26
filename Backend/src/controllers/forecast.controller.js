import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Zone } from '../models/zone.model.js';
import { generateAndSaveRecommendations } from '../services/recommendation.service.js';
import { getForecastFromML } from '../services/forecast.service.js';
import { mapMLSignalsToRecSignals } from '../utils/mapMLSignals.js';

export const forecastZone = asyncHandler(async (req, res) => {
  const { date, ward, zone, mode = 'normal' } = req.body;

  if (!date || !ward || !zone) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, 'date, ward and zone are required'));
  }

  // Optional: find zone document (for zone_id)
  const zoneDoc = await Zone.findOne({ zone_name: zone });
  if (!zoneDoc) {
    return res.status(404).json(new ApiResponse(404, null, 'Zone not found'));
  }

  // 1️⃣ Call ML
  const mlResult = await getForecastFromML({ date, ward, zone });

  const predictedWPI = mlResult.predicted_wpi;
  const recSignals = mapMLSignalsToRecSignals(mlResult.ml_signals);

  // 2️⃣ Generate recommendations (ADVANCE)
  const recommendations = await generateAndSaveRecommendations(
    zoneDoc._id,
    predictedWPI,
    recSignals,
    mode
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        input: { date, ward, zone },
        forecast: {
          predicted_wpi: predictedWPI,
          signals: recSignals,
        },
        recommendations,
      },
      'Forecast generated successfully'
    )
  );
});

import axios from 'axios';

const ML_BASE_URL = process.env.ML_BASE_URL || 'http://127.0.0.1:8000';

export const getForecastFromML = async ({ date, ward, zone }) => {
  const response = await axios.post(`${ML_BASE_URL}/predict-wpi`, {
    date,
    ward_name: ward,
    zone,
  });

  return {
    predicted_wpi: response.data.predicted_wpi * 2,
    ml_signals: response.data.features_used || {},
  };
  /*
    Expected from ML:
    {
      predicted_wpi: number,
      ml_signals: {
        festival_intensity,
        complaint_intensity,
        crowd_index,
        weather_risk
      }
    }
  */
};

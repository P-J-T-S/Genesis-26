import axios from 'axios';

const ML_BASE_URL = process.env.ML_BASE_URL || 'http://127.0.0.1:8000';

export const getForecastFromML = async ({ date, ward, zone }) => {
  const response = await axios.post(`${ML_BASE_URL}/predict`, {
    date,
    ward,
    zone,
  });

  return response.data;
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

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import {
  calculateCreditScore,
  saveCreditScore,
  calculateAllCreditScores,
  getRankedZones,
  getZoneCreditDetails
} from '../services/credit.service.js';


export const getCreditRankings = asyncHandler(async (req, res) => {
  const rankings = await getRankedZones();

  return res.status(200).json(
    new ApiResponse(200, rankings, 'Zone credit rankings retrieved')
  );
});


export const getZoneCreditInfo = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;
  const details = await getZoneCreditDetails(zoneId);

  return res.status(200).json(
    new ApiResponse(200, details, 'Zone credit details retrieved')
  );
});


export const calculateZoneCredit = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;

  const creditData = await calculateCreditScore(zoneId);
  const saved = await saveCreditScore(creditData);

  return res.status(200).json(
    new ApiResponse(200, saved, 'Zone credit calculated')
  );
});


export const calculateAllCredits = asyncHandler(async (req, res) => {
  const results = await calculateAllCreditScores();

  return res.status(200).json(
    new ApiResponse(200, results, 'All zone credits calculated')
  );
});
import React, { useState, useEffect } from 'react';
import {
    Calendar,
    MapPin,
    Layers,
    Brain,
    ArrowRight,
    AlertTriangle,
    TrendingUp,
    CheckCircle2,
    Loader2,
    ChevronRight,
    Info
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { zonesAPI, forecastAPI } from '../services/api';
import { ZONES, getWPILevel, formatTimestamp } from '../utils/helpers';

const Forecast = () => {
    const [loading, setLoading] = useState(false);
    const [wards, setWards] = useState([]);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        zone: 'all',
        ward: 'all',
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Fetch all wards on mount to populate the ward dropdown
    useEffect(() => {
        const fetchWards = async () => {
            try {
                const res = await zonesAPI.getWards('normal');
                setWards(res.data.data);
            } catch (err) {
                console.error('Failed to fetch wards', err);
            }
        };
        fetchWards();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'zone' && { ward: 'all' }) // Reset ward when zone changes
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.zone === 'all' || formData.ward === 'all') {
            setError('Please select both a Zone and a Ward.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await forecastAPI.predictZone({
                date: formData.date,
                zone: formData.zone,
                ward: formData.ward,
            });
            setResult(response.data.data);
        } catch (err) {
            console.error('Forecast failed', err);
            setError(err.response?.data?.message || 'An unexpected error occurred during prediction.');
        } finally {
            setLoading(false);
        }
    };

    const filteredWards = formData.zone === 'all'
        ? wards
        : wards.filter(w => w.zone === formData.zone);

    return (
        <div className="container-fluid py-6 space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">AI Waste Pressure Forecast</h1>
                    <p className="text-secondary-600">Predict future waste pressure and auto-generate operational recommendations</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg border border-primary-100">
                    <Brain className="w-5 h-5" />
                    <span className="font-semibold text-sm">ML Model Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Input Form */}
                <div className="xl:col-span-4 space-y-6">
                    <section className="card p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-primary-600" />
                            Forecast Parameters
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-secondary-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-secondary-400" />
                                    Target Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    className="input"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-secondary-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-secondary-400" />
                                    Zone
                                </label>
                                <select
                                    name="zone"
                                    className="select"
                                    value={formData.zone}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="all" disabled>Select Zone</option>
                                    {Object.values(ZONES).map(z => (
                                        <option key={z} value={z}>{z}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-secondary-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-secondary-400" />
                                    Ward
                                </label>
                                <select
                                    name="ward"
                                    className="select"
                                    value={formData.ward}
                                    onChange={handleInputChange}
                                    required
                                    disabled={formData.zone === 'all'}
                                >
                                    <option value="all" disabled>Select Ward</option>
                                    {filteredWards.map(w => (
                                        <option key={w.id || w.ward_id} value={w.name || w.ward_name}>{w.name || w.ward_name}</option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <div className="p-3 bg-danger-50 border border-danger-100 rounded-lg text-danger-700 text-sm flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full py-3 mt-4"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Forecast...
                                    </>
                                ) : (
                                    <>
                                        Generate Forecast
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    </section>

                    {/* Info Card */}
                    <section className="p-4 bg-info-50 border border-info-100 rounded-xl">
                        <div className="flex gap-3">
                            <div className="mt-0.5">
                                <Info className="w-5 h-5 text-info-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-info-900 mb-1">Operational Integration</h4>
                                <p className="text-xs text-info-800 leading-relaxed">
                                    Forecast results are automatically synchronized with the SWM dashboard and Actions page. Recommendations generated here will be available to Ward Officers for immediate execution.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Results Area */}
                <div className="xl:col-span-8">
                    {!result && !loading && (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-secondary-200 rounded-2xl bg-secondary-50 text-center p-8">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <Brain className="w-8 h-8 text-secondary-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-secondary-900">Ready for Prediction</h3>
                            <p className="text-secondary-600 max-w-md mx-auto mt-2">
                                Select a future date and ward to generate AI predictions for waste pressure and automated mitigation strategies.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-primary-200 rounded-2xl bg-primary-50/30 text-center p-8">
                            <div className="relative">
                                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                                <Brain className="w-6 h-6 text-primary-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <h3 className="text-lg font-semibold text-primary-900 mt-4">AI Model Processing</h3>
                            <p className="text-primary-700 max-w-sm mx-auto mt-2">
                                Analyzing historical patterns, festival calendars, and real-time signals to calculate future Waste Pressure Index...
                            </p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-slide-up">
                            {/* Prediction Summary Widgets */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="card p-6 border-l-4 border-l-primary-500">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-secondary-600 capitalize">Predicted WPI</span>
                                        <TrendingUp className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-bold text-secondary-900">{result.forecast.predicted_wpi}</span>
                                        <span className={`badge badge-${getWPILevel(result.forecast.predicted_wpi).color} mb-1.5`}>
                                            {getWPILevel(result.forecast.predicted_wpi).label} Urgency
                                        </span>
                                    </div>
                                    <p className="text-xs text-secondary-500 mt-4 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-success-500" />
                                        Forecast for {formatTimestamp(formData.date, false)}
                                    </p>
                                </div>

                                <div className="card p-6">
                                    <h4 className="text-sm font-medium text-secondary-600 mb-4">ML Signal Decomposition</h4>
                                    <div className="space-y-3">
                                        {Object.entries(result.forecast.signals).map(([key, value]) => (
                                            <div key={key} className="space-y-1">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-secondary-700 capitalize">{key.replace('_', ' ')}</span>
                                                    <span className="text-secondary-900">{typeof value === 'boolean' ? (value ? 'YES' : 'NO') : `${value}%`}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-secondary-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-primary-500 rounded-full ${typeof value === 'boolean' && value ? 'w-full' : ''}`}
                                                        style={{ width: typeof value === 'number' ? `${value}%` : '' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations Card */}
                            <div className="card overflow-hidden">
                                <div className="p-6 border-b border-secondary-100 bg-secondary-50/50 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-secondary-900">AI Operational Strategy</h3>
                                        <p className="text-xs text-secondary-600 italic">Auto-generated based on predicted waste pressure</p>
                                    </div>
                                    <CheckCircle2 className="w-6 h-6 text-success-600" />
                                </div>

                                <div className="divide-y divide-secondary-100">
                                    {result.recommendations && result.recommendations.length > 0 ? (
                                        result.recommendations.map((rec, index) => {
                                            const priority = rec.priority ||
                                                (rec.actionability_score >= 90 ? 'critical' :
                                                    rec.actionability_score >= 80 ? 'high' :
                                                        rec.actionability_score >= 50 ? 'medium' : 'low');

                                            return (
                                                <div key={index} className="p-6 hover:bg-secondary-50 transition-colors">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full ${priority === 'critical' ? 'bg-danger-500' :
                                                                        priority === 'high' ? 'bg-warning-500' : 'bg-primary-500'
                                                                    }`}></span>
                                                                <h4 className="font-semibold text-secondary-900">{rec.recommended_action}</h4>
                                                            </div>
                                                            <p className="text-sm text-secondary-600 leading-relaxed">{rec.reason_text}</p>
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-secondary-100 text-secondary-600 rounded">
                                                            {rec.type || 'AI Suggested'}
                                                        </span>
                                                    </div>

                                                    {rec.actions && rec.actions.length > 0 && (
                                                        <div className="mt-4 pl-4 border-l-2 border-secondary-200 space-y-2">
                                                            {rec.actions.map((action, ai) => (
                                                                <div key={ai} className="flex items-center gap-2 text-xs text-secondary-700">
                                                                    <ChevronRight className="w-3 h-3 text-secondary-400" />
                                                                    {action}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="p-12 text-center text-secondary-500 italic">
                                            No specific recommendations required based on forecasted pressure levels.
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-secondary-50 text-center border-t border-secondary-100">
                                    <p className="text-xs text-secondary-500">
                                        Recommendation engine synced with BMC SWM Guidelines v2.0
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forecast;

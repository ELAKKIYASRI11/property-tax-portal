import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ReceiptModal from '../components/ReceiptModal';
import {
  Calculator,
  Building2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Percent,
  Clock,
  ArrowRight,
  ShieldAlert,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';

const TaxCalculator = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(searchParams.get('propertyId') || '');
  const [calculation, setCalculation] = useState(null);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [completedPayment, setCompletedPayment] = useState(null);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Fetch properties on mount
  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await api.get('/properties');
        setProperties(res.data || []);
        if (!selectedPropertyId && res.data?.length > 0) {
          setSelectedPropertyId(res.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProps();
  }, []);

  // When selectedPropertyId changes, run preview calculation
  useEffect(() => {
    if (selectedPropertyId) {
      runCalculation(selectedPropertyId);
    }
  }, [selectedPropertyId]);

  const runCalculation = async (propId) => {
    try {
      setLoading(true);
      setError('');
      setInfoMessage('');

      // Preview calculation
      const res = await api.post('/tax/preview', { propertyId: propId });
      setCalculation(res.data.calculation);

      // Check if official assessment already exists
      const propDetails = await api.get(`/properties/${propId}`);
      const latestAsm = propDetails.data?.assessments?.[0];
      setActiveAssessment(latestAsm || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Calculation error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFormalAssessment = async () => {
    try {
      setLoading(true);
      const res = await api.post('/tax/assess', {
        propertyId: selectedPropertyId,
        financialYear: '2025-2026',
      });
      setActiveAssessment(res.data);
      setInfoMessage('Official Self-Assessment saved. You may now proceed to secure payment.');
    } catch (err) {
      if (err.response?.data?.assessment) {
        setActiveAssessment(err.response.data.assessment);
        setInfoMessage('Loaded existing assessment for this financial year.');
      } else {
        setError(err.response?.data?.message || 'Assessment generation failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!activeAssessment) {
      setError('Please click "Commit Self-Assessment" first before proceeding to pay.');
      return;
    }

    try {
      setPaying(true);
      const res = await api.post('/payments/pay', {
        assessmentId: activeAssessment._id,
        paymentMethod,
      });

      setShowPaymentModal(false);
      setCompletedPayment(res.data.payment);
      // Reload assessment state
      runCalculation(selectedPropertyId);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  const selectedProp = properties.find((p) => p._id === selectedPropertyId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Calculator className="w-7 h-7 text-emerald-600" />
          Property Tax Self-Assessment & Calculation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Transparent multi-factor municipal valuation algorithm with auto-applied citizen exemptions.
        </p>
      </div>

      {/* Property Selector Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Building2 className="w-5 h-5 text-brand-600 shrink-0" />
          <div className="w-full sm:w-80">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Property for Assessment
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500"
            >
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.propertyIdentifier} — {p.propertyType} ({p.builtUpAreaSqFt} sq ft, {p.location?.ward})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedProp && (
          <div className="text-right text-xs text-slate-600 hidden md:block">
            <span className="text-slate-400 block text-[11px]">Occupancy & Age</span>
            <span className="font-bold text-slate-800">
              {selectedProp.occupancyStatus} • Built {selectedProp.constructionYear}
            </span>
          </div>
        )}
      </div>

      {infoMessage && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Calculation Grid */}
      {calculation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Step-by-Step Multiplier Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    5-Stage Valuation Formula Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Area × Zone Rate → Usage Multiplier → Building Type → Depreciation → Occupancy Factor → Rebates
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                  FY 2025-2026
                </span>
              </div>

              {/* Stage Flow Visualizer */}
              <div className="space-y-4 text-xs">
                {/* Stage 1: Base Area & Zone Rate */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Stage 1: Base Land/Built-up Area × Zone Rate
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {calculation.areaEvaluated} sq ft ({calculation.areaType}) × ₹{calculation.zoneBaseRate}/sq ft
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    = ₹{calculation.baseTax.toLocaleString()}
                  </span>
                </div>

                {/* Stage 2: Usage Multiplier */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Stage 2: Property Usage Multiplier
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Usage category multiplier applied to base tax
                    </span>
                  </div>
                  <span className="font-mono font-bold text-brand-700 text-sm">
                    × {calculation.usageMultiplier}x
                  </span>
                </div>

                {/* Stage 3: Building Type Factor */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Stage 3: Building Construction Factor
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Pucca/RCC, Semi-Pucca, or Kutcha durability weight
                    </span>
                  </div>
                  <span className="font-mono font-bold text-brand-700 text-sm">
                    × {calculation.buildingTypeFactor}x
                  </span>
                </div>

                {/* Stage 4: Depreciation */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Stage 4: Structural Age Depreciation
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {calculation.buildingAge} years of age ({calculation.depreciationRate}% statutory depreciation)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    - ₹{calculation.depreciationAmount.toLocaleString()}
                  </span>
                </div>

                {/* Stage 5: Occupancy Factor */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Stage 5: Occupancy Factor
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Self-occupied (1.0x) vs Commercial Tenanted (1.35x)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    × {calculation.occupancyFactor}x
                  </span>
                </div>
              </div>

              {/* Auto-Applied Novelty Exemptions */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-emerald-600" />
                    Auto-Applied Citizen Exemptions & Concessions
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Auto-computed from profile
                  </span>
                </div>

                {calculation.exemptions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No statutory rebates match this property/profile classification.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {calculation.exemptions.map((ex, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-900">{ex.name}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-800">
                          - ₹{ex.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Summary & Pay Now Action Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                Self-Assessment Summary
              </span>

              <div className="space-y-2 border-b border-slate-700 pb-4">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Gross Municipal Tax</span>
                  <span className="font-mono">₹{calculation.grossTaxAmount.toLocaleString()}</span>
                </div>

                {calculation.totalExemptionAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Total Exemptions Applied</span>
                    <span className="font-mono">- ₹{calculation.totalExemptionAmount.toLocaleString()}</span>
                  </div>
                )}

                {calculation.latePenalty > 0 && (
                  <div className="flex justify-between text-xs text-rose-400">
                    <span>Late Payment Surcharge</span>
                    <span className="font-mono">+ ₹{calculation.latePenalty.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">
                  Final Net Tax Payable
                </span>
                <div className="text-3xl font-black text-white font-mono mt-1">
                  ₹{calculation.netPayableAmount.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-400">Inclusive of all local cess</span>
              </div>

              {/* Action Buttons based on Assessment state */}
              {activeAssessment?.status === 'Paid' ? (
                <div className="bg-emerald-900/60 border border-emerald-700 p-3.5 rounded-2xl text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    PAID IN FULL
                  </div>
                  <p className="text-[11px] text-emerald-200">
                    This tax assessment cycle is completely resolved and verified.
                  </p>
                </div>
              ) : activeAssessment?.status === 'Disputed' ? (
                <div className="bg-amber-900/60 border border-amber-700 p-3.5 rounded-2xl text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    DISPUTE UNDER REVIEW
                  </div>
                  <p className="text-[11px] text-amber-200">
                    Your assessment grievance is currently being audited by municipal assessors.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {!activeAssessment ? (
                    <button
                      onClick={handleGenerateFormalAssessment}
                      disabled={loading}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Commit Official Self-Assessment
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Proceed to Pay ₹{calculation.netPayableAmount.toLocaleString()}
                    </button>
                  )}

                  {/* Dispute Assessment Link */}
                  {activeAssessment && (
                    <button
                      onClick={() => navigate(`/grievances?assessmentId=${activeAssessment._id}`)}
                      className="w-full text-center text-xs text-slate-300 hover:text-white font-medium underline transition"
                    >
                      Dispute this Assessment / File Grievance
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Online Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Secure Municipal Payment Gateway</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 block">Assessment ID</span>
                  <span className="font-bold text-slate-900">
                    {activeAssessment?.assessmentNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Payable Amount</span>
                  <span className="text-lg font-black font-mono text-emerald-700">
                    ₹{calculation?.netPayableAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'Credit/Debit Card', 'Net Banking'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`p-3 rounded-xl border text-center font-bold transition ${
                        paymentMethod === m
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                Simulated Sandbox Gateway: Payment will be confirmed instantly and an official stamped municipal receipt will be generated.
              </div>

              <button
                onClick={handlePayNow}
                disabled={paying}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {paying ? (
                  'Processing Transaction...'
                ) : (
                  <>
                    <span>Confirm & Pay ₹{calculation?.netPayableAmount?.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instant Receipt Popup on Success */}
      {completedPayment && (
        <ReceiptModal
          payment={completedPayment}
          onClose={() => setCompletedPayment(null)}
        />
      )}
    </div>
  );
};

export default TaxCalculator;

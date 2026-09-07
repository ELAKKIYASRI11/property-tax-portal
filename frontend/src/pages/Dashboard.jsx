import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ComplianceBadge from '../components/ComplianceBadge';
import ReceiptModal from '../components/ReceiptModal';
import {
  Building2,
  Calculator,
  History,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  FileText,
  CreditCard,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propRes, asmRes, payRes] = await Promise.all([
        api.get('/properties'),
        api.get('/tax/my-assessments'),
        api.get('/payments/history'),
      ]);
      setProperties(propRes.data || []);
      setAssessments(asmRes.data || []);
      setPayments(payRes.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingAssessments = assessments.filter((a) => a.status === 'Pending');
  const paidAssessments = assessments.filter((a) => a.status === 'Paid');

  // Overall compliance score (average of properties)
  const averageCompliance = properties.length > 0
    ? Math.round(properties.reduce((acc, p) => acc + (p.complianceScore?.score || 85), 0) / properties.length)
    : 85;

  let overallRating = 'Good';
  if (averageCompliance < 50) overallRating = 'Defaulter';
  else if (averageCompliance < 80) overallRating = 'At Risk';

  const totalDue = pendingAssessments.reduce((acc, a) => acc + (a.calculationBreakdown?.netPayableAmount || 0), 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm">Loading citizen dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-brand-500/30 text-brand-200 border border-brand-400/30 px-2.5 py-0.5 rounded-full font-semibold">
                Citizen Self-Assessment Portal
              </span>
              <ComplianceBadge score={averageCompliance} rating={overallRating} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Track municipal property assessments, calculate transparent taxes with auto-rebates, and maintain your 100% compliance rating.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/properties"
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4 text-brand-600" />
              Add Property
            </Link>
            <Link
              to="/tax-calculator"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm flex items-center gap-2 transition"
            >
              <Calculator className="w-4 h-4" />
              Self-Assess Tax
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Due Banner if any */}
      {pendingAssessments.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                You have {pendingAssessments.length} Pending Tax Assessment(s)
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Total outstanding tax payable: <span className="font-bold font-mono">₹{totalDue.toLocaleString()}</span>. Pay on time to avoid a 5% late surcharge and protect your compliance score.
              </p>
            </div>
          </div>
          <Link
            to="/tax-calculator"
            className="self-start sm:self-auto bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            Review & Pay Now
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Registered Properties
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {properties.length}
            </span>
            <span className="text-[11px] text-slate-400">All mapped with GIS coords</span>
          </div>
          <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Compliance Score
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {averageCompliance}/100
            </span>
            <span className="text-[11px] font-semibold text-emerald-700">
              {overallRating} Standing
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Pending Assessments
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {pendingAssessments.length}
            </span>
            <span className="text-[11px] text-slate-400">₹{totalDue.toLocaleString()} dues</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Completed Payments
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {payments.length}
            </span>
            <span className="text-[11px] text-slate-400">Official receipts verified</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Properties & Quick Tax Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Properties */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-600" />
              My Registered Properties
            </h2>
            <Link
              to="/properties"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all ({properties.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.slice(0, 4).map((prop) => (
              <div
                key={prop._id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-brand-300 hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                      {prop.propertyIdentifier}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">
                      {prop.propertyType} • {prop.buildingType}
                    </h3>
                  </div>
                  <ComplianceBadge
                    score={prop.complianceScore?.score}
                    rating={prop.complianceScore?.rating}
                    size="sm"
                    showScore={false}
                  />
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">
                  Door {prop.location?.doorNo}, {prop.location?.street}, {prop.location?.ward}, {prop.location?.municipality} - {prop.location?.pincode}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-600">
                    <span className="font-bold text-slate-800">{prop.builtUpAreaSqFt}</span> sq ft built-up
                  </div>
                  <Link
                    to={`/tax-calculator?propertyId=${prop._id}`}
                    className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1"
                  >
                    Calculate Tax
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Payments & Receipts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              Recent Tax Receipts
            </h2>
            <Link
              to="/payment-history"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              All Receipts
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 divide-y divide-slate-100">
            {payments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No payment receipts yet.
              </div>
            ) : (
              payments.slice(0, 4).map((pay) => (
                <div key={pay._id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      ₹{pay.amountPaid?.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {pay.receiptNumber}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(pay.paymentDate).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReceipt(pay)}
                    className="text-xs font-semibold text-brand-600 hover:bg-brand-50 px-2.5 py-1.5 rounded-lg border border-brand-200 transition"
                  >
                    View Receipt
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal payment={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
};

export default Dashboard;

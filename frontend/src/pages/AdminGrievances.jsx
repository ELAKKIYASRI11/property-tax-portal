import React, { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../services/api';
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  User,
  Building2,
  Paperclip,
  Check,
  X,
  Edit3,
} from 'lucide-react';

const AdminGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [status, setStatus] = useState('Approved');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [adjustedTaxAmount, setAdjustedTaxAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/grievances');
      setGrievances(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const openReviewModal = (g) => {
    setSelectedGrievance(g);
    setStatus('Approved');
    setAdminRemarks('');
    // Default adjusted tax amount to 80% of original as recommendation
    setAdjustedTaxAmount(g.originalTaxAmount ? Math.round(g.originalTaxAmount * 0.8) : '');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    try {
      setSubmitting(true);
      await api.put(`/admin/grievances/${selectedGrievance._id}`, {
        status,
        adminRemarks,
        adjustedTaxAmount: status === 'Approved' ? Number(adjustedTaxAmount) : null,
      });

      setActionSuccess(`Grievance ${selectedGrievance.grievanceNumber} marked as ${status}!`);
      setSelectedGrievance(null);
      fetchGrievances();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Review submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300 uppercase">
            Novelty Feature 3
          </span>
          <span className="text-xs text-slate-400 font-mono">Dispute Redressal Chamber</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Municipal Assessment Grievance Adjudication
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review contested assessments, inspect taxpayer uploaded evidence, adjust tax liabilities, and issue formal rulings.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Grievances List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading citizen appeals...</div>
        ) : grievances.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
            No citizen disputes pending review.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {grievances.map((g) => (
              <div key={g._id} className="p-6 hover:bg-slate-50/60 transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                      {g.grievanceNumber}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">
                      {g.disputeType}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        g.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : g.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {g.status}
                    </span>

                    {g.status === 'Under Review' && (
                      <button
                        onClick={() => openReviewModal(g)}
                        className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-xs transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Adjudicate
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Taxpayer</span>
                    <span className="font-semibold text-slate-900">{g.user?.name}</span> ({g.user?.email})
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Property</span>
                    <span className="font-semibold text-brand-700">{g.property?.propertyIdentifier}</span> ({g.property?.propertyType})
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Original Assessed Tax</span>
                    <span className="font-bold text-slate-900 font-mono">₹{g.originalTaxAmount?.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="text-slate-900">Citizen Dispute Details: </strong>
                  {g.description}
                </p>

                {g.proofDocumentUrl && (
                  <div className="text-xs">
                    <a
                      href={`${API_BASE_URL}${g.proofDocumentUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-brand-600 hover:underline font-semibold"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      Inspect Citizen Uploaded Blueprint/Proof
                    </a>
                  </div>
                )}

                {g.adminRemarks && (
                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs text-purple-900">
                    <strong>Official Determination: </strong>
                    {g.adminRemarks}
                    {g.adjustedTaxAmount && (
                      <span className="block mt-1 font-bold text-emerald-800">
                        Tax Adjusted to: ₹{g.adjustedTaxAmount.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adjudication Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">
                  Adjudicate {selectedGrievance.grievanceNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <p>
                  <strong>Claimant:</strong> {selectedGrievance.user?.name}
                </p>
                <p>
                  <strong>Property:</strong> {selectedGrievance.property?.propertyIdentifier}
                </p>
                <p>
                  <strong>Claim Type:</strong> {selectedGrievance.disputeType}
                </p>
                <p className="text-slate-500 italic mt-1">"{selectedGrievance.description}"</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Adjudication Decision
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('Approved')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition ${
                      status === 'Approved'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    Approve & Adjust
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('Rejected')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition ${
                      status === 'Rejected'
                        ? 'border-rose-500 bg-rose-50 text-rose-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <X className="w-4 h-4 text-rose-600" />
                    Reject Appeal
                  </button>
                </div>
              </div>

              {status === 'Approved' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Adjusted Tax Amount (INR)
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={adjustedTaxAmount}
                    onChange={(e) => setAdjustedTaxAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Original Assessed Tax: ₹{selectedGrievance.originalTaxAmount?.toLocaleString()}
                  </span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Assessor Remarks
                </label>
                <textarea
                  required
                  rows={3}
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder="Enter statutory reason for approval/rejection per municipal inspection report..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Submit Final Determination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGrievances;

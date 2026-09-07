import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { API_BASE_URL } from '../services/api';
import {
  AlertCircle,
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Paperclip,
  Send,
} from 'lucide-react';

const Grievances = () => {
  const [searchParams] = useSearchParams();
  const preselectedAssessmentId = searchParams.get('assessmentId') || '';

  const [grievances, setGrievances] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [assessmentId, setAssessmentId] = useState(preselectedAssessmentId);
  const [disputeType, setDisputeType] = useState('Incorrect Built-up Area');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [grvRes, asmRes] = await Promise.all([
        api.get('/grievances/my'),
        api.get('/tax/my-assessments'),
      ]);
      setGrievances(grvRes.data || []);
      setAssessments(asmRes.data || []);
      if (!assessmentId && asmRes.data?.length > 0) {
        setAssessmentId(asmRes.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('assessmentId', assessmentId);
      formData.append('disputeType', disputeType);
      formData.append('description', description);
      if (file) {
        formData.append('proofDocument', file);
      }

      await api.post('/grievances', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg('Grievance lodged successfully! Status is now Under Review by Municipal Assessors.');
      setDescription('');
      setFile(null);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit grievance');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Adjusted
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full text-xs font-bold border border-rose-300">
            <XCircle className="w-3.5 h-3.5" /> Appeal Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-300">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <AlertCircle className="w-7 h-7 text-amber-600" />
          Digitized Tax Appeal & Grievance Redressal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Dispute incorrect area measurements, zone classifications, or missing exemptions with digital proof attachments.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 1 Col: Lodge Appeal Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-brand-600" />
            Lodge Assessment Appeal
          </h2>
          <p className="text-xs text-slate-500">
            Once submitted, your tax assessment is paused under statutory review until adjudicated by municipal revenue authorities.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                Target Tax Assessment
              </label>
              <select
                value={assessmentId}
                onChange={(e) => setAssessmentId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
              >
                {assessments.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.assessmentNumber} ({a.property?.propertyIdentifier} • ₹{a.calculationBreakdown?.netPayableAmount?.toLocaleString()} • {a.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                Dispute Classification
              </label>
              <select
                value={disputeType}
                onChange={(e) => setDisputeType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
              >
                <option value="Incorrect Built-up Area">Incorrect Built-up Area</option>
                <option value="Wrong Zone Classification">Wrong Zone Classification</option>
                <option value="Missing Exemption / Senior Rebate">Missing Exemption / Senior Rebate</option>
                <option value="Depreciation Calculation Error">Depreciation Calculation Error</option>
                <option value="Double Assessment / Other">Double Assessment / Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                Detailed Grounds for Dispute
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State clearly why the valuation is incorrect (e.g. approved blueprint shows 850 sq ft instead of 1100 sq ft)..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                Upload Supporting Evidence (PDF / JPG / PNG)
              </label>
              <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Paperclip className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="text-[11px] text-slate-600 block">
                  {file ? file.name : 'Click to attach survey plan, title deed, or photo'}
                </span>
                <span className="text-[10px] text-slate-400">Max size 5 MB</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !assessmentId}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Dispute...' : 'Submit Official Grievance'}
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Appeal Status Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            My Submitted Appeals & Adjudication Status ({grievances.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading grievance files...</div>
          ) : grievances.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 text-slate-400 text-xs">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
              No active or historical grievances on record.
            </div>
          ) : (
            <div className="space-y-4">
              {grievances.map((g) => (
                <div
                  key={g._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                        {g.grievanceNumber}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">
                        {g.disputeType}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Property: {g.property?.propertyIdentifier} • Filed on {new Date(g.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>{getStatusBadge(g.status)}</div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong className="text-slate-900 block mb-1">Citizen's Statement:</strong>
                    {g.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Original Assessed Tax</span>
                      <span className="font-mono font-bold text-slate-800">
                        ₹{g.originalTaxAmount?.toLocaleString()}
                      </span>
                    </div>

                    {g.adjustedTaxAmount !== null && g.adjustedTaxAmount !== undefined && (
                      <div>
                        <span className="text-emerald-600 block text-[11px] font-bold">
                          Municipal Adjusted Final Tax
                        </span>
                        <span className="font-mono font-bold text-emerald-700 text-sm">
                          ₹{g.adjustedTaxAmount?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {g.adminRemarks && (
                    <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-xs text-purple-900">
                      <strong className="block font-bold mb-0.5">Municipal Assessor Remarks:</strong>
                      {g.adminRemarks}
                    </div>
                  )}

                  {g.proofDocumentUrl && (
                    <div className="text-[11px]">
                      <a
                        href={`${API_BASE_URL}${g.proofDocumentUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold underline"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        View Attached Evidence Document
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grievances;

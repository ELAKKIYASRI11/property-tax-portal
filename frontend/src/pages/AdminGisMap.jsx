import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PropertyMap from '../components/PropertyMap';
import {
  MapPin,
  AlertOctagon,
  CheckCircle2,
  Send,
  Building2,
  Layers,
  Filter,
  Eye,
  Info,
} from 'lucide-react';

const AdminGisMap = () => {
  const [verifiedProperties, setVerifiedProperties] = useState([]);
  const [unassessedParcels, setUnassessedParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'verified' | 'unassessed'
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [noticeRemarks, setNoticeRemarks] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [issuingNotice, setIssuingNotice] = useState(false);

  const fetchGisData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/gis-layer');
      setVerifiedProperties(res.data.verifiedProperties || []);
      setUnassessedParcels(res.data.unassessedParcels || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGisData();
  }, []);

  const handleIssueNotice = async (parcelId) => {
    try {
      setIssuingNotice(true);
      await api.post(`/admin/unassessed/${parcelId}/notice`, {
        remarks: noticeRemarks || 'Statutory GIS survey notice issued under Section 112 Municipal Act.',
      });
      setActionSuccess('Official statutory compliance survey notice dispatched successfully!');
      setSelectedParcel(null);
      setNoticeRemarks('');
      fetchGisData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to issue notice');
    } finally {
      setIssuingNotice(false);
    }
  };

  const displayedVerified = filterMode === 'unassessed' ? [] : verifiedProperties;
  const displayedUnassessed = filterMode === 'verified' ? [] : unassessedParcels;

  const totalTaxLoss = unassessedParcels.reduce((sum, p) => sum + (p.estimatedAnnualTaxLoss || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-rose-300 uppercase">
              Headline Novelty Feature 1
            </span>
            <span className="text-xs text-slate-400 font-mono">GIS Spatial Verification Layer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            GIS Satellite Verification & Unassessed Property Anomaly Detection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cross-references Sathyamangalam Municipality tax registers against high-resolution GIS coordinates to identify unassessed structures and revenue leakages.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterMode === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Layers ({verifiedProperties.length + unassessedParcels.length})
          </button>
          <button
            onClick={() => setFilterMode('unassessed')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
              filterMode === 'unassessed' ? 'bg-rose-600 text-white' : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Unassessed Alerts ({unassessedParcels.length})
          </button>
          <button
            onClick={() => setFilterMode('verified')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
              filterMode === 'verified' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified ({verifiedProperties.length})
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Revenue Gap Alert Box */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl animate-pulse">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-900">
              {unassessedParcels.length} Unrecorded Real Estate Structures Detected via Satellite
            </h3>
            <p className="text-xs text-rose-700 mt-0.5">
              Identified built structures with zero tax assessment records. Estimated uncollected tax leakage:{' '}
              <strong className="font-mono text-rose-950 font-black">₹{totalTaxLoss.toLocaleString()}/year</strong>.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono bg-rose-200/60 text-rose-900 px-3 py-1.5 rounded-lg border border-rose-300 font-bold self-start sm:self-auto">
          Survey Section 112 Ready
        </span>
      </div>

      {/* Interactive Map */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs px-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              Verified Assessed Properties (Green Pins)
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 font-bold">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block animate-ping"></span>
              Flagged Unassessed Anomalies (Red Pins)
            </span>
          </div>
          <span className="text-slate-400 hidden sm:inline">Click any pin for spatial ledger audit</span>
        </div>

        <PropertyMap
          properties={displayedVerified}
          unassessedParcels={displayedUnassessed}
          onSelectParcel={(p) => setSelectedParcel(p)}
          height="460px"
          center={[11.5092, 77.2347]}
          zoom={14}
        />
      </div>

      {/* Flagged Anomalies Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-600" />
          Flagged Unassessed Parcel Audit Log ({unassessedParcels.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {unassessedParcels.map((parcel) => (
            <div
              key={parcel._id}
              className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {parcel.parcelId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      parcel.status === 'Notice Issued'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {parcel.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">
                  {parcel.detectedBuildingType}
                </h3>
                <p className="text-xs text-slate-600">
                  <strong>Location:</strong> {parcel.locationName} ({parcel.ward})
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Survey No:</strong> {parcel.surveyNumber}
                </p>
                <div className="text-xs text-slate-500">
                  Est. Built-up: <strong className="text-slate-800">{parcel.estimatedBuiltUpAreaSqFt} sq ft</strong>
                </div>
                <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100 text-xs">
                  <span className="text-rose-700 block text-[11px] font-semibold">Estimated Annual Tax Loss:</span>
                  <span className="text-base font-black font-mono text-rose-900">
                    ₹{parcel.estimatedAnnualTaxLoss?.toLocaleString()}
                  </span>
                </div>
                {parcel.adminActionRemarks && (
                  <p className="text-[11px] text-slate-500 italic">
                    "{parcel.adminActionRemarks}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedParcel(parcel)}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Issue Survey Notice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue Notice Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm">Issue Statutory GIS Compliance Notice</h3>
              </div>
              <button
                onClick={() => setSelectedParcel(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <p>
                  <strong>Parcel:</strong> {selectedParcel.parcelId} (Survey: {selectedParcel.surveyNumber})
                </p>
                <p>
                  <strong>Location:</strong> {selectedParcel.locationName}
                </p>
                <p className="text-rose-700 font-bold">
                  Est. Annual Loss: ₹{selectedParcel.estimatedAnnualTaxLoss?.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Survey & Enforcement Remarks
                </label>
                <textarea
                  rows={3}
                  value={noticeRemarks}
                  onChange={(e) => setNoticeRemarks(e.target.value)}
                  placeholder="Enter notice directives, physical inspection date, or field officer instructions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedParcel(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleIssueNotice(selectedParcel._id)}
                  disabled={issuingNotice}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
                >
                  {issuingNotice ? 'Dispatching...' : 'Dispatch Compliance Notice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGisMap;

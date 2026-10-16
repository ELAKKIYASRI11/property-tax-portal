import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ComplianceBadge from '../components/ComplianceBadge';
import PropertyMap from '../components/PropertyMap';
import {
  Building2,
  Plus,
  MapPin,
  Maximize2,
  Calendar,
  X,
  Calculator,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const Properties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    ownerName: user?.name || '',
    propertyType: 'Residential',
    buildingType: 'Pucca/RCC',
    constructionYear: 2018,
    occupancyStatus: 'Owner Occupied',
    landAreaSqFt: 1500,
    builtUpAreaSqFt: 1200,
    district: 'Coimbatore',
    municipality: 'Coimbatore City Corporation',
    ward: 'Ward 12 (Central)',
    street: 'Cross Cut Road',
    doorNo: '18-B',
    pincode: '641012',
    lat: 11.0168,
    lng: 76.9558,
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/properties');
      setProperties(res.data || []);
    } catch (err) {
      console.error('Error fetching properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationPick = (coords) => {
    setFormData((prev) => ({
      ...prev,
      lat: coords.lat,
      lng: coords.lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        ownerName: formData.ownerName,
        propertyType: formData.propertyType,
        buildingType: formData.buildingType,
        constructionYear: Number(formData.constructionYear),
        occupancyStatus: formData.occupancyStatus,
        landAreaSqFt: Number(formData.landAreaSqFt),
        builtUpAreaSqFt: Number(formData.builtUpAreaSqFt),
        location: {
          district: formData.district,
          municipality: formData.municipality,
          ward: formData.ward,
          street: formData.street,
          doorNo: formData.doorNo,
          pincode: formData.pincode,
        },
        gisCoordinates: {
          lat: Number(formData.lat),
          lng: Number(formData.lng),
        },
      };

      await api.post('/properties', payload);
      setSuccessMsg('Property successfully registered and mapped with municipal GIS records!');
      setShowAddModal(false);
      fetchProperties();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register property.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, identifier) => {
    if (!window.confirm(`Are you sure you want to remove property ${identifier}?`)) return;
    try {
      await api.delete(`/properties/${id}`);
      fetchProperties();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Registered Municipal Properties
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your registered real estate holdings, verify GIS spatial pins, and launch self-assessments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add / Register Property
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* GIS Map Overview */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">
              Spatial GIS Map Overview ({properties.length} Active Properties)
            </h2>
          </div>
          <span className="text-xs text-slate-400">Green pins represent your verified properties</span>
        </div>
        <PropertyMap
          properties={properties}
          height="320px"
          center={[11.0168, 76.9558]}
        />
      </div>

      {/* Property Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No properties registered yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add your first residential, commercial, or land parcel with location details and GIS coordinates.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-2 bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Register Property Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div
              key={prop._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-brand-300 hover:shadow-md transition p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded">
                      {prop.propertyIdentifier}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1.5">
                      {prop.propertyType}
                    </h3>
                  </div>
                  <ComplianceBadge
                    score={prop.complianceScore?.score}
                    rating={prop.complianceScore?.rating}
                    size="sm"
                  />
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      Door {prop.location?.doorNo}, {prop.location?.street}, {prop.location?.ward}, {prop.location?.municipality} - {prop.location?.pincode}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>
                      {prop.buildingType} • Built in {prop.constructionYear}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Maximize2 className="w-4 h-4 text-slate-400" />
                    <span>
                      Built-up: <strong className="text-slate-700">{prop.builtUpAreaSqFt} sq ft</strong> (Land: {prop.landAreaSqFt} sq ft)
                    </span>
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    Occupancy: <span className="text-slate-800 font-semibold">{prop.occupancyStatus}</span>
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">
                    GIS: {prop.gisCoordinates?.lat}, {prop.gisCoordinates?.lng}
                  </p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleDelete(prop._id, prop.propertyIdentifier)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Remove Property"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link
                  to={`/tax-calculator?propertyId=${prop._id}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Self-Assess Tax
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-base">Register New Municipal Property</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Owner & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    required
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Vacant Land">Vacant Land</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Building Construction</label>
                  <select
                    name="buildingType"
                    value={formData.buildingType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Pucca/RCC">Pucca / RCC (Standard)</option>
                    <option value="Semi-Pucca">Semi-Pucca</option>
                    <option value="Kutcha">Kutcha</option>
                    <option value="Vacant Plot">Vacant Plot</option>
                  </select>
                </div>
              </div>

              {/* Areas & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Land Area (Sq Ft)</label>
                  <input
                    type="number"
                    name="landAreaSqFt"
                    required
                    min={1}
                    value={formData.landAreaSqFt}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Built-up Area (Sq Ft)</label>
                  <input
                    type="number"
                    name="builtUpAreaSqFt"
                    required
                    min={0}
                    value={formData.builtUpAreaSqFt}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Construction Year</label>
                  <input
                    type="number"
                    name="constructionYear"
                    min={1950}
                    max={2026}
                    value={formData.constructionYear}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Occupancy Status</label>
                  <select
                    name="occupancyStatus"
                    value={formData.occupancyStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Owner Occupied">Owner Occupied (10% Rebate)</option>
                    <option value="Rented">Rented</option>
                    <option value="Vacant">Vacant</option>
                  </select>
                </div>
              </div>

              {/* Location Hierarchy */}
              <div className="border-t border-slate-200 pt-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Location Hierarchy (District → Municipality → Ward → Street → Door No.)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">District</label>
                    <input
                      type="text"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Municipality / Corp</label>
                    <input
                      type="text"
                      name="municipality"
                      required
                      value={formData.municipality}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Ward / Zone</label>
                    <input
                      type="text"
                      name="ward"
                      required
                      value={formData.ward}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Street / Road Name</label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Door / Flat No.</label>
                    <input
                      type="text"
                      name="doorNo"
                      required
                      value={formData.doorNo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">PIN Code</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive GIS Coordinate Picker */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    GIS Lat-Long Coordinates (Click Map to Place Pin)
                  </label>
                  <span className="font-mono text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    Lat: {formData.lat}, Lng: {formData.lng}
                  </span>
                </div>
                <PropertyMap
                  center={[formData.lat, formData.lng]}
                  selectedCoords={{ lat: formData.lat, lng: formData.lng }}
                  interactive={true}
                  onLocationSelect={handleLocationPick}
                  height="200px"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl font-bold shadow-md hover:shadow-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Save & Register Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;

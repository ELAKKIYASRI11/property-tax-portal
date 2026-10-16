import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ReceiptModal from '../components/ReceiptModal';
import { History, Search, Download, Printer, FileText, CheckCircle2, Building2 } from 'lucide-react';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments/history');
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const term = searchQuery.toLowerCase();
    return (
      p.receiptNumber?.toLowerCase().includes(term) ||
      p.transactionId?.toLowerCase().includes(term) ||
      p.property?.propertyIdentifier?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-emerald-600" />
            Payment History & Municipal Tax Receipts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access verified electronic receipts, transaction IDs, and compliance records for municipal submissions.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search receipt / PID / Txn ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading transactions...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-sm font-semibold">No payment records found</p>
            <p className="text-xs text-slate-400">Complete a tax assessment to generate your first receipt.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Receipt Number</th>
                  <th className="py-3.5 px-6">Property ID</th>
                  <th className="py-3.5 px-6">Transaction ID</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Method</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPayments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 font-bold text-slate-900 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {pay.receiptNumber}
                    </td>
                    <td className="py-4 px-6 font-semibold text-brand-700">
                      {pay.property?.propertyIdentifier || 'PID-N/A'}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-500 text-[11px]">
                      {pay.transactionId}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {new Date(pay.paymentDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 font-medium">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold font-mono text-emerald-700 text-sm">
                      ₹{pay.amountPaid?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedReceipt(pay)}
                        className="inline-flex items-center gap-1 bg-brand-50 hover:bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg font-bold text-xs transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        View / Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};

export default PaymentHistory;

import React from 'react';
import { X, Printer, CheckCircle2, Building, Calendar, FileText } from 'lucide-react';

const ReceiptModal = ({ payment, onClose }) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(payment.paymentDate || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-lg">Official Municipal Tax Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div id="printable-receipt" className="p-8 space-y-6 text-slate-800">
          {/* Header & Municipal Seal */}
          <div className="border-b border-slate-200 pb-5 flex items-start justify-between">
            <div>
              <div className="inline-block bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded mb-2">
                Team VEM Municipal Revenue Portal
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                PROPERTY TAX E-PAYMENT RECEIPT
              </h1>
              <p className="text-sm text-slate-500">
                Government Municipal Administration Department • Self-Assessment Wing
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold uppercase px-3 py-1 rounded-full border border-emerald-300">
                PAID & VERIFIED
              </span>
              <p className="text-xs text-slate-400 mt-1">Status: Success</p>
            </div>
          </div>

          {/* Key Reference Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Receipt Number</span>
              <span className="font-bold text-slate-900">{payment.receiptNumber}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Transaction ID</span>
              <span className="font-mono text-xs font-semibold text-slate-800 break-all">
                {payment.transactionId}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Payment Date</span>
              <span className="font-semibold text-slate-800">{formattedDate}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Payment Mode</span>
              <span className="font-bold text-brand-700">{payment.paymentMethod}</span>
            </div>
          </div>

          {/* Property & Taxpayer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2 border border-slate-200 p-4 rounded-xl">
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
                <Building className="w-4 h-4 text-brand-600" />
                Property Particulars
              </h4>
              <p className="font-bold text-base text-slate-900">
                {payment.property?.propertyIdentifier || 'PID-N/A'}
              </p>
              <p className="text-slate-600">
                <span className="font-medium text-slate-800">Type:</span> {payment.property?.propertyType} ({payment.property?.buildingType})
              </p>
              <p className="text-slate-600">
                <span className="font-medium text-slate-800">Address:</span> Door {payment.property?.location?.doorNo}, {payment.property?.location?.street}, {payment.property?.location?.ward}, {payment.property?.location?.municipality} - {payment.property?.location?.pincode}
              </p>
              <p className="text-slate-600">
                <span className="font-medium text-slate-800">Built-Up Area:</span> {payment.property?.builtUpAreaSqFt || 0} Sq. Ft.
              </p>
            </div>

            <div className="space-y-2 border border-slate-200 p-4 rounded-xl">
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
                <FileText className="w-4 h-4 text-brand-600" />
                Taxpayer & Assessment
              </h4>
              <p className="font-bold text-base text-slate-900">
                {payment.property?.ownerName || payment.user?.name || 'Taxpayer'}
              </p>
              <p className="text-slate-600">
                <span className="font-medium text-slate-800">Assessment ID:</span> {payment.assessment?.assessmentNumber || 'ASM-CURRENT'}
              </p>
              <p className="text-slate-600">
                <span className="font-medium text-slate-800">Financial Year:</span> {payment.assessment?.financialYear || '2025-2026'}
              </p>
              <p className="text-slate-600">
                <span className="font-medium text-slate-800">Occupancy:</span> {payment.property?.occupancyStatus}
              </p>
            </div>
          </div>

          {/* Tax Financial Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-sm">
            <div className="bg-slate-100 px-4 py-2 font-semibold text-xs text-slate-700 uppercase tracking-wider flex justify-between">
              <span>Assessment Breakdown Item</span>
              <span>Amount (INR)</span>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="px-4 py-2.5 flex justify-between text-slate-700">
                <span>Gross Property Assessment Tax</span>
                <span className="font-medium">
                  ₹{(payment.breakdownSnapshot?.grossTax || payment.amountPaid).toLocaleString()}
                </span>
              </div>
              {payment.breakdownSnapshot?.exemptions > 0 && (
                <div className="px-4 py-2.5 flex justify-between text-emerald-600">
                  <span>Auto-Applied Exemptions & Concessions</span>
                  <span className="font-medium">
                    - ₹{payment.breakdownSnapshot.exemptions.toLocaleString()}
                  </span>
                </div>
              )}
              {payment.breakdownSnapshot?.latePenalty > 0 && (
                <div className="px-4 py-2.5 flex justify-between text-rose-600">
                  <span>Overdue Statutory Surcharge</span>
                  <span className="font-medium">
                    + ₹{payment.breakdownSnapshot.latePenalty.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="px-4 py-3 bg-slate-50 flex justify-between text-base font-bold text-slate-900 border-t-2 border-slate-300">
                <span>Total Amount Paid in Full</span>
                <span className="text-emerald-700 font-mono text-lg">
                  ₹{payment.amountPaid?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer & Authenticity stamp */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <div className="space-y-1">
              <p>This is a computer-generated tax compliance certificate and does not require a physical signature.</p>
              <p>Secured via cryptographic hash verification & municipal compliance tracking ledger.</p>
            </div>
            <div className="text-right font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded border border-slate-300">
              [VEM-VALIDATED-2026]
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;

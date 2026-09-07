import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

const ComplianceBadge = ({ score = 85, rating = 'Good', showScore = true, size = 'md' }) => {
  let color = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let Icon = ShieldCheck;
  let label = 'Good Compliance';

  if (rating === 'Defaulter' || score < 50) {
    color = 'bg-rose-100 text-rose-800 border-rose-300';
    Icon = AlertOctagon;
    label = 'Defaulter Risk';
  } else if (rating === 'At Risk' || score < 80) {
    color = 'bg-amber-100 text-amber-800 border-amber-300';
    Icon = AlertTriangle;
    label = 'At Risk';
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'lg' 
    ? 'text-sm px-3.5 py-1.5 font-semibold' 
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${color} ${sizeClasses} shadow-sm`}>
      <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>{label}</span>
      {showScore && (
        <span className="font-bold opacity-90 ml-0.5">
          ({score}/100)
        </span>
      )}
    </div>
  );
};

export default ComplianceBadge;

/**
 * Tax Calculation Engine for Municipal Self-Assessment
 * Formula: Area × Zone Rate → Usage Multiplier → Building Type Factor → Depreciation → Occupancy Factor → Rebates
 */

const calculatePropertyTax = (property, user, isOverdue = false) => {
  const currentYear = new Date().getFullYear();
  const propertyType = property.propertyType || 'Residential';
  const buildingType = property.buildingType || 'Pucca/RCC';
  const occupancyStatus = property.occupancyStatus || 'Owner Occupied';

  // Determine area to assess
  const areaEvaluated =
    propertyType === 'Vacant Land'
      ? Number(property.landAreaSqFt) || 1000
      : Number(property.builtUpAreaSqFt) || Number(property.landAreaSqFt) || 1000;

  // 1. Base Zone Rate per Sq. Ft.
  let zoneBaseRate = 12; // default residential
  if (propertyType === 'Commercial') zoneBaseRate = 28;
  else if (propertyType === 'Industrial') zoneBaseRate = 35;
  else if (propertyType === 'Agricultural') zoneBaseRate = 6;
  else if (propertyType === 'Vacant Land') zoneBaseRate = 8;

  const baseTax = Math.round(areaEvaluated * zoneBaseRate);

  // 2. Usage Multiplier
  let usageMultiplier = 1.0;
  if (propertyType === 'Commercial') usageMultiplier = 1.8;
  else if (propertyType === 'Industrial') usageMultiplier = 2.2;
  else if (propertyType === 'Agricultural') usageMultiplier = 0.6;
  else if (propertyType === 'Vacant Land') usageMultiplier = 0.8;

  // 3. Building Type Factor
  let buildingTypeFactor = 1.2; // Pucca/RCC
  if (buildingType === 'Semi-Pucca') buildingTypeFactor = 1.0;
  else if (buildingType === 'Kutcha') buildingTypeFactor = 0.7;
  else if (buildingType === 'Vacant Plot') buildingTypeFactor = 0.5;

  // Subtotal before depreciation
  const subtotalBeforeDepreciation = baseTax * usageMultiplier * buildingTypeFactor;

  // 4. Depreciation based on building age
  const constructionYear = Number(property.constructionYear) || (currentYear - 10);
  const buildingAge = Math.max(0, currentYear - constructionYear);
  // 1.5% per year, capped at 40% (0.40)
  const depreciationRate = Math.min(0.40, parseFloat((buildingAge * 0.015).toFixed(3)));
  const depreciationAmount = Math.round(subtotalBeforeDepreciation * depreciationRate);
  const depreciatedTax = subtotalBeforeDepreciation - depreciationAmount;

  // 5. Occupancy Factor
  let occupancyFactor = 1.0; // Owner Occupied
  if (occupancyStatus === 'Rented') occupancyFactor = 1.35;
  else if (occupancyStatus === 'Vacant') occupancyFactor = 1.1;

  const grossTaxAmount = Math.round(depreciatedTax * occupancyFactor);

  // 6. Novelty: Auto-Applied Exemptions & Rebates based on profile & property
  const exemptions = [];

  // A. Senior Citizen Exemption (Age >= 60)
  let isSeniorCitizen = false;
  if (user && user.dateOfBirth) {
    const dob = new Date(user.dateOfBirth);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age >= 60) isSeniorCitizen = true;
  }
  if (isSeniorCitizen && propertyType === 'Residential') {
    const rebateAmount = Math.round(grossTaxAmount * 0.15);
    exemptions.push({
      name: 'Senior Citizen Rebate (15%)',
      percentage: 15,
      amount: rebateAmount,
    });
  }

  // B. Homestead / Owner-Occupied Exemption
  if (occupancyStatus === 'Owner Occupied' && propertyType === 'Residential') {
    const rebateAmount = Math.round(grossTaxAmount * 0.10);
    exemptions.push({
      name: 'Homestead Owner-Occupied Rebate (10%)',
      percentage: 10,
      amount: rebateAmount,
    });
  }

  // C. Differently Abled Owner Exemption
  if (user && user.isDifferentlyAbled) {
    const rebateAmount = Math.round(grossTaxAmount * 0.20);
    exemptions.push({
      name: 'Differently Abled Owner Rebate (20%)',
      percentage: 20,
      amount: rebateAmount,
    });
  }

  // D. Agricultural Green Land Rebate
  if (propertyType === 'Agricultural') {
    const rebateAmount = Math.round(grossTaxAmount * 0.25);
    exemptions.push({
      name: 'Agricultural Land Support Rebate (25%)',
      percentage: 25,
      amount: rebateAmount,
    });
  }

  const totalExemptionAmount = exemptions.reduce((sum, item) => sum + item.amount, 0);

  // 7. Overdue Penalty
  const latePenalty = isOverdue ? Math.round(grossTaxAmount * 0.05) : 0;

  // Final Net Payable
  const netPayableAmount = Math.max(100, grossTaxAmount - totalExemptionAmount + latePenalty);

  return {
    areaEvaluated,
    areaType: propertyType === 'Vacant Land' ? 'Land Area' : 'Built-up Area',
    zoneBaseRate,
    baseTax,
    usageMultiplier,
    buildingTypeFactor,
    buildingAge,
    depreciationRate: Math.round(depreciationRate * 100), // in percentage
    depreciationAmount,
    occupancyFactor,
    grossTaxAmount,
    exemptions,
    totalExemptionAmount,
    latePenalty,
    netPayableAmount,
  };
};

module.exports = { calculatePropertyTax };

/**
 * Sathyamangalam Municipality — Location Reference Data
 * District: Erode | State: Tamil Nadu | Pincode: 638401
 * GIS Center: 11.5092° N, 77.2347° E
 */

export const DISTRICT = 'Erode';
export const MUNICIPALITY = 'Sathyamangalam Municipality';
export const PINCODE = '638401';

// Sathyamangalam GIS center coordinates
export const SATHY_CENTER = [11.5092, 77.2347];

// Ward numbers (1-27) of Sathyamangalam Municipality
export const WARDS = Array.from({ length: 27 }, (_, i) => `Ward ${String(i + 1).padStart(2, '0')}`);

// GIS bounding coordinates per ward (approximate lat/lng offsets from town center)
// Used to auto-shift GIS pin when user selects a ward
export const WARD_COORDS = {
  'Ward 01': { lat: 11.5145, lng: 77.2280 }, // North Zone - Bus Stand area
  'Ward 02': { lat: 11.5132, lng: 77.2305 }, // North - Railway Colony
  'Ward 03': { lat: 11.5118, lng: 77.2330 }, // Central - Anna Nagar
  'Ward 04': { lat: 11.5105, lng: 77.2355 }, // Central - Main Bazaar
  'Ward 05': { lat: 11.5092, lng: 77.2380 }, // Central East - Market
  'Ward 06': { lat: 11.5080, lng: 77.2400 }, // East - Pachapalayam Road
  'Ward 07': { lat: 11.5065, lng: 77.2420 }, // East - Nehru Nagar
  'Ward 08': { lat: 11.5050, lng: 77.2395 }, // South East - Pillayar Koil St
  'Ward 09': { lat: 11.5040, lng: 77.2370 }, // South - Gandhi Nagar
  'Ward 10': { lat: 11.5030, lng: 77.2345 }, // South - Kamaraj Colony
  'Ward 11': { lat: 11.5022, lng: 77.2320 }, // South West - Sirupooluvapatti Rd
  'Ward 12': { lat: 11.5038, lng: 77.2295 }, // West - Govindapuram
  'Ward 13': { lat: 11.5055, lng: 77.2270 }, // West - Shanmugapuram
  'Ward 14': { lat: 11.5072, lng: 77.2248 }, // North West - Vasantha Nagar
  'Ward 15': { lat: 11.5090, lng: 77.2260 }, // North West - BHR Colony
  'Ward 16': { lat: 11.5110, lng: 77.2285 }, // North - Pillayar Koil St North
  'Ward 17': { lat: 11.5128, lng: 77.2265 }, // North - Vivekananda Nagar
  'Ward 18': { lat: 11.5150, lng: 77.2315 }, // Far North - Ponnusamy Colony
  'Ward 19': { lat: 11.5160, lng: 77.2348 }, // Far North East - TNHB Colony
  'Ward 20': { lat: 11.5100, lng: 77.2415 }, // East Extension - Sathy East
  'Ward 21': { lat: 11.5075, lng: 77.2440 }, // Far East - Ooty Road End
  'Ward 22': { lat: 11.5018, lng: 77.2298 }, // South - Vinayaga Nagar
  'Ward 23': { lat: 11.4995, lng: 77.2330 }, // Far South - Bhavani Road Area
  'Ward 24': { lat: 11.5010, lng: 77.2362 }, // South East fringe
  'Ward 25': { lat: 11.5095, lng: 77.2330 }, // Central - Town Hall area
  'Ward 26': { lat: 11.5115, lng: 77.2360 }, // Central North - Court area
  'Ward 27': { lat: 11.5140, lng: 77.2380 }, // North East - Collector Office area
};

// Areas / Localities grouped by ward
export const WARD_AREAS = {
  'Ward 01': ['Bus Stand Area', 'Dharapuram Road North', 'KSRTC Colony'],
  'Ward 02': ['Railway Colony', 'Railway Station Road', 'Periyar Nagar'],
  'Ward 03': ['Anna Nagar', 'Indira Nagar', 'Subramani Nagar'],
  'Ward 04': ['Main Bazaar', 'North Car Street', 'South Car Street'],
  'Ward 05': ['Market Area', 'Old Trunk Road', 'Mettur Road Junction'],
  'Ward 06': ['Pachapalayam Road', 'Krishnaswamy Nagar', 'Vettukalpalayam Road'],
  'Ward 07': ['Nehru Nagar', 'Ambedkar Nagar', 'Palayam Layout'],
  'Ward 08': ['Pillayar Koil Street', 'Raja Street', 'Sengodan Street'],
  'Ward 09': ['Gandhi Nagar', 'Muthamizh Nagar', 'Ponni Nagar'],
  'Ward 10': ['Kamaraj Colony', 'Karpagam Nagar', 'LIC Colony'],
  'Ward 11': ['Sirupooluvapatti Road', 'Saraswathi Nagar', 'Teachers Colony'],
  'Ward 12': ['Govindapuram', 'Murugan Nagar', 'Vinayagam Layout'],
  'Ward 13': ['Shanmugapuram', 'Thendral Nagar', 'Selvaraj Nagar'],
  'Ward 14': ['Vasantha Nagar', 'Sakthi Nagar', 'Veerappan Nagar'],
  'Ward 15': ['BHR Colony', 'Housing Board Colony', 'PWD Colony'],
  'Ward 16': ['Pillayar Koil Street North', 'Mani Nagar', 'Sengottai Nagar'],
  'Ward 17': ['Vivekananda Nagar', 'Thiruvalluvar Nagar', 'Rajiv Gandhi Nagar'],
  'Ward 18': ['Ponnusamy Colony', 'Natarajan Nagar', 'North Extension'],
  'Ward 19': ['TNHB Colony', 'Tamil Nadu Housing Board', 'Valluvar Nagar'],
  'Ward 20': ['Sathy East Area', 'Ooty Road Bypass', 'SIPCOT Road'],
  'Ward 21': ['Mettur Road Layout', 'Ooty Road East', 'Green Valley'],
  'Ward 22': ['Vinayaga Nagar', 'Ganapathi Colony', 'Sankar Nagar'],
  'Ward 23': ['Bhavani Road', 'Erode Road', 'Sambandam Colony'],
  'Ward 24': ['Anbu Nagar', 'Veerapandi Road', 'South Fringe'],
  'Ward 25': ['Town Hall Area', 'Hospital Road', 'Court Compound'],
  'Ward 26': ['Court Area', 'Collector Colony', 'Revenue Office Road'],
  'Ward 27': ['Collector Office Area', 'Police Line', 'Sengottai Cross'],
};

// Streets per area (where well-defined data exists)
export const AREA_STREETS = {
  // Ward 01
  'Bus Stand Area': ['Bus Stand Road', 'Old Dharapuram Road', 'Service Road'],
  'Railway Colony': ['1st Cross Street', '2nd Cross Street', 'Main Road'],

  // Ward 03
  'Anna Nagar': ['Anna Nagar Main Road', '1st Street', '2nd Street', '3rd Street'],
  'Indira Nagar': ['Indira Nagar Road', 'Cross Street'],

  // Ward 04
  'Main Bazaar': ['Main Bazaar Street', 'North Mada Street', 'South Mada Street', 'Bazaar Road'],
  'North Car Street': ['North Car Street'],
  'South Car Street': ['South Car Street'],

  // Ward 05
  'Market Area': ['Market Road', 'Old Market Street', 'Vegetable Market Lane'],

  // Ward 06
  'Pachapalayam Road': ['Pachapalayam Main Road', '1st Cross', '2nd Cross'],
  'Krishnaswamy Nagar': ['Krishnaswamy Nagar Road', 'Cross Street 1', 'Cross Street 2'],

  // Ward 08
  'Pillayar Koil Street': ['Pillayar Koil Street', 'Temple Street', 'East Agraharam'],
  'Raja Street': ['Raja Street', 'Raja Street East', 'Raja Street West'],

  // Ward 09
  'Gandhi Nagar': ['Gandhi Nagar Main Road', '1st Cross', '2nd Cross', '3rd Cross'],
  'Muthamizh Nagar': ['Muthamizh Nagar Road', 'Mela Street', 'Keela Street'],

  // Ward 10
  'Kamaraj Colony': ['Kamaraj Colony Road', 'Kamaraj 1st Street', 'Kamaraj 2nd Street'],
  'LIC Colony': ['LIC Colony Main Road', 'Cross Street'],

  // Ward 11
  'Sirupooluvapatti Road': ['Sirupooluvapatti Main Road', 'Bypass Road', 'Sathy–Ooty Road'],
  'Saraswathi Nagar': ['Saraswathi Nagar Main Road', '1st Street', '2nd Street'],
  'Teachers Colony': ['Teachers Colony Road', 'Cross Street'],

  // Ward 12
  'Govindapuram': ['Govindapuram Main Road', '1st Street', '2nd Street', '3rd Street'],

  // Ward 14
  'Vasantha Nagar': ['Vasantha Nagar Main Road', '1st Cross', '2nd Cross'],

  // Ward 15
  'Housing Board Colony': ['HB Colony Main Road', '1st Block', '2nd Block', '3rd Block'],
  'BHR Colony': ['BHR Colony Road', 'Cross Street'],

  // Ward 19
  'TNHB Colony': ['TNHB Main Road', 'Block A', 'Block B', 'Block C'],

  // Ward 22
  'Vinayaga Nagar': ['Vinayaga Nagar Road', '1st Street', '2nd Street'],
  'Ganapathi Colony': ['Ganapathi Colony Road', 'Cross Street'],

  // Ward 23
  'Bhavani Road': ['Bhavani Main Road', 'Sathy–Bhavani National Highway', 'Old Bhavani Road'],

  // Ward 25
  'Town Hall Area': ['Town Hall Road', 'Market Road', 'Hospital Road'],
  'Hospital Road': ['Government Hospital Road', 'PHC Road'],

  // Ward 26
  'Court Area': ['Court Road', 'District Court Lane', 'Bar Association Road'],
};

/**
 * Get streets for a given area. Returns predefined list or empty array (manual input mode).
 */
export const getStreets = (area) => AREA_STREETS[area] || [];

/**
 * Get GIS coordinates for a given ward with a small random offset for realism.
 */
export const getWardCoords = (ward) => {
  const base = WARD_COORDS[ward] || { lat: 11.5092, lng: 77.2347 };
  return {
    lat: parseFloat((base.lat + (Math.random() - 0.5) * 0.002).toFixed(6)),
    lng: parseFloat((base.lng + (Math.random() - 0.5) * 0.002).toFixed(6)),
  };
};

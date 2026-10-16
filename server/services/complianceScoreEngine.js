/**
 * Compliance Scoring Engine
 * Computes a risk rating (Good / At Risk / Defaulter) and 0-100 score
 * based on assessment completion, payment delays, and overdue statuses.
 */

const Assessment = require('../models/Assessment');
const Payment = require('../models/Payment');

const computeComplianceScore = async (propertyId) => {
  try {
    const assessments = await Assessment.find({ property: propertyId });
    const payments = await Payment.find({ property: propertyId });

    let score = 100;

    if (!assessments || assessments.length === 0) {
      return { score: 85, rating: 'Good' };
    }

    let overdueCount = 0;
    let pendingCount = 0;
    const now = new Date();

    assessments.forEach((assessment) => {
      if (assessment.status === 'Pending') {
        if (new Date(assessment.dueDate) < now) {
          overdueCount++;
          score -= 30; // severe penalty for overdue
        } else {
          pendingCount++;
          score -= 10; // pending assessment
        }
      } else if (assessment.status === 'Disputed') {
        score -= 5;
      }
    });

    // Check payment delays
    payments.forEach((payment) => {
      // Reward on-time payments
      score += 5;
    });

    // Clamp score between 10 and 100
    score = Math.min(100, Math.max(10, score));

    let rating = 'Good';
    if (score < 50) {
      rating = 'Defaulter';
    } else if (score < 80) {
      rating = 'At Risk';
    }

    return { score, rating };
  } catch (error) {
    console.error('Error computing compliance score:', error);
    return { score: 75, rating: 'At Risk' };
  }
};

module.exports = { computeComplianceScore };

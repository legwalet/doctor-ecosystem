import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

interface ReferralFormProps {
  patientId: string;
  patientName: string;
  onClose: () => void;
  onSubmit?: () => void;
}

const ReferralForm: React.FC<ReferralFormProps> = ({ patientId, patientName, onClose, onSubmit }) => {
  const { doctors, currentUser, createReferral } = useStore();
  const [formData, setFormData] = useState({
    toDoctorId: '',
    reason: '',
    notes: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    specialtyRequested: '',
    patientCondition: '',
    expectedOutcome: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out current user from doctor options
  const availableDoctors = doctors.filter(d => d.id !== currentUser?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.toDoctorId || !formData.reason.trim() || !currentUser) return;

    setIsSubmitting(true);
    
    try {
      const selectedDoctor = doctors.find(d => d.id === formData.toDoctorId);
      
      createReferral({
        patientId,
        patientName,
        fromDoctorId: currentUser.id,
        fromDoctorName: currentUser.name,
        toDoctorId: formData.toDoctorId,
        toDoctorName: selectedDoctor?.name || '',
        reason: formData.reason,
        notes: formData.notes,
        urgency: formData.urgency,
        specialtyRequested: formData.specialtyRequested || selectedDoctor?.specialization || '',
        patientCondition: formData.patientCondition,
        expectedOutcome: formData.expectedOutcome
      });

      onSubmit?.();
      onClose();
    } catch (error) {
      console.error('Error creating referral:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDoctorChange = (doctorId: string) => {
    const selectedDoctor = doctors.find(d => d.id === doctorId);
    setFormData(prev => ({
      ...prev,
      toDoctorId: doctorId,
      specialtyRequested: selectedDoctor?.specialization || ''
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Refer Patient: {patientName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refer to Doctor *
            </label>
            <select
              value={formData.toDoctorId}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a doctor...</option>
              {availableDoctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization} ({doctor.location})
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Requested */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialty Requested
            </label>
            <input
              type="text"
              value={formData.specialtyRequested}
              onChange={(e) => setFormData(prev => ({ ...prev, specialtyRequested: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Cardiology, Dermatology..."
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level *
            </label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="low">Low - Routine consultation</option>
              <option value="medium">Medium - Within 2 weeks</option>
              <option value="high">High - Within 1 week</option>
              <option value="urgent">Urgent - Within 24-48 hours</option>
            </select>
          </div>

          {/* Reason for Referral */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Referral *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              placeholder="Brief summary of why this referral is needed..."
              required
            />
          </div>

          {/* Patient Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Patient Condition
            </label>
            <textarea
              value={formData.patientCondition}
              onChange={(e) => setFormData(prev => ({ ...prev, patientCondition: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              placeholder="Current symptoms, relevant medical history..."
            />
          </div>

          {/* Expected Outcome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Outcome
            </label>
            <textarea
              value={formData.expectedOutcome}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedOutcome: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              placeholder="What you hope to achieve with this referral..."
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              placeholder="Any additional information that might be helpful..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.toDoctorId || !formData.reason.trim()}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Referral
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ReferralForm;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const AddPatientForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'male' as const,
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: 'unknown' as const,
    allergies: [] as string[],
    currentMedications: [] as string[],
    chronicConditions: [] as string[],
    chiefComplaint: '',
    currentSymptoms: '',
    painLevel: 0,
    insuranceProvider: '',
    familyHistory: '',
    lifestyleFactors: {
      smoking: false,
      alcohol: false,
      exercise: '',
      diet: '',
      occupation: ''
    }
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const { currentUser, addPatient } = useStore();

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setFormData(prev => ({
        ...prev,
        currentMedications: [...prev.currentMedications, newMedication.trim()]
      }));
      setNewMedication('');
    }
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        chronicConditions: [...prev.chronicConditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const handleSubmit = () => {
    if (currentUser) {
      // Calculate age from date of birth
      const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      };

      const newPatient = {
        id: `pat_${Date.now()}`,
        name: formData.name,
        age: calculateAge(formData.dateOfBirth),
        condition: formData.chiefComplaint || 'New Patient',
        lastVisit: new Date().toISOString().split('T')[0],
        nextAppointment: '',
        doctorId: currentUser.id,
        contactNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        addedBy: currentUser.id,
        emergencyContact: {
          name: formData.emergencyContact,
          phone: formData.emergencyPhone,
          relationship: 'Emergency Contact'
        },
        allergies: formData.allergies,
        currentMedications: formData.currentMedications,
        medicalHistory: formData.chronicConditions,
        notes: `Initial registration: ${formData.chiefComplaint}`
      };

      addPatient(newPatient);
      onClose();
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.dateOfBirth && formData.phoneNumber;
      case 2:
        return formData.emergencyContact && formData.emergencyPhone;
      case 3:
        return formData.chiefComplaint || formData.currentSymptoms;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Add New Patient</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-medical-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="input-field"
                    placeholder="Enter patient's full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                    className="input-field"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    className="input-field"
                    placeholder="+27 12 345 6789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="input-field"
                    placeholder="patient@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    className="input-field"
                    placeholder="Full residential address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Emergency Contact & Medical Basics */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Emergency Contact & Medical Basics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name *</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                    className="input-field"
                    placeholder="Emergency contact person"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => updateFormData('emergencyPhone', e.target.value)}
                    className="input-field"
                    placeholder="+27 12 345 6789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => updateFormData('bloodType', e.target.value)}
                    className="input-field"
                  >
                    <option value="unknown">Unknown</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
                  <input
                    type="text"
                    value={formData.insuranceProvider}
                    onChange={(e) => updateFormData('insuranceProvider', e.target.value)}
                    className="input-field"
                    placeholder="Medical aid or insurance"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Medical Assessment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Medical Assessment</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint</label>
                <textarea
                  value={formData.chiefComplaint}
                  onChange={(e) => updateFormData('chiefComplaint', e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Primary reason for visit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Symptoms</label>
                <textarea
                  value={formData.currentSymptoms}
                  onChange={(e) => updateFormData('currentSymptoms', e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Describe current symptoms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pain Level (0-10)</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.painLevel}
                  onChange={(e) => updateFormData('painLevel', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>No Pain</span>
                  <span>{formData.painLevel}/10</span>
                  <span>Severe Pain</span>
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    className="flex-1 input-field"
                    placeholder="Add allergy (e.g., Penicillin, Latex)"
                  />
                  <button
                    type="button"
                    onClick={addAllergy}
                    className="px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-secondary"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    className="flex-1 input-field"
                    placeholder="Add medication"
                  />
                  <button
                    type="button"
                    onClick={addMedication}
                    className="px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-secondary"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.currentMedications.map((medication, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {medication}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chronic Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="flex-1 input-field"
                    placeholder="Add chronic condition"
                  />
                  <button
                    type="button"
                    onClick={addCondition}
                    className="px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-secondary"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.chronicConditions.map((condition, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family History</label>
                <textarea
                  value={formData.familyHistory}
                  onChange={(e) => updateFormData('familyHistory', e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Relevant family medical history"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid(currentStep)}
                className="px-6 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep)}
                className="px-6 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Patient
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddPatientForm; 
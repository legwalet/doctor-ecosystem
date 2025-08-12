import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../store/useStore';

// Types
interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface VitalSigns {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
}

// Icons
const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

interface ConsultationInterfaceProps {
  consultationId?: string;
  patientId?: string;
  onClose?: () => void;
}

const ConsultationInterface: React.FC<ConsultationInterfaceProps> = ({ 
  consultationId, 
  patientId, 
  onClose 
}) => {
  const navigate = useNavigate();
  const params = useParams();
  
  // Get IDs from props or URL params
  const activeConsultationId = consultationId || params.consultationId;
  const activePatientId = patientId || params.patientId;

  const { 
    patients, 
    consultations, 
    currentUser, 
    updateConsultationNotes,
    addConsultation,
    getConsultationsByPatient 
  } = useStore();

  // State
  const [activeTab, setActiveTab] = useState<'notes' | 'prescriptions' | 'vitals' | 'summary'>('notes');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [examination, setExamination] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [vitals, setVitals] = useState<VitalSigns>({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: ''
  });
  const [isConsultationStarted, setIsConsultationStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Get patient and consultation data
  const patient = patients.find(p => p.id === activePatientId);
  const consultation = consultations.find(c => c.id === activeConsultationId);
  const patientHistory = getConsultationsByPatient(activePatientId || '');

  useEffect(() => {
    if (consultation && consultation.notes) {
      // Load existing consultation data if editing
      setConsultationNotes(consultation.notes);
      setIsConsultationStarted(true);
    }
  }, [consultation]);

  const startConsultation = () => {
    setIsConsultationStarted(true);
    setStartTime(new Date());
  };

  const addPrescription = () => {
    const newPrescription: Prescription = {
      id: `presc_${Date.now()}`,
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setPrescriptions([...prescriptions, newPrescription]);
  };

  const updatePrescription = (id: string, field: keyof Prescription, value: string) => {
    setPrescriptions(prescriptions.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const removePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const saveConsultation = () => {
    if (!patient || !currentUser) return;

    const consultationData = {
      patientId: patient.id,
      patientName: patient.name,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
      notes: consultationNotes,
      chiefComplaint,
      examination,
      assessment,
      plan,
      prescriptions: prescriptions.filter(p => p.medication.trim()),
      vitals,
      type: 'past' as const,
      status: 'completed' as const,
      duration: startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60) : 0
    };

    if (activeConsultationId) {
      // Update existing consultation
      updateConsultationNotes(activeConsultationId, JSON.stringify(consultationData));
    } else {
      // Create new consultation
      addConsultation(consultationData);
    }

    // Navigate back or close
    if (onClose) {
      onClose();
    } else {
      navigate('/dashboard/patients');
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/dashboard');
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to find the patient for this consultation.</p>
          <button onClick={handleClose} className="btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-medical-primary p-2 rounded-full text-white">
                <UserIcon />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Consultation - {patient.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {patient.age} years old • {patient.condition}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {startTime && (
                <div className="text-sm text-gray-600">
                  Started: {startTime.toLocaleTimeString()}
                </div>
              )}
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Name:</span> {patient.name}</div>
                <div><span className="font-medium">Age:</span> {patient.age}</div>
                <div><span className="font-medium">Condition:</span> {patient.condition}</div>
                <div><span className="font-medium">Phone:</span> {patient.contactNumber}</div>
                <div><span className="font-medium">Email:</span> {patient.email}</div>
                <div><span className="font-medium">Address:</span> {patient.address}</div>
              </div>
            </div>

            {/* Recent History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Recent History</h3>
              <div className="space-y-2">
                {patientHistory.slice(0, 3).map((hist) => (
                  <div key={hist.id} className="text-sm border-l-2 border-medical-light pl-2">
                    <div className="font-medium">{hist.doctorName}</div>
                    <div className="text-gray-600">{hist.date}</div>
                    {hist.notes && (
                      <div className="text-gray-700 text-xs mt-1 bg-gray-50 p-1 rounded">
                        {hist.notes.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Consultation Area */}
          <div className="lg:col-span-3">
            {!isConsultationStarted ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="mb-6">
                  <div className="bg-medical-primary bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardIcon />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Consultation</h2>
                  <p className="text-gray-600">Click the button below to begin the consultation with {patient.name}</p>
                </div>
                <button
                  onClick={startConsultation}
                  className="btn-primary text-lg px-8 py-3"
                >
                  Start Consultation
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'notes', label: 'Clinical Notes', icon: <ClipboardIcon /> },
                      { id: 'prescriptions', label: 'Prescriptions', icon: <PlusIcon /> },
                      { id: 'vitals', label: 'Vital Signs', icon: <HeartIcon /> },
                      { id: 'summary', label: 'Summary', icon: <SaveIcon /> }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-medical-primary text-medical-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'notes' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chief Complaint
                        </label>
                        <textarea
                          value={chiefComplaint}
                          onChange={(e) => setChiefComplaint(e.target.value)}
                          className="form-textarea"
                          rows={2}
                          placeholder="What brings the patient in today?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Physical Examination
                        </label>
                        <textarea
                          value={examination}
                          onChange={(e) => setExamination(e.target.value)}
                          className="form-textarea"
                          rows={4}
                          placeholder="Physical examination findings..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assessment
                        </label>
                        <textarea
                          value={assessment}
                          onChange={(e) => setAssessment(e.target.value)}
                          className="form-textarea"
                          rows={3}
                          placeholder="Clinical assessment and diagnosis..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Treatment Plan
                        </label>
                        <textarea
                          value={plan}
                          onChange={(e) => setPlan(e.target.value)}
                          className="form-textarea"
                          rows={3}
                          placeholder="Treatment plan and follow-up instructions..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Notes
                        </label>
                        <textarea
                          value={consultationNotes}
                          onChange={(e) => setConsultationNotes(e.target.value)}
                          className="form-textarea"
                          rows={4}
                          placeholder="Additional notes, observations, or important information..."
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'prescriptions' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Medications</h3>
                        <button
                          onClick={addPrescription}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <PlusIcon />
                          <span>Add Medication</span>
                        </button>
                      </div>

                      {prescriptions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No medications prescribed yet.</p>
                          <p className="text-sm">Click "Add Medication" to prescribe.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {prescriptions.map((prescription) => (
                            <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Medication
                                  </label>
                                  <input
                                    type="text"
                                    value={prescription.medication}
                                    onChange={(e) => updatePrescription(prescription.id, 'medication', e.target.value)}
                                    className="form-input"
                                    placeholder="e.g., Amoxicillin"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dosage
                                  </label>
                                  <input
                                    type="text"
                                    value={prescription.dosage}
                                    onChange={(e) => updatePrescription(prescription.id, 'dosage', e.target.value)}
                                    className="form-input"
                                    placeholder="e.g., 500mg"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Frequency
                                  </label>
                                  <input
                                    type="text"
                                    value={prescription.frequency}
                                    onChange={(e) => updatePrescription(prescription.id, 'frequency', e.target.value)}
                                    className="form-input"
                                    placeholder="e.g., 3 times daily"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration
                                  </label>
                                  <input
                                    type="text"
                                    value={prescription.duration}
                                    onChange={(e) => updatePrescription(prescription.id, 'duration', e.target.value)}
                                    className="form-input"
                                    placeholder="e.g., 7 days"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Instructions
                                  </label>
                                  <input
                                    type="text"
                                    value={prescription.instructions}
                                    onChange={(e) => updatePrescription(prescription.id, 'instructions', e.target.value)}
                                    className="form-input"
                                    placeholder="e.g., Take with food"
                                  />
                                </div>
                              </div>
                              <div className="mt-3 flex justify-end">
                                <button
                                  onClick={() => removePrescription(prescription.id)}
                                  className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                                >
                                  <TrashIcon />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'vitals' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Blood Pressure
                        </label>
                        <input
                          type="text"
                          value={vitals.bloodPressure}
                          onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
                          className="form-input"
                          placeholder="e.g., 120/80"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heart Rate (bpm)
                        </label>
                        <input
                          type="text"
                          value={vitals.heartRate}
                          onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
                          className="form-input"
                          placeholder="e.g., 72"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Temperature (°C)
                        </label>
                        <input
                          type="text"
                          value={vitals.temperature}
                          onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
                          className="form-input"
                          placeholder="e.g., 36.8"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="text"
                          value={vitals.weight}
                          onChange={(e) => setVitals({...vitals, weight: e.target.value})}
                          className="form-input"
                          placeholder="e.g., 70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Height (cm)
                        </label>
                        <input
                          type="text"
                          value={vitals.height}
                          onChange={(e) => setVitals({...vitals, height: e.target.value})}
                          className="form-input"
                          placeholder="e.g., 175"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'summary' && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">Consultation Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Patient:</span> {patient.name}
                          </div>
                          <div>
                            <span className="font-medium">Doctor:</span> {currentUser?.name}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {
                              startTime ? `${Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60)} minutes` : '0 minutes'
                            }
                          </div>
                        </div>
                      </div>

                      {chiefComplaint && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Chief Complaint</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded">{chiefComplaint}</p>
                        </div>
                      )}

                      {examination && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Examination</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded">{examination}</p>
                        </div>
                      )}

                      {assessment && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Assessment</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded">{assessment}</p>
                        </div>
                      )}

                      {prescriptions.filter(p => p.medication.trim()).length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Prescriptions</h4>
                          <div className="space-y-2">
                            {prescriptions.filter(p => p.medication.trim()).map((prescription) => (
                              <div key={prescription.id} className="bg-gray-50 p-3 rounded">
                                <div className="font-medium">{prescription.medication} - {prescription.dosage}</div>
                                <div className="text-sm text-gray-600">
                                  {prescription.frequency} for {prescription.duration}
                                  {prescription.instructions && ` - ${prescription.instructions}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-4 pt-4">
                        <button
                          onClick={saveConsultation}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <SaveIcon />
                          <span>Save & Complete Consultation</span>
                        </button>
                        <button
                          onClick={handleClose}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationInterface;
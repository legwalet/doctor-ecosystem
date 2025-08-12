import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import PatientProgressTab from './PatientProgressTab';
import ReferralForm from './ReferralForm';

// Icons
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);



const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface PatientDetailViewProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patientId, isOpen, onClose }) => {
  const { patients, doctors, consultations, addConsultation, currentUser } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'progress' | 'schedule'>('overview');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    notes: '',
    type: 'consultation' as 'consultation' | 'follow-up' | 'emergency'
  });

  const patient = patients.find(p => p.id === patientId);
  const patientConsultations = consultations.filter(c => c.patientId === patientId);
  const patientDoctors = Array.from(new Set(patientConsultations.map(c => c.doctorId)))
    .map(doctorId => doctors.find(d => d.id === doctorId))
    .filter(Boolean);

  // Sort consultations by date (newest first)
  const sortedConsultations = [...patientConsultations].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const upcomingConsultations = sortedConsultations.filter(c => c.type === 'upcoming');

  const startConsultation = (consultationId: string) => {
    navigate(`/consultation/${patientId}/${consultationId}`);
  };

  const startNewConsultation = () => {
    navigate(`/consultation/${patientId}`);
  };

  if (!patient) return null;

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for conflicts
    const conflictingConsultation = consultations.find(c => 
      c.date === scheduleForm.date && 
      c.time === scheduleForm.time && 
      c.doctorId === currentUser?.id
    );

    if (conflictingConsultation) {
      alert('You already have an appointment at this time. Please choose a different time.');
      return;
    }

    // Add new consultation
    const newConsultation = {
      patientId: patient.id,
      patientName: patient.name,
      doctorId: currentUser?.id || '',
      doctorName: currentUser?.name || '',
      date: scheduleForm.date,
      time: scheduleForm.time,
      notes: scheduleForm.notes,
      type: 'upcoming' as const,
      status: 'scheduled' as const
    };

    addConsultation(newConsultation);
    setShowScheduleForm(false);
    setScheduleForm({ date: '', time: '', notes: '', type: 'consultation' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-medical-primary to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <UserIcon />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <p className="text-blue-100">Age: {patient.age} • Condition: {patient.condition}</p>
                <p className="text-blue-100 text-sm">{patient.address}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
                            {[
                  { id: 'overview', label: 'Overview', icon: <UserIcon /> },
                  { id: 'timeline', label: 'Medical Timeline', icon: <ClockIcon /> },
                  { id: 'progress', label: 'Progress Tracking', icon: <ClockIcon /> },
                  { id: 'schedule', label: 'Schedule Appointment', icon: <CalendarIcon /> }
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

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-medical-primary mb-3">Patient Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Email:</span> {patient.email}</div>
                    <div><span className="font-medium">Phone:</span> {patient.contactNumber}</div>
                    <div><span className="font-medium">Address:</span> {patient.address}</div>
                    <div><span className="font-medium">Last Visit:</span> {patient.lastVisit}</div>
                    <div><span className="font-medium">Next Appointment:</span> {patient.nextAppointment}</div>
                  </div>
                </div>

                {/* Admission Details */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-medical-primary mb-3">Admission Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Admitted By:</span> Dr. Sarah Johnson</div>
                    <div><span className="font-medium">Admission Date:</span> Jan 10, 2024</div>
                    <div><span className="font-medium">Referred From:</span> Groote Schuur Hospital Emergency</div>
                    <div><span className="font-medium">Referring Doctor:</span> Dr. James Mitchell</div>
                    <div><span className="font-medium">Facility:</span> Cape Town Medical Center</div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-700 mb-3">Emergency Contact</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> Mary Smith</div>
                    <div><span className="font-medium">Relationship:</span> Wife</div>
                    <div><span className="font-medium">Phone:</span> +27-21-123-1002</div>
                  </div>
                </div>

                {/* Medical Alerts */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-700 mb-3">Medical Alerts</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-red-600">Allergies:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Penicillin</span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Shellfish</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-blue-600">Current Medications:</span>
                      <ul className="mt-1 text-xs space-y-1">
                        <li>• Lisinopril 10mg daily</li>
                        <li>• Metformin 500mg twice daily</li>
                        <li>• Atorvastatin 20mg daily</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-medical-primary mb-3">Treating Doctors</h3>
                  <div className="space-y-2">
                    {patientDoctors.map((doctor) => (
                      <div key={doctor?.id} className="flex items-center space-x-2">
                        <img
                          src={doctor?.profilePicture}
                          alt={doctor?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm">{doctor?.name}</p>
                          <p className="text-xs text-gray-600">{doctor?.specialization}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity & Medical History */}
              <div className="lg:col-span-2 space-y-6">
                {/* Medical History */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-3">Medical History</h3>
                  <div className="space-y-2">
                    {['Hypertension (2020)', 'Type 2 Diabetes (2018)', 'High Cholesterol (2019)'].map((condition, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-sm text-purple-800">{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="font-semibold text-medical-primary mb-4">Recent Medical Activity</h3>
                <div className="space-y-4">
                  {sortedConsultations.slice(0, 5).map((consultation) => {
                    const doctor = doctors.find(d => d.id === consultation.doctorId);
                    return (
                      <div key={consultation.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                consultation.type === 'upcoming' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {consultation.type === 'upcoming' ? 'Upcoming' : 'Completed'}
                              </span>
                              <span className="text-sm font-medium">{consultation.doctorName}</span>
                              <span className="text-xs text-gray-500">{doctor?.specialization}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {consultation.date} at {consultation.time}
                            </p>
                            {consultation.notes && (
                              <p className="text-sm bg-gray-50 p-2 rounded">{consultation.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <PatientProgressTab
              patientId={patientId}
              patientName={patient.name}
              facilityId="facility1"
            />
          )}

          {activeTab === 'timeline' && (
            <div className="max-w-4xl mx-auto">
              <h3 className="font-semibold text-medical-primary mb-6">Complete Medical Timeline</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {sortedConsultations.map((consultation, index) => {
                    const doctor = doctors.find(d => d.id === consultation.doctorId);
                    return (
                      <div key={consultation.id} className="relative flex items-start space-x-4">
                        {/* Timeline dot */}
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-4 ${
                          consultation.type === 'upcoming' 
                            ? 'bg-green-500 border-green-200' 
                            : 'bg-blue-500 border-blue-200'
                        }`}></div>
                        
                        {/* Content */}
                        <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <img
                                src={doctor?.profilePicture}
                                alt={doctor?.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="font-medium">{consultation.doctorName}</h4>
                                <p className="text-sm text-gray-600">{doctor?.specialization}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">{consultation.date}</p>
                              <p className="text-sm text-gray-600">{consultation.time}</p>
                            </div>
                          </div>
                          {consultation.notes && (
                            <div className="mt-3 bg-gray-50 p-3 rounded">
                              <h5 className="font-medium text-sm mb-1">Notes:</h5>
                              <p className="text-sm text-gray-700">{consultation.notes}</p>
                            </div>
                          )}
                          
                          {consultation.chiefComplaint && (
                            <div className="mt-3 bg-blue-50 p-3 rounded">
                              <h5 className="font-medium text-sm mb-1">Chief Complaint:</h5>
                              <p className="text-sm text-gray-700">{consultation.chiefComplaint}</p>
                            </div>
                          )}
                          
                          {consultation.assessment && (
                            <div className="mt-3 bg-yellow-50 p-3 rounded">
                              <h5 className="font-medium text-sm mb-1">Assessment:</h5>
                              <p className="text-sm text-gray-700">{consultation.assessment}</p>
                            </div>
                          )}
                          
                          {consultation.prescriptions && consultation.prescriptions.length > 0 && (
                            <div className="mt-3 bg-green-50 p-3 rounded">
                              <h5 className="font-medium text-sm mb-2">Prescriptions:</h5>
                              <div className="space-y-1">
                                {consultation.prescriptions.map((prescription) => (
                                  <div key={prescription.id} className="text-sm text-gray-700">
                                    <span className="font-medium">{prescription.medication}</span> - {prescription.dosage}
                                    <div className="text-xs text-gray-600">
                                      {prescription.frequency} for {prescription.duration}
                                      {prescription.instructions && ` • ${prescription.instructions}`}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {consultation.vitals && Object.values(consultation.vitals).some(v => v) && (
                            <div className="mt-3 bg-purple-50 p-3 rounded">
                              <h5 className="font-medium text-sm mb-2">Vital Signs:</h5>
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                                {consultation.vitals.bloodPressure && (
                                  <div><span className="font-medium">BP:</span> {consultation.vitals.bloodPressure}</div>
                                )}
                                {consultation.vitals.heartRate && (
                                  <div><span className="font-medium">HR:</span> {consultation.vitals.heartRate} bpm</div>
                                )}
                                {consultation.vitals.temperature && (
                                  <div><span className="font-medium">Temp:</span> {consultation.vitals.temperature}°C</div>
                                )}
                                {consultation.vitals.weight && (
                                  <div><span className="font-medium">Weight:</span> {consultation.vitals.weight} kg</div>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="mt-2">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              consultation.type === 'upcoming' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {consultation.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-medical-primary">Schedule New Appointment</h3>
                <button
                  onClick={() => setShowScheduleForm(!showScheduleForm)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <PlusIcon />
                  <span>New Appointment</span>
                </button>
              </div>

              {/* Upcoming Appointments */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Upcoming Appointments</h4>
                  <button
                    onClick={startNewConsultation}
                    className="text-sm btn-primary px-3 py-1"
                  >
                    New Consultation
                  </button>
                </div>
                {upcomingConsultations.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingConsultations.map((consultation) => {
                      const doctor = doctors.find(d => d.id === consultation.doctorId);
                      const isMyAppointment = consultation.doctorId === currentUser?.id;
                      const today = new Date().toISOString().split('T')[0];
                      const isToday = consultation.date === today;
                      
                      return (
                        <div key={consultation.id} className="border rounded-lg p-4 bg-green-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img
                                src={doctor?.profilePicture}
                                alt={doctor?.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium">{consultation.doctorName}</p>
                                <p className="text-sm text-gray-600">{doctor?.specialization}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <p className="font-medium">{consultation.date}</p>
                                <p className="text-sm text-gray-600">{consultation.time}</p>
                              </div>
                              {isMyAppointment && isToday && (
                                <button
                                  onClick={() => startConsultation(consultation.id)}
                                  className="bg-medical-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  Start
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No upcoming appointments</p>
                )}
              </div>

              {/* Schedule Form */}
              <AnimatePresence>
                {showScheduleForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <form onSubmit={handleScheduleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            required
                            value={scheduleForm.date}
                            onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                            className="form-input"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time
                          </label>
                          <input
                            type="time"
                            required
                            value={scheduleForm.time}
                            onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                            className="form-input"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Appointment Type
                        </label>
                        <select
                          value={scheduleForm.type}
                          onChange={(e) => setScheduleForm({...scheduleForm, type: e.target.value as any})}
                          className="form-select"
                        >
                          <option value="consultation">Consultation</option>
                          <option value="follow-up">Follow-up</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={scheduleForm.notes}
                          onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                          className="form-textarea"
                          rows={3}
                          placeholder="Add any notes for this appointment..."
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button type="submit" className="btn-primary">
                          Schedule Appointment
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowScheduleForm(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PatientDetailView;
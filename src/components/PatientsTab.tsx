import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import PatientDetailView from './PatientDetailView';
import ReferralForm from './ReferralForm';
import AddPatientForm from './AddPatientForm';

// Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const NotesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);



interface AddNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

const AddNotesModal: React.FC<AddNotesModalProps> = ({ isOpen, onClose, patientId, patientName }) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addMeetingNotes } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addMeetingNotes(patientId, notes.trim());
    setNotes('');
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-medical-primary">
            Add Meeting Notes - {patientName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-medical-primary mb-2">
              Consultation Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter your consultation notes, diagnosis, treatment plan, etc..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent resize-y min-h-[120px]"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-medical-gray border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !notes.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Notes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};



const PatientsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [addNotesPatientId, setAddNotesPatientId] = useState<string | null>(null);
  const [referralPatient, setReferralPatient] = useState<{ id: string, name: string } | null>(null);
  const [viewFilter, setViewFilter] = useState<'all' | 'mine'>('all');
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  
  const { getAllPatients, currentUser, doctors, getPatientsByDoctor, consultations } = useStore();
  const navigate = useNavigate();
  
  const allPatients = getAllPatients();
  const myPatients = currentUser ? getPatientsByDoctor(currentUser.id) : [];
  
  const displayPatients = viewFilter === 'all' ? allPatients : myPatients;
  
  const filteredPatients = displayPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatientDoctor = (doctorId: string) => {
    return doctors.find(d => d.id === doctorId);
  };

  // Get upcoming appointments for a patient
  const getUpcomingAppointments = (patientId: string) => {
    return consultations.filter(c => 
      c.patientId === patientId && 
      c.type === 'upcoming' && 
      c.status === 'scheduled'
    );
  };

  // Check if consultation can be started (appointment is today and within time window)
  const canStartConsultation = (consultation: any) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes from midnight
    
    if (consultation.date !== today) return false;
    
    // Parse appointment time
    const [time, period] = consultation.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let appointmentMinutes = hours * 60 + minutes;
    if (period === 'PM' && hours !== 12) appointmentMinutes += 12 * 60;
    if (period === 'AM' && hours === 12) appointmentMinutes = minutes;
    
    // Allow starting 15 minutes before to 30 minutes after appointment time
    const startWindow = appointmentMinutes - 15;
    const endWindow = appointmentMinutes + 30;
    
    return currentTime >= startWindow && currentTime <= endWindow;
  };

  // Get the next appointment that can be started
  const getStartableAppointment = (patientId: string) => {
    const appointments = getUpcomingAppointments(patientId);
    return appointments.find(apt => 
      apt.doctorId === currentUser?.id && canStartConsultation(apt)
    );
  };

  // Check if patient has appointment today
  const hasAppointmentToday = (patientId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const appointments = getUpcomingAppointments(patientId);
    return appointments.some(apt => 
      apt.doctorId === currentUser?.id && apt.date === today
    );
  };

  const startConsultation = (patientId: string, consultationId?: string) => {
    if (consultationId) {
      navigate(`/consultation/${patientId}/${consultationId}`);
    } else {
      navigate(`/consultation/${patientId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            👥
          </div>
          <div>
            <h2 className="text-2xl font-bold text-medical-primary">Patient Management</h2>
            <p className="text-sm text-gray-600">Manage and view all your patients</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAddPatientForm(true)}
            className="px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-secondary transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Patient</span>
          </button>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewFilter === 'all'
                  ? 'bg-white text-medical-primary shadow-sm'
                  : 'text-medical-gray hover:text-medical-primary'
              }`}
            >
              All Patients ({allPatients.length})
            </button>
            <button
              onClick={() => setViewFilter('mine')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewFilter === 'mine'
                  ? 'bg-white text-medical-primary shadow-sm'
                  : 'text-medical-gray hover:text-medical-primary'
              }`}
            >
              My Patients ({myPatients.length})
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search patients by name or condition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
        />
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPatients.map((patient) => {
            const doctor = getPatientDoctor(patient.doctorId);
            const isMyPatient = currentUser?.id === patient.doctorId;
            
            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-medical-primary truncate">{patient.name}</h3>
                        <p className="text-sm text-medical-gray">Age: {patient.age}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isMyPatient && (
                          <span className="bg-medical-light text-medical-primary text-xs px-2 py-1 rounded-full">
                            My Patient
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4 relative group">
                    <div 
                      className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl cursor-pointer transition-transform hover:scale-110"
                      title="Hover to see doctor details"
                    >
                      {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    
                    {/* Hover Card with Doctor/Hospital Image */}
                    <div className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 scale-95 group-hover:scale-100">
                      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 w-48">
                        <div className="relative">
                          <img
                            src={doctor?.profilePicture || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop&crop=center'}
                            alt={`${doctor?.name || 'Doctor'} at ${doctor?.clinicName || 'Hospital'}`}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop&crop=center';
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {doctor?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DR'}
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900 text-sm">{doctor?.name || 'Unknown Doctor'}</p>
                          <p className="text-xs text-gray-600">{doctor?.clinicName || 'Medical Center'}</p>
                          <p className="text-xs text-blue-600">{doctor?.specialization}</p>
                        </div>
                      </div>
                      
                      {/* Arrow pointing to the avatar */}
                      <div className="absolute left-1/2 top-full transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div>
                      <span className="text-sm text-medical-gray">Condition:</span>
                      <p className="font-medium text-gray-900">{patient.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <span className="text-sm text-medical-gray">Primary Doctor:</span>
                      <p className="font-medium text-gray-900">{doctor?.name || 'Unknown'}</p>
                      <p className="text-xs text-medical-gray">{doctor?.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div>
                      <span className="text-sm text-medical-gray">Last Visit:</span>
                      <p className="font-medium text-gray-900">{patient.lastVisit}</p>
                    </div>
                  </div>
                </div>

                {/* Consultation Status and Actions */}
                <div className="mb-3">
                  {(() => {
                    const startableAppointment = getStartableAppointment(patient.id);
                    const hasToday = hasAppointmentToday(patient.id);
                    
                    if (startableAppointment) {
                      return (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ClockIcon />
                              <div>
                                <p className="text-sm font-medium text-green-800">Ready to Start</p>
                                <p className="text-xs text-green-600">
                                  Appointment: {startableAppointment.time}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => startConsultation(patient.id, startableAppointment.id)}
                              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] font-semibold"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 8h10M7 16h10M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
                              </svg>
                              <span>Start Now</span>
                            </button>
                          </div>
                        </div>
                      );
                    } else if (hasToday) {
                      const todayAppointments = getUpcomingAppointments(patient.id).filter(apt => 
                        apt.doctorId === currentUser?.id && 
                        apt.date === new Date().toISOString().split('T')[0]
                      );
                      return (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                          <div className="flex items-center space-x-2">
                            <ClockIcon />
                            <div>
                              <p className="text-sm font-medium text-blue-800">Scheduled Today</p>
                              <p className="text-xs text-blue-600">
                                {todayAppointments[0]?.time} • Available 15 min before
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div className="space-y-2">
                  {/* Primary Consultation Button */}
                  <button
                    onClick={() => startConsultation(patient.id)}
                    className="w-full bg-gradient-to-r from-medical-primary to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                    title="Start New Consultation"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 8h10M7 16h10M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
                    </svg>
                    <span className="font-semibold">Start Consultation</span>
                  </button>
                  
                  {/* Secondary Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedPatientId(patient.id)}
                      className="flex-1 btn-secondary text-sm py-2"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setReferralPatient({ id: patient.id, name: patient.name })}
                      className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors border border-blue-200"
                      title="Refer Patient"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setAddNotesPatientId(patient.id)}
                      className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                      title="Add Quick Notes"
                    >
                      <NotesIcon />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
              👥
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No patients match your search criteria.' : 'No patients available yet.'}
            </p>
          </div>
        </div>
      )}

      {/* Patient Detail View */}
      {selectedPatientId && (
        <PatientDetailView
          patientId={selectedPatientId}
          isOpen={true}
          onClose={() => setSelectedPatientId(null)}
        />
      )}

      {/* Add Notes Modal */}
      {addNotesPatientId && (
        <AddNotesModal
          isOpen={true}
          onClose={() => setAddNotesPatientId(null)}
          patientId={addNotesPatientId}
          patientName={getAllPatients().find(p => p.id === addNotesPatientId)?.name || ''}
        />
      )}

      {/* Referral Form Modal */}
      {referralPatient && (
        <ReferralForm
          patientId={referralPatient.id}
          patientName={referralPatient.name}
          onClose={() => setReferralPatient(null)}
          onSubmit={() => {
            // Optionally refresh data or show success message
          }}
        />
      )}

      {/* Add Patient Form Modal */}
      {showAddPatientForm && (
        <AddPatientForm onClose={() => setShowAddPatientForm(false)} />
      )}
    </div>
  );
};

export default PatientsTab;
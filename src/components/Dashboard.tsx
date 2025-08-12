import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import PatientsTab from './PatientsTab';
import NetworkTab from './NetworkTab';
import SchedulingCalendar from './SchedulingCalendar';
import InboxTab from './InboxTab';
import MessagesTab from './MessagesTab';

// Dashboard navigation icons (using simple SVGs for now)
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
  </svg>
);

const PatientsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ConsultationsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 10v2m-3 0h6m2-6V9a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2z" />
  </svg>
);

const SchedulingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const NetworkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const InboxIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293L9.586 13H7" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  const { currentUser, getPatientsByDoctor, getConsultationsByDoctor, getUnreadNotificationsCount, patients } = useStore();
  
  if (!currentUser) return null;

  const myPatients = getPatientsByDoctor(currentUser.id);
  const myConsultations = getConsultationsByDoctor(currentUser.id);
  const upcomingConsultations = myConsultations.filter(c => c.type === 'upcoming');
  const unreadNotifications = getUnreadNotificationsCount(currentUser.id);

  // Get today's appointments that can be started
  const getTodaysConsultationOpportunities = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return upcomingConsultations.filter(consultation => {
      if (consultation.date !== today) return false;

      // Parse appointment time
      const [time, period] = consultation.time.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let appointmentMinutes = hours * 60 + minutes;
      if (period === 'PM' && hours !== 12) appointmentMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) appointmentMinutes = minutes;

      // Show if within 15 minutes before to 30 minutes after
      const startWindow = appointmentMinutes - 15;
      const endWindow = appointmentMinutes + 30;
      return currentTime >= startWindow && currentTime <= endWindow;
    }).map(consultation => ({
      ...consultation,
      patient: patients.find(p => p.id === consultation.patientId)
    }));
  };

  const consultationOpportunities = getTodaysConsultationOpportunities();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-medical-primary">
          Welcome back, Dr. {currentUser.name.split(' ')[1]}
        </h1>
        <div className="text-medical-gray">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-medical-gray text-sm">Total Patients</p>
              <p className="text-2xl font-bold text-medical-primary">{myPatients.length}</p>
            </div>
            <div className="w-12 h-12 bg-medical-light rounded-lg flex items-center justify-center">
              <PatientsIcon />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-medical-gray text-sm">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-medical-accent">{upcomingConsultations.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ConsultationsIcon />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-medical-gray text-sm">Unread Notifications</p>
              <p className="text-2xl font-bold text-medical-warning">{unreadNotifications}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <NetworkIcon />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-medical-gray text-sm">Experience</p>
              <p className="text-2xl font-bold text-medical-secondary">{currentUser.experience} years</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ProfileIcon />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Today's Consultation Opportunities */}
      {consultationOpportunities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-500 p-3 rounded-full text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-800">🚀 Ready to Start Consultations</h2>
              <p className="text-green-700">You have {consultationOpportunities.length} appointment(s) ready to begin now</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultationOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {opportunity.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{opportunity.patientName}</h3>
                    <p className="text-sm text-gray-600">{opportunity.patient?.condition}</p>
                    <p className="text-sm text-green-700 font-medium">⏰ {opportunity.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = `/consultation/${opportunity.patientId}/${opportunity.id}`}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 8h10M7 16h10M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
                  </svg>
                  <span>Start Consultation</span>
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-medical-primary">Recent Patients</h3>
            <button
              onClick={() => window.location.href = '/dashboard?tab=patients'}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {myPatients.length > 0 ? (
              myPatients.slice(0, 5).map((patient) => (
                <div key={patient.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-medical-primary truncate">{patient.name}</p>
                    <p className="text-sm text-medical-gray">{patient.condition}</p>
                    <div className="flex items-center space-x-4 text-xs text-medical-gray mt-1">
                      <span>Age {patient.age}</span>
                      <span>•</span>
                      <span>Last: {patient.lastVisit}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => window.location.href = `/dashboard?tab=patients&patient=${patient.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm">No patients yet</p>
                <p className="text-xs text-gray-400">Add your first patient to get started</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-medical-primary">Upcoming Appointments</h3>
            <button
              onClick={() => window.location.href = '/dashboard?tab=consultations'}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {upcomingConsultations.length > 0 ? (
              upcomingConsultations.slice(0, 5).map((consultation) => {
                const patient = patients.find(p => p.id === consultation.patientId);
                return (
                  <div key={consultation.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {consultation.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-medical-primary truncate">{consultation.patientName}</p>
                      <p className="text-sm text-medical-gray">{patient?.condition || 'General consultation'}</p>
                      <div className="flex items-center space-x-4 text-xs text-medical-gray mt-1">
                        <span>{consultation.date}</span>
                        <span>•</span>
                        <span className="font-medium text-medical-accent">{consultation.time}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end space-y-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {consultation.status}
                      </span>
                      {consultation.notes && (
                        <p className="text-xs text-gray-500 max-w-32 truncate" title={consultation.notes}>
                          {consultation.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No upcoming appointments</p>
                <p className="text-xs text-gray-400">Schedule appointments to see them here</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Consultations Tab placeholder
const ConsultationsTab: React.FC = () => {
  const { currentUser, getConsultationsByDoctor } = useStore();
  
  if (!currentUser) return null;
  
  const consultations = getConsultationsByDoctor(currentUser.id);
  const upcomingConsultations = consultations.filter(c => c.type === 'upcoming');
  const pastConsultations = consultations.filter(c => c.type === 'past');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-medical-primary">Consultations</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Consultations */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-medical-primary mb-4">
            Upcoming Appointments ({upcomingConsultations.length})
          </h3>
          <div className="space-y-3">
            {upcomingConsultations.map((consultation) => (
              <div key={consultation.id} className="p-4 bg-green-50 rounded-lg border-l-4 border-medical-accent">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-medical-primary">{consultation.patientName}</p>
                    <p className="text-sm text-medical-gray">{consultation.date} at {consultation.time}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mt-1">
                      {consultation.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {upcomingConsultations.length === 0 && (
              <p className="text-medical-gray">No upcoming appointments.</p>
            )}
          </div>
        </div>

        {/* Past Consultations */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-medical-primary mb-4">
            Recent Consultations ({pastConsultations.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pastConsultations.map((consultation) => (
              <div key={consultation.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-medical-primary">{consultation.patientName}</p>
                    <p className="text-sm text-medical-gray">{consultation.date} at {consultation.time}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {consultation.status}
                  </span>
                </div>
                {consultation.notes && (
                  <div className="mt-2 p-2 bg-white rounded border-l-4 border-medical-primary">
                    <p className="text-sm text-gray-700">{consultation.notes}</p>
                  </div>
                )}
              </div>
            ))}
            {pastConsultations.length === 0 && (
              <p className="text-medical-gray">No past consultations.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileTab: React.FC = () => {
  const { currentUser } = useStore();
  
  if (!currentUser) return null;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-medical-primary mb-6">Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-medical-primary mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-medical-gray">Name</label>
              <p className="font-medium">{currentUser.name}</p>
            </div>
            <div>
              <label className="text-sm text-medical-gray">Email</label>
              <p className="font-medium">{currentUser.email}</p>
            </div>
            <div>
              <label className="text-sm text-medical-gray">Specialization</label>
              <p className="font-medium">{currentUser.specialization}</p>
            </div>
            <div>
              <label className="text-sm text-medical-gray">Experience</label>
              <p className="font-medium">{currentUser.experience} years</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-medical-primary mb-4">Clinic Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-medical-gray">Clinic Name</label>
              <p className="font-medium">{currentUser.clinicName}</p>
            </div>
            <div>
              <label className="text-sm text-medical-gray">Address</label>
              <p className="font-medium">{currentUser.clinicAddress}</p>
            </div>
            <div>
              <label className="text-sm text-medical-gray">Contact</label>
              <p className="font-medium">{currentUser.clinicContact}</p>
            </div>
            <div>
              <label className="text-sm text-medical-gray">Location</label>
              <p className="font-medium">{currentUser.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const { currentUser, logout } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const { getPendingReferrals } = useStore();
  const navigate = useNavigate();

  // Redirect admin users to admin dashboard
  React.useEffect(() => {
    if (currentUser && (currentUser as any).role) {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const pendingReferrals = getPendingReferrals(currentUser.id);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'patients', label: 'Patients', icon: <PatientsIcon /> },
    { id: 'consultations', label: 'Consultations', icon: <ConsultationsIcon /> },
    { id: 'scheduling', label: 'Scheduling', icon: <SchedulingIcon /> },
    { id: 'network', label: 'Network', icon: <NetworkIcon /> },
    { 
      id: 'inbox', 
      label: 'Inbox', 
      icon: <InboxIcon />,
      hasNotification: pendingReferrals.length > 0
    },
    { id: 'messages', label: 'Messages', icon: <MailIcon /> },
    { id: 'profile', label: 'Profile', icon: <ProfileIcon /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'patients':
        return <PatientsTab />;
      case 'consultations':
        return <ConsultationsTab />;
      case 'scheduling':
        return <SchedulingCalendar />;
      case 'network':
        return <NetworkTab />;
      case 'inbox':
        return <InboxTab />;
      case 'messages':
        return <MessagesTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-medical-primary">IHCE</h1>
              <span className="text-sm text-medical-accent ml-2">Integrated Health Care Ecosystem</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-medical-primary font-medium">{currentUser.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-medical-gray hover:text-medical-primary transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-medical-primary text-white shadow-md'
                    : item.hasNotification 
                      ? 'text-medical-primary hover:text-medical-secondary hover:bg-green-50 border-2 border-green-300 shadow-md bg-green-25'
                      : 'text-medical-gray hover:text-medical-primary hover:bg-gray-100'
                }`}
              >
                <div className={`${item.hasNotification ? 'animate-pulse' : ''}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
                {item.hasNotification && (
                  <div className="relative">
                    {/* Enhanced notification indicator with multiple layers */}
                    {/* Outer glow ring */}
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-200 rounded-full animate-pulse opacity-60"></div>
                    {/* Main notification dot */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-200"></div>
                    {/* Animated ping effect */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                    {/* Notification count badge with gradient */}
                    <div className="absolute -top-4 -right-4 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-200 transform hover:scale-110 transition-all duration-200 border-2 border-white">
                      <span className="text-xs font-bold text-white">{pendingReferrals.length}</span>
                    </div>
                    {/* Subtle sparkle effect */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-80"></div>
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserCheck, FiCalendar, FiActivity, FiEye } from 'react-icons/fi';
import useStore from '../store/useStore';

// Icon components with proper typing
const UsersIcon = FiUsers as React.ComponentType<{ className?: string; size?: number }>;
const UserCheckIcon = FiUserCheck as React.ComponentType<{ className?: string; size?: number }>;
const CalendarIcon = FiCalendar as React.ComponentType<{ className?: string; size?: number }>;
const ActivityIcon = FiActivity as React.ComponentType<{ className?: string; size?: number }>;
const EyeIcon = FiEye as React.ComponentType<{ className?: string; size?: number }>;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('approvals');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const { 
    currentUser, 
    getPendingApprovals, 
    approveDoctor, 
    rejectDoctor, 
    getDoctorsByFacility,
    getSchedulesByFacility,
    getAllPatients
  } = useStore();

  const pendingDoctors = getPendingApprovals();
  const facilityDoctors = currentUser?.facilityId === 'all' 
    ? getDoctorsByFacility('all') 
    : getDoctorsByFacility(currentUser?.facilityId || '');
  const facilitySchedules = getSchedulesByFacility(currentUser?.facilityId || '');
  const allPatients = getAllPatients();

  const handleApprove = (doctorId: string) => {
    if (currentUser) {
      approveDoctor(doctorId, currentUser.id);
    }
  };

  const handleReject = (doctorId: string) => {
    if (currentUser && rejectionReason.trim()) {
      rejectDoctor(doctorId, currentUser.id, rejectionReason);
      setRejectionReason('');
      setShowRejectionModal(false);
      setSelectedDoctor(null);
    }
  };

  const tabs = [
    { id: 'approvals', label: 'Pending Approvals', icon: <UserCheckIcon />, count: pendingDoctors.length },
    { id: 'doctors', label: 'Facility Doctors', icon: <UsersIcon />, count: facilityDoctors.length },
    { id: 'schedules', label: 'Colleague Schedules', icon: <CalendarIcon />, count: facilitySchedules.length },
    { id: 'patients', label: 'All Patients', icon: <EyeIcon />, count: allPatients.length },
    { id: 'progress', label: 'Patient Progress', icon: <ActivityIcon />, count: 0 }
  ];

  const renderApprovalsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Pending Doctor Approvals</h3>
        <span className="text-sm text-gray-500">{pendingDoctors.length} pending</span>
      </div>

      {pendingDoctors.length === 0 ? (
        <div className="text-center py-12">
          <UserCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
          <p className="mt-1 text-sm text-gray-500">All doctor applications have been processed.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    <p className="text-xs text-gray-500">{doctor.email}</p>
                    <p className="text-xs text-gray-500">{doctor.experience} years experience</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(doctor.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor.id);
                      setShowRejectionModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDoctorsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Facility Doctors</h3>
        <span className="text-sm text-gray-500">{facilityDoctors.length} doctors</span>
      </div>

      <div className="grid gap-4">
        {facilityDoctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  <p className="text-xs text-gray-500">{doctor.department || 'No department assigned'}</p>
                  <p className="text-xs text-gray-500">
                    Status: <span className={`font-medium ${doctor.approvalStatus === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {doctor.approvalStatus || 'pending'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{doctor.workingHours || 'No schedule set'}</p>
                <p className="text-xs text-gray-500">{doctor.monthlyPatients || 0} patients/month</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSchedulesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Colleague Schedules</h3>
        <span className="text-sm text-gray-500">{facilitySchedules.length} doctors with schedules</span>
      </div>

      <div className="grid gap-4">
        {facilitySchedules.map((doctor) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                </div>
              </div>
            </div>

            {doctor.schedule && (
              <div className="grid grid-cols-7 gap-2 text-xs">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="text-center">
                    <div className="font-medium text-gray-700 capitalize">{day.slice(0, 3)}</div>
                    <div className="mt-1 p-2 bg-gray-50 rounded min-h-[60px]">
                      {doctor.schedule?.[day as keyof typeof doctor.schedule]?.map((time, index) => (
                        <div key={index} className="text-xs text-blue-600 font-medium">
                          {time}
                        </div>
                      )) || <span className="text-gray-400">Off</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderPatientsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">All Patients</h3>
        <span className="text-sm text-gray-500">{allPatients.length} patients</span>
      </div>

      <div className="grid gap-4">
        {allPatients.map((patient) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                  <p className="text-sm text-gray-600">Age: {patient.age}</p>
                  <p className="text-sm text-gray-600">Condition: {patient.condition}</p>
                  <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Next: {patient.nextAppointment}</p>
                <p className="text-xs text-gray-500">Added by: {patient.addedBy}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderProgressTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Patient Progress Tracking</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Patient progress data is available in the Patient Management section. 
          Admins can view all patient progress across the facility.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'approvals':
        return renderApprovalsTab();
      case 'doctors':
        return renderDoctorsTab();
      case 'schedules':
        return renderSchedulesTab();
      case 'patients':
        return renderPatientsTab();
      case 'progress':
        return renderProgressTab();
      default:
        return renderApprovalsTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {currentUser?.name}. Manage your facility and review applications.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-medical-primary text-medical-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Application</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                rows={4}
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedDoctor(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedDoctor && handleReject(selectedDoctor)}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 
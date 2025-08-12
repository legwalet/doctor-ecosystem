import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import type { Referral } from '../data/mockData';

const InboxTab: React.FC = () => {
  const { currentUser, getReferralsByDoctor, respondToReferral } = useStore();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [responseNotes, setResponseNotes] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  if (!currentUser) return null;

  const { incoming, outgoing } = getReferralsByDoctor(currentUser.id);
  const pendingIncoming = incoming.filter(r => r.status === 'pending');

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResponse = async (referralId: string, response: 'accepted' | 'declined') => {
    setIsResponding(true);
    try {
      respondToReferral(referralId, response, responseNotes.trim() || undefined);
      setSelectedReferral(null);
      setResponseNotes('');
    } catch (error) {
      console.error('Error responding to referral:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const ReferralCard: React.FC<{ referral: Referral; isIncoming: boolean }> = ({ referral, isIncoming }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedReferral(referral)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Patient: {referral.patientName}
          </h3>
          <p className="text-sm text-gray-600">
            {isIncoming ? `From: ${referral.fromDoctorName}` : `To: ${referral.toDoctorName}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(referral.urgency)}`}>
            {referral.urgency.toUpperCase()}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <span className="text-sm font-medium text-gray-700">Specialty: </span>
          <span className="text-sm text-gray-600">{referral.specialtyRequested}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700">Reason: </span>
          <span className="text-sm text-gray-600">{referral.reason}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Created: {referral.createdDate}</span>
        {referral.respondedDate && (
          <span>Responded: {referral.respondedDate}</span>
        )}
      </div>

      {isIncoming && referral.status === 'pending' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReferral(referral);
              }}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Review & Respond
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Referral Inbox</h2>
          <p className="text-gray-600">Manage patient referrals and collaboration requests</p>
        </div>
        {pendingIncoming.length > 0 && (
          <div className="flex items-center space-x-2 text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5V3h0z" />
            </svg>
            <span className="font-medium">{pendingIncoming.length} pending referral{pendingIncoming.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'incoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Incoming Referrals ({incoming.length})
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'outgoing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent Referrals ({outgoing.length})
          </button>
        </nav>
      </div>

      {/* Referrals List */}
      <div className="space-y-4">
        <AnimatePresence>
          {activeTab === 'incoming' && (
            <>
              {incoming.length > 0 ? (
                incoming.map(referral => (
                  <ReferralCard
                    key={referral.id}
                    referral={referral}
                    isIncoming={true}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293L9.586 13H7" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-900">No incoming referrals</p>
                  <p className="text-gray-500">You haven't received any patient referrals yet.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'outgoing' && (
            <>
              {outgoing.length > 0 ? (
                outgoing.map(referral => (
                  <ReferralCard
                    key={referral.id}
                    referral={referral}
                    isIncoming={false}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-900">No sent referrals</p>
                  <p className="text-gray-500">You haven't sent any patient referrals yet.</p>
                </div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Referral Detail Modal */}
      {selectedReferral && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedReferral(null)}
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
                  Referral Details
                </h2>
                <button
                  onClick={() => setSelectedReferral(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Patient Information</h3>
                  <p className="text-lg font-semibold text-blue-600">{selectedReferral.patientName}</p>
                  <p className="text-sm text-gray-600">{selectedReferral.patientCondition}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {activeTab === 'incoming' ? 'Referring Doctor' : 'Referred To'}
                  </h3>
                  <p className="text-lg font-semibold text-green-600">
                    {activeTab === 'incoming' ? selectedReferral.fromDoctorName : selectedReferral.toDoctorName}
                  </p>
                  <p className="text-sm text-gray-600">{selectedReferral.specialtyRequested}</p>
                </div>
              </div>

              {/* Status & Urgency */}
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(selectedReferral.urgency)}`}>
                  {selectedReferral.urgency.toUpperCase()} Priority
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReferral.status)}`}>
                  {selectedReferral.status.charAt(0).toUpperCase() + selectedReferral.status.slice(1)}
                </span>
              </div>

              {/* Referral Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Reason for Referral</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReferral.reason}</p>
                </div>

                {selectedReferral.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReferral.notes}</p>
                  </div>
                )}

                {selectedReferral.expectedOutcome && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Expected Outcome</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReferral.expectedOutcome}</p>
                  </div>
                )}
              </div>

              {/* Response Section for Pending Incoming Referrals */}
              {activeTab === 'incoming' && selectedReferral.status === 'pending' && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Respond to Referral</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response Notes (Optional)
                    </label>
                    <textarea
                      value={responseNotes}
                      onChange={(e) => setResponseNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add any notes about your response..."
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleResponse(selectedReferral.id, 'accepted')}
                      disabled={isResponding}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {isResponding ? 'Processing...' : 'Accept Referral'}
                    </button>
                    <button
                      onClick={() => handleResponse(selectedReferral.id, 'declined')}
                      disabled={isResponding}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {isResponding ? 'Processing...' : 'Decline Referral'}
                    </button>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Created: {selectedReferral.createdDate}</span>
                  {selectedReferral.respondedDate && (
                    <span>Responded: {selectedReferral.respondedDate}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default InboxTab;
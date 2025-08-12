import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiSend, FiTrash2, FiEyeOff, FiUser, FiClock, FiAlertCircle } from 'react-icons/fi';
import useStore from '../store/useStore';

// Icon components with proper typing
const MailIcon = FiMail as React.ComponentType<{ className?: string; size?: number }>;
const SendIcon = FiSend as React.ComponentType<{ className?: string; size?: number }>;
const TrashIcon = FiTrash2 as React.ComponentType<{ className?: string; size?: number }>;
const EyeOffIcon = FiEyeOff as React.ComponentType<{ className?: string; size?: number }>;
const UserIcon = FiUser as React.ComponentType<{ className?: string; size?: number }>;
const ClockIcon = FiClock as React.ComponentType<{ className?: string; size?: number }>;
const AlertIcon = FiAlertCircle as React.ComponentType<{ className?: string; size?: number }>;

const MessagesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [composeForm, setComposeForm] = useState({
    toDoctorId: '',
    subject: '',
    content: '',
    priority: 'medium' as const,
    messageType: 'general' as const,
    relatedPatientId: ''
  });

  const { 
    currentUser, 
    getMessagesByDoctor, 
    sendMessage, 
    markMessageAsRead, 
    deleteMessage,
    getAllPatients,
    doctors
  } = useStore();

  if (!currentUser) return null;

  const { sent, received } = getMessagesByDoctor(currentUser.id);
  const allPatients = getAllPatients();
  const otherDoctors = doctors.filter(d => d.id !== currentUser.id);

  const handleSendMessage = () => {
    if (composeForm.toDoctorId && composeForm.subject && composeForm.content) {
      const toDoctor = doctors.find(d => d.id === composeForm.toDoctorId);
      if (toDoctor) {
        sendMessage({
          fromDoctorId: currentUser.id,
          fromDoctorName: currentUser.name,
          toDoctorId: composeForm.toDoctorId,
          toDoctorName: toDoctor.name,
          subject: composeForm.subject,
          content: composeForm.content,
          read: false,
          priority: composeForm.priority,
          messageType: composeForm.messageType,
          relatedPatientId: composeForm.relatedPatientId || undefined,
          relatedPatientName: composeForm.relatedPatientId ? 
            allPatients.find(p => p.id === composeForm.relatedPatientId)?.name : undefined
        });

        // Reset form
        setComposeForm({
          toDoctorId: '',
          subject: '',
          content: '',
          priority: 'medium',
          messageType: 'general',
          relatedPatientId: ''
        });
        setShowCompose(false);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertIcon className="w-4 h-4 text-red-600" />;
      case 'consultation': return <UserIcon className="w-4 h-4 text-blue-600" />;
      case 'patient_referral': return <MailIcon className="w-4 h-4 text-green-600" />;
      default: return <MailIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const renderMessageList = (messages: any[], type: 'inbox' | 'sent') => (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <MailIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No {type === 'inbox' ? 'received' : 'sent'} messages
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {type === 'inbox' ? 'You haven\'t received any messages yet.' : 'You haven\'t sent any messages yet.'}
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              !message.read ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => {
              setSelectedMessage(message.id);
              if (!message.read) {
                markMessageAsRead(message.id);
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  {getMessageTypeIcon(message.messageType)}
                  <h4 className="font-semibold text-gray-900 truncate">
                    {message.subject}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {type === 'inbox' ? `From: ${message.fromDoctorName}` : `To: ${message.toDoctorName}`}
                </p>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {message.content}
                </p>
                {message.relatedPatientName && (
                  <p className="text-xs text-blue-600 mt-1">
                    Related to: {message.relatedPatientName}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <div className="text-xs text-gray-500 flex items-center">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  {message.date}
                </div>
                {!message.read && type === 'inbox' && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMessage(message.id);
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const renderMessageDetail = () => {
    const allMessages = [...received, ...sent];
    const message = allMessages.find(m => m.id === selectedMessage);
    
    if (!message) return null;

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{message.subject}</h3>
          <button
            onClick={() => setSelectedMessage(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <EyeOffIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>
              <strong>From:</strong> {message.fromDoctorName}
            </span>
            <span>
              <strong>To:</strong> {message.toDoctorName}
            </span>
            <span>
              <strong>Date:</strong> {message.date}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {getMessageTypeIcon(message.messageType)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
              {message.priority} priority
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {message.messageType.replace('_', ' ')}
            </span>
          </div>

          {message.relatedPatientName && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Related Patient:</strong> {message.relatedPatientName}
              </p>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderComposeForm = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose Message</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Doctor
          </label>
          <select
            value={composeForm.toDoctorId}
            onChange={(e) => setComposeForm(prev => ({ ...prev, toDoctorId: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
          >
            <option value="">Select a doctor</option>
            {otherDoctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={composeForm.subject}
            onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
            placeholder="Enter message subject"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={composeForm.priority}
              onChange={(e) => setComposeForm(prev => ({ ...prev, priority: e.target.value as any }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Type
            </label>
            <select
              value={composeForm.messageType}
              onChange={(e) => setComposeForm(prev => ({ ...prev, messageType: e.target.value as any }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
            >
              <option value="general">General</option>
              <option value="consultation">Consultation</option>
              <option value="patient_referral">Patient Referral</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Related Patient (Optional)
          </label>
          <select
            value={composeForm.relatedPatientId}
            onChange={(e) => setComposeForm(prev => ({ ...prev, relatedPatientId: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
          >
            <option value="">No patient</option>
            {allPatients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} - {patient.condition}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Content
          </label>
          <textarea
            value={composeForm.content}
            onChange={(e) => setComposeForm(prev => ({ ...prev, content: e.target.value }))}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
            placeholder="Enter your message..."
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSendMessage}
            disabled={!composeForm.toDoctorId || !composeForm.subject || !composeForm.content}
            className="flex-1 px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <SendIcon className="w-4 h-4" />
            <span>Send Message</span>
          </button>
          <button
            onClick={() => setShowCompose(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
        <button
          onClick={() => setShowCompose(true)}
          className="px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-secondary transition-colors flex items-center space-x-2"
        >
          <SendIcon className="w-4 h-4" />
          <span>Compose</span>
        </button>
      </div>

      {showCompose && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {renderComposeForm()}
        </motion.div>
      )}

      {selectedMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {renderMessageDetail()}
        </motion.div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'inbox'
                  ? 'border-medical-primary text-medical-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MailIcon className="w-4 h-4" />
              <span>Inbox ({received.filter(m => !m.read).length})</span>
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'sent'
                  ? 'border-medical-primary text-medical-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SendIcon className="w-4 h-4" />
              <span>Sent</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'inbox' ? renderMessageList(received, 'inbox') : renderMessageList(sent, 'sent')}
        </div>
      </div>
    </div>
  );
};

export default MessagesTab; 
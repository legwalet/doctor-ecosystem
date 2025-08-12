import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Doctor, 
  Patient, 
  Consultation, 
  Notification,
  Referral,
  Message,
  HospitalCompany,
  AdminUser,
  PatientProgress,
  mockDoctors, 
  mockPatients, 
  mockConsultations, 
  mockNotifications,
  mockReferrals,
  mockMessages,
  mockHospitalCompanies,
  mockAdminUsers,
  mockPatientProgress,
  mockAuthCredentials 
} from '../data/mockData';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: Doctor | null;
  token: string | null;
}

interface AppState extends AuthState {
  doctors: Doctor[];
  patients: Patient[];
  consultations: Consultation[];
  notifications: Notification[];
  referrals: Referral[];
  messages: Message[];
  patientProgress: PatientProgress[];
  hospitalCompanies: HospitalCompany[];
  adminUsers: AdminUser[];
  sidebarOpen: boolean;
  activeTab: string;
  
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (doctorData: Omit<Doctor, 'id' | 'registrationDate'> & { password: string }) => Promise<boolean>;
  updateProfile: (updates: Partial<Doctor>) => void;
  
  // Admin actions
  approveDoctor: (doctorId: string, adminId: string) => void;
  rejectDoctor: (doctorId: string, adminId: string, reason: string) => void;
  getPendingApprovals: () => Doctor[];
  getDoctorsByFacility: (facilityId: string) => Doctor[];
  getSchedulesByFacility: (facilityId: string) => Doctor[];
  getPatientProgress: (patientId: string) => PatientProgress[];
  
  // Hospital company actions
  getHospitalCompanies: () => HospitalCompany[];
  getHospitalCompanyById: (id: string) => HospitalCompany | undefined;
  
  // Message actions
  sendMessage: (message: Omit<Message, 'id' | 'date'>) => void;
  getMessagesByDoctor: (doctorId: string) => { sent: Message[], received: Message[] };
  markMessageAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  
  // Patient actions
  addPatient: (patient: Omit<Patient, 'id' | 'addedBy'>) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  deletePatient: (patientId: string) => void;
  getPatientsByDoctor: (doctorId: string) => Patient[];
  getAllPatients: () => Patient[];
  getPatientById: (patientId: string) => Patient | undefined;
  
  // Consultation actions
  addConsultation: (consultation: Omit<Consultation, 'id'>) => void;
  updateConsultationNotes: (consultationId: string, notes: string) => void;
  getConsultationsByDoctor: (doctorId: string) => Consultation[];
  getConsultationsByPatient: (patientId: string) => Consultation[];
  addMeetingNotes: (patientId: string, notes: string) => void;
  
  // Notification actions
  markNotificationAsRead: (notificationId: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  getUnreadNotificationsCount: (doctorId: string) => number;

  // Referral actions
  createReferral: (referral: Omit<Referral, 'id' | 'createdDate' | 'status'>) => void;
  respondToReferral: (referralId: string, response: 'accepted' | 'declined', notes?: string) => void;
  getReferralsByDoctor: (doctorId: string) => { incoming: Referral[], outgoing: Referral[] };
  getPendingReferrals: (doctorId: string) => Referral[];
  getAllReferrals: () => Referral[];
  
  // UI actions
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  
  // Doctor network actions
  getDoctorsByLocation: (location: string) => Doctor[];
  referPatientToDoctor: (patientId: string, fromDoctorId: string, toDoctorId: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      currentUser: null,
      token: null,
      doctors: mockDoctors,
      patients: mockPatients,
      consultations: mockConsultations,
      notifications: mockNotifications,
      referrals: mockReferrals,
      messages: mockMessages,
      patientProgress: mockPatientProgress,
      hospitalCompanies: mockHospitalCompanies,
      adminUsers: mockAdminUsers,
      sidebarOpen: true,
      activeTab: 'profile',

      // Auth actions
      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const credentials = mockAuthCredentials.find(cred => cred.email === email);
        if (credentials && credentials.password === password) {
          // Check if it's an admin user
          const adminUser = mockAdminUsers.find(a => a.id === credentials.doctorId);
          if (adminUser) {
            const token = `mock-jwt-token-${Date.now()}`;
            set({
              isAuthenticated: true,
              currentUser: adminUser as any, // Cast to Doctor type for compatibility
              token
            });
            return true;
          }
          
          // Check if it's a regular doctor
          const doctor = mockDoctors.find(d => d.id === credentials.doctorId);
          if (doctor) {
            const token = `mock-jwt-token-${Date.now()}`;
            set({
              isAuthenticated: true,
              currentUser: doctor,
              token
            });
            return true;
          }
        }
        return false;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          token: null
        });
      },

      register: async (doctorData) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Add credentials to mockAuthCredentials
        const { password, ...doctorDataWithoutPassword } = doctorData as any;
        
        const newDoctor: Doctor = {
          ...doctorDataWithoutPassword,
          id: generateId(),
          registrationDate: new Date().toISOString().split('T')[0],
          approvalStatus: 'pending'
        };
        
        const newCredentials = {
          email: doctorData.email,
          password: password,
          doctorId: newDoctor.id
        };
        
        // Update mockAuthCredentials (in a real app, this would be a database operation)
        mockAuthCredentials.push(newCredentials);
        
        set(state => ({
          doctors: [...state.doctors, newDoctor],
          isAuthenticated: true,
          currentUser: newDoctor,
          token: `mock-jwt-token-${Date.now()}`
        }));
        
        return true;
      },

      // Admin actions
      approveDoctor: (doctorId: string, adminId: string) => {
        const admin = get().adminUsers.find(a => a.id === adminId);
        if (admin) {
          set(state => ({
            doctors: state.doctors.map(d => 
              d.id === doctorId 
                ? { 
                    ...d, 
                    approvalStatus: 'approved',
                    approvedBy: adminId,
                    approvedDate: new Date().toISOString().split('T')[0]
                  }
                : d
            )
          }));

          // Notify the doctor
          get().addNotification({
            title: 'Account Approved',
            message: `Your account has been approved by ${admin.name}. You can now access all features.`,
            date: new Date().toISOString().split('T')[0],
            read: false,
            doctorId: doctorId
          });
        }
      },

      rejectDoctor: (doctorId: string, adminId: string, reason: string) => {
        const admin = get().adminUsers.find(a => a.id === adminId);
        if (admin) {
          set(state => ({
            doctors: state.doctors.map(d => 
              d.id === doctorId 
                ? { 
                    ...d, 
                    approvalStatus: 'rejected',
                    approvedBy: adminId,
                    approvedDate: new Date().toISOString().split('T')[0]
                  }
                : d
            )
          }));

          // Notify the doctor
          get().addNotification({
            title: 'Account Application Rejected',
            message: `Your account application has been rejected. Reason: ${reason}`,
            date: new Date().toISOString().split('T')[0],
            read: false,
            doctorId: doctorId
          });
        }
      },

      getPendingApprovals: () => {
        return get().doctors.filter(d => d.approvalStatus === 'pending');
      },

      getDoctorsByFacility: (facilityId: string) => {
        return get().doctors.filter(d => d.facilityId === facilityId);
      },

      getSchedulesByFacility: (facilityId: string) => {
        return get().doctors.filter(d => d.facilityId === facilityId && d.schedule);
      },

      // Hospital company actions
      getHospitalCompanies: () => {
        return get().hospitalCompanies;
      },

      getHospitalCompanyById: (id: string) => {
        return get().hospitalCompanies.find(h => h.id === id);
      },

      getPatientProgress: (patientId: string) => {
        return get().patientProgress.filter(p => p.patientId === patientId);
      },

      // Message actions
      sendMessage: (messageData: Omit<Message, 'id' | 'date'>) => {
        const newMessage: Message = {
          ...messageData,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString().split('T')[0]
        };

        set(state => ({
          messages: [...state.messages, newMessage]
        }));

        // Create notification for recipient
        get().addNotification({
          title: 'New Message',
          message: `You have received a new message from ${messageData.fromDoctorName}: ${messageData.subject}`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          doctorId: messageData.toDoctorId
        });
      },

      getMessagesByDoctor: (doctorId: string) => {
        const messages = get().messages;
        return {
          sent: messages.filter(m => m.fromDoctorId === doctorId),
          received: messages.filter(m => m.toDoctorId === doctorId)
        };
      },

      markMessageAsRead: (messageId: string) => {
        set(state => ({
          messages: state.messages.map(m => 
            m.id === messageId ? { ...m, read: true } : m
          )
        }));
      },

      deleteMessage: (messageId: string) => {
        set(state => ({
          messages: state.messages.filter(m => m.id !== messageId)
        }));
      },

      updateProfile: (updates) => {
        const { currentUser } = get();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set(state => ({
            currentUser: updatedUser,
            doctors: state.doctors.map(d => d.id === currentUser.id ? updatedUser : d)
          }));
        }
      },

      // Patient actions
      addPatient: (patientData) => {
        const { currentUser } = get();
        if (currentUser) {
          const newPatient: Patient = {
            ...patientData,
            id: generateId(),
            addedBy: currentUser.id,
            doctorId: currentUser.id
          };
          
          set(state => ({
            patients: [...state.patients, newPatient]
          }));
        }
      },

      updatePatient: (patientId, updates) => {
        set(state => ({
          patients: state.patients.map(p => 
            p.id === patientId ? { ...p, ...updates } : p
          )
        }));
      },

      deletePatient: (patientId) => {
        set(state => ({
          patients: state.patients.filter(p => p.id !== patientId)
        }));
      },

      getPatientsByDoctor: (doctorId) => {
        return get().patients.filter(p => p.doctorId === doctorId);
      },

      getAllPatients: () => {
        return get().patients;
      },

      getPatientById: (patientId) => {
        return get().patients.find(p => p.id === patientId);
      },

      // Consultation actions
      addConsultation: (consultationData) => {
        const newConsultation: Consultation = {
          ...consultationData,
          id: generateId()
        };
        
        set(state => ({
          consultations: [...state.consultations, newConsultation]
        }));
      },

      updateConsultationNotes: (consultationId, notes) => {
        set(state => ({
          consultations: state.consultations.map(c =>
            c.id === consultationId ? { ...c, notes } : c
          )
        }));
      },

      getConsultationsByDoctor: (doctorId) => {
        return get().consultations.filter(c => c.doctorId === doctorId);
      },

      getConsultationsByPatient: (patientId) => {
        return get().consultations.filter(c => c.patientId === patientId);
      },

      addMeetingNotes: (patientId, notes) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const patient = get().patients.find(p => p.id === patientId);
        if (!patient) return;

        const newConsultation: Consultation = {
          id: generateId(),
          patientId: patientId,
          patientName: patient.name,
          doctorId: currentUser.id,
          doctorName: currentUser.name,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          }),
          notes: notes,
          type: 'past',
          status: 'completed'
        };

        set(state => ({
          consultations: [...state.consultations, newConsultation]
        }));
      },

      // Notification actions
      markNotificationAsRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        }));
      },

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: generateId()
        };
        
        set(state => ({
          notifications: [...state.notifications, newNotification]
        }));
      },

      getUnreadNotificationsCount: (doctorId) => {
        return get().notifications.filter(n => n.doctorId === doctorId && !n.read).length;
      },

      // Referral actions
      createReferral: (referralData: Omit<Referral, 'id' | 'createdDate' | 'status'>) => {
        const newReferral: Referral = {
          ...referralData,
          id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdDate: new Date().toISOString().split('T')[0],
          status: 'pending'
        };

        set(state => ({
          referrals: [...state.referrals, newReferral]
        }));

        // Create notification for receiving doctor
        get().addNotification({
          title: 'New Patient Referral',
          message: `Dr. ${referralData.fromDoctorName} referred ${referralData.patientName} to you for ${referralData.specialtyRequested} consultation.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          doctorId: referralData.toDoctorId
        });

        // Create confirmation notification for referring doctor
        get().addNotification({
          title: 'Referral Sent',
          message: `Your referral of ${referralData.patientName} to Dr. ${referralData.toDoctorName} has been sent successfully.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          doctorId: referralData.fromDoctorId
        });
      },

      respondToReferral: (referralId: string, response: 'accepted' | 'declined', notes?: string) => {
        set(state => ({
          referrals: state.referrals.map(referral => 
            referral.id === referralId 
              ? { 
                  ...referral, 
                  status: response,
                  respondedDate: new Date().toISOString().split('T')[0],
                  ...(notes && { responseNotes: notes })
                }
              : referral
          )
        }));

        const referral = get().referrals.find(r => r.id === referralId);
        if (referral) {
          // Notify referring doctor of response
          get().addNotification({
            title: `Referral ${response === 'accepted' ? 'Accepted' : 'Declined'}`,
            message: `Dr. ${referral.toDoctorName} has ${response} your referral of ${referral.patientName}.${notes ? ` Note: ${notes}` : ''}`,
            date: new Date().toISOString().split('T')[0],
            read: false,
            doctorId: referral.fromDoctorId
          });

          // If accepted, transfer patient to new doctor
          if (response === 'accepted') {
            set(state => ({
              patients: state.patients.map(patient =>
                patient.id === referral.patientId
                  ? { ...patient, doctorId: referral.toDoctorId }
                  : patient
              )
            }));

            // Create consultation record for the transfer
            get().addConsultation({
              patientId: referral.patientId,
              patientName: referral.patientName,
              doctorId: referral.toDoctorId,
              doctorName: referral.toDoctorName,
              date: new Date().toISOString().split('T')[0],
              time: '09:00 AM',
              notes: `Patient referred from Dr. ${referral.fromDoctorName}. Reason: ${referral.reason}`,
              type: 'upcoming',
              status: 'scheduled'
            });
          }
        }
      },

      getReferralsByDoctor: (doctorId: string) => {
        const { referrals } = get();
        return {
          incoming: referrals.filter(r => r.toDoctorId === doctorId),
          outgoing: referrals.filter(r => r.fromDoctorId === doctorId)
        };
      },

      getPendingReferrals: (doctorId: string) => {
        const { referrals } = get();
        return referrals.filter(r => r.toDoctorId === doctorId && r.status === 'pending');
      },

      getAllReferrals: () => {
        return get().referrals;
      },

      // UI actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Doctor network actions
      getDoctorsByLocation: (location) => {
        return get().doctors.filter(d => d.location === location);
      },

      referPatientToDoctor: (patientId, fromDoctorId, toDoctorId) => {
        const { patients, doctors, addNotification } = get();
        const patient = patients.find(p => p.id === patientId);
        const fromDoctor = doctors.find(d => d.id === fromDoctorId);
        const toDoctor = doctors.find(d => d.id === toDoctorId);
        
        if (patient && fromDoctor && toDoctor) {
          // Create notification for the receiving doctor
          addNotification({
            title: 'New Patient Referral',
            message: `Dr. ${fromDoctor.name} referred patient ${patient.name} to you.`,
            date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
            read: false,
            doctorId: toDoctorId
          });
          
          // Update patient's doctor
          set(state => ({
            patients: state.patients.map(p =>
              p.id === patientId ? { ...p, doctorId: toDoctorId } : p
            )
          }));
        }
      }
    }),
    {
      name: 'doctor-ecosystem-storage',
      version: 2, // Force cache refresh with new doctor data
      migrate: (persistedState: any, version: number) => {
        // Force reload with new data structure if old version
        if (version < 2) {
          return {
            ...persistedState,
            doctors: mockDoctors, // Force new 20-doctor data
            isAuthenticated: false, // Force re-login with new credentials
            currentUser: null,
            token: null
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        token: state.token,
        patients: state.patients,
        consultations: state.consultations,
        notifications: state.notifications,
        doctors: state.doctors,
        referrals: state.referrals
      })
    }
  )
);

export default useStore;
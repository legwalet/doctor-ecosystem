export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  location: string;
  clinicName: string;
  clinicAddress: string;
  clinicContact: string;
  profilePicture: string;
  coordinates: [number, number];
  registrationDate: string;
  facilityId?: string; // Which facility/practice they belong to
  department?: string;
  isHead?: boolean; // Head of department
  facilityRelationship?: 'owner' | 'partner' | 'renter' | 'employee'; // Relationship with facility
  monthlyPatients?: number; // Average patients per month
  workingDays?: string[]; // Days of the week they work
  workingHours?: string; // e.g., "9:00 AM - 5:00 PM"
  approvalStatus?: 'pending' | 'approved' | 'rejected'; // Admin approval status
  approvedBy?: string; // Admin who approved
  approvedDate?: string; // Date of approval
  schedule?: {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
  };
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  lastVisit: string;
  nextAppointment: string;
  doctorId: string;
  contactNumber: string;
  email: string;
  address: string;
  addedBy: string;
  admittedBy?: string; // Which doctor admitted the patient
  referredFrom?: string; // External referral source
  referringDoctor?: string; // Name of referring doctor
  admissionDate?: string; // When patient was first admitted
  facilityId?: string; // Current facility
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
  currentMedications?: string[];
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface VitalSigns {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  weight?: string;
  height?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  notes: string;
  type: 'past' | 'upcoming';
  status: 'completed' | 'scheduled' | 'cancelled';
  chiefComplaint?: string;
  examination?: string;
  assessment?: string;
  plan?: string;
  prescriptions?: Prescription[];
  vitals?: VitalSigns;
  duration?: number; // in minutes
}

export interface PatientProgress {
  id: string;
  patientId: string;
  date: string;
  doctorId: string;
  doctorName: string;
  progressType: 'improvement' | 'stable' | 'decline' | 'critical';
  progressScore: number; // 1-10 scale
  notes: string;
  symptoms: string[];
  treatmentResponse: string;
  nextSteps: string;
  weeklyReviewNotes?: string; // Notes from Monday meetings
}

export interface WeeklyReview {
  id: string;
  facilityId: string;
  date: string; // Monday date
  attendingDoctors: string[];
  patientsDiscussed: {
    patientId: string;
    patientName: string;
    summary: string;
    recommendations: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }[];
  generalNotes: string;
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  type: 'hospital' | 'clinic' | 'practice';
  departments: string[];
  ownerId?: string; // Doctor who owns the facility (if applicable)
  partners?: string[]; // Doctor partners in the facility
  totalBeds?: number;
  established: string; // Year established
  phone: string;
  email: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  notes: string;
  type: 'past' | 'upcoming';
  status: 'completed' | 'scheduled' | 'cancelled';
  chiefComplaint?: string;
  examination?: string;
  assessment?: string;
  plan?: string;
  prescriptions?: Prescription[];
  vitals?: VitalSigns;
  duration?: number; // in minutes
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  doctorId: string;
}

export interface HospitalCompany {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'medical_center' | 'specialty_clinic';
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  established: string; // Year
  totalDoctors: number;
  departments: string[];
  description: string;
  logo?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  facilityId: string;
  permissions: string[];
  lastLogin?: string;
}

export interface Message {
  id: string;
  fromDoctorId: string;
  fromDoctorName: string;
  toDoctorId: string;
  toDoctorName: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messageType: 'consultation' | 'patient_referral' | 'general' | 'emergency';
  relatedPatientId?: string;
  relatedPatientName?: string;
  attachments?: string[];
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  fromDoctorId: string;
  fromDoctorName: string;
  toDoctorId: string;
  toDoctorName: string;
  reason: string;
  notes: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'accepted' | 'declined';
  createdDate: string;
  respondedDate?: string;
  specialtyRequested: string;
  patientCondition: string;
  expectedOutcome: string;
  attachments?: string[]; // File URLs or IDs
}

export interface WellnessProfessional {
  id: string;
  name: string;
  specialization: string;
  expertise: string[];
  experience: number;
  location: string;
  facilityName: string;
  facilityAddress: string;
  contactNumber: string;
  email: string;
  profilePicture: string;
  coordinates: [number, number];
  services: string[];
  qualifications: string[];
  availability: string;
  consultationFee: string;
  isExternal: boolean; // Whether they're external specialists
  category: 'nutrition' | 'therapy' | 'fitness' | 'spa' | 'wellness' | 'spiritual' | 'somatology' | 'life-coaching' | 'chiropractic' | 'reflexology' | 'aesthetics' | 'reiki' | 'quantum-healing' | 'mind-body-yoga' | 'acupuncture';
  description: string;
  workingHours: string;
  languages: string[];
}

// Mock Doctors Data
// Mock Facilities Data
export const mockFacilities: Facility[] = [
  {
    id: 'facility1',
    name: 'Cape Town Medical Center',
    address: '87 Strand Street, City Bowl, Cape Town, 8001',
    type: 'hospital',
    departments: ['General Practice', 'Dermatology', 'Pediatrics', 'Psychology', 'Orthopedics', 'Gynecology'],
    ownerId: '1', // Dr. Michael Naidoo owns this facility
    partners: ['5', '7', '11', '16', '19'], // Partner doctors
    totalBeds: 150,
    established: '1998',
    phone: '+27-21-555-0100',
    email: 'info@capetownmedical.co.za'
  },
  {
    id: 'facility2',
    name: 'Johannesburg General Hospital',
    address: '45 Commissioner Street, Johannesburg CBD, 2001',
    type: 'hospital',
    departments: ['General Practice', 'Dermatology', 'Psychiatry', 'Neurology', 'ENT'],
    ownerId: '13', // Dr. Fatima Osman owns this facility
    partners: ['6', '17'], // Partner doctors
    totalBeds: 200,
    established: '1985',
    phone: '+27-11-555-0200',
    email: 'admin@jhbgeneral.co.za'
  },
  {
    id: 'facility3',
    name: 'Durban Medical Centre',
    address: '120 Anton Lembede Street, Durban CBD, 4001',
    type: 'hospital',
    departments: ['Cardiology', 'Pediatrics', 'Psychology', 'Orthopedics', 'Gynecology'],
    ownerId: '3', // Dr. Ayesha Khan owns this facility
    partners: ['12', '15'], // Partner doctors
    totalBeds: 120,
    established: '2003',
    phone: '+27-31-555-0300',
    email: 'contact@durbanmedical.co.za'
  },
  {
    id: 'facility4',
    name: 'Pretoria Health Institute',
    address: '200 Church Street, Pretoria CBD, 0002',
    type: 'hospital',
    departments: ['Cardiology', 'Psychiatry', 'Neurology', 'ENT'],
    ownerId: '9', // Dr. Thandiwe Molefe owns this facility
    partners: ['4', '14', '18'], // Partner doctors
    totalBeds: 80,
    established: '2010',
    phone: '+27-12-555-0400',
    email: 'info@pretoriahealth.co.za'
  },
  {
    id: 'facility5',
    name: 'Sandton Private Practice',
    address: '89 Sandton Drive, Sandton, Johannesburg, 2196',
    type: 'practice',
    departments: ['General Practice', 'Psychiatry'],
    partners: ['2', '10'], // Drs. Sarah Jacobs & James Botha share this practice
    established: '2015',
    phone: '+27-11-555-0500',
    email: 'reception@sandtonpractice.co.za'
  },
  {
    id: 'facility6',
    name: 'Durban Children & Women Clinic',
    address: '456 Florida Road, Durban, 4001',
    type: 'clinic',
    departments: ['Pediatrics', 'Gynecology'],
    partners: ['8', '20'], // Drs. Sipho Mthembu & Andrew Green share this clinic
    established: '2018',
    phone: '+27-31-555-0600',
    email: 'info@durbanchildren.co.za'
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Michael Naidoo',
    email: 'michael.naidoo@email.com',
    specialization: 'General Practitioner',
    experience: 8,
    location: 'Cape Town',
    clinicName: 'Cape Town Medical Center',
    clinicAddress: '87 Strand Street, City Bowl, Cape Town, 8001',
    clinicContact: '+27-21-555-0101',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9249, 18.4241], // City Bowl/CBD - Central Cape Town
    registrationDate: '2023-01-15',
    facilityId: 'facility1',
    department: 'General Practice',
    isHead: true,
    facilityRelationship: 'owner',
    monthlyPatients: 120,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '8:00 AM - 6:00 PM'
  },
  {
    id: '2',
    name: 'Dr. Sarah Jacobs',
    email: 'sarah.jacobs@email.com',
    specialization: 'General Practitioner',
    experience: 6,
    location: 'Cape Town',
    clinicName: 'Sea Point Medical Practice',
    clinicAddress: '45 Main Road, Sea Point, Cape Town, 8005',
    clinicContact: '+27-21-555-0102',
    profilePicture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9144, 18.3956], // Sea Point - Cape Town
    registrationDate: '2023-02-20',
    facilityId: 'facility5',
    department: 'General Practice',
    isHead: false,
    facilityRelationship: 'partner',
    monthlyPatients: 85,
    workingDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '9:00 AM - 5:00 PM'
  },
  {
    id: '3',
    name: 'Dr. Ayesha Khan',
    email: 'ayesha.khan@email.com',
    specialization: 'Cardiologist',
    experience: 12,
    location: 'Cape Town',
    clinicName: 'Cape Town Heart Centre',
    clinicAddress: '120 Long Street, CBD, Cape Town, 8001',
    clinicContact: '+27-21-555-0103',
    profilePicture: 'https://images.unsplash.com/photo-1594824694021-c6cd32c98c00?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9258, 18.4238], // Long Street - Cape Town CBD
    registrationDate: '2023-03-10',
    facilityId: 'facility3',
    department: 'Cardiology',
    isHead: true,
    facilityRelationship: 'owner',
    monthlyPatients: 95,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '8:30 AM - 5:30 PM'
  },
  {
    id: '4',
    name: 'Dr. Pieter van der Merwe',
    email: 'pieter.vandermerwe@email.com',
    specialization: 'Cardiologist',
    experience: 10,
    location: 'Cape Town',
    clinicName: 'Green Point Cardiology',
    clinicAddress: '34 Somerset Road, Green Point, Cape Town, 8005',
    clinicContact: '+27-21-555-0104',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9089, 18.4089], // Green Point - Cape Town
    registrationDate: '2022-11-30',
    facilityId: 'facility4',
    department: 'Cardiology',
    isHead: false
  },
  {
    id: '5',
    name: 'Dr. Nomsa Mokoena',
    email: 'nomsa.mokoena@email.com',
    specialization: 'Dermatologist',
    experience: 7,
    location: 'Cape Town',
    clinicName: 'Cape Town Skin Clinic',
    clinicAddress: '12 Orange Street, Gardens, Cape Town, 8001',
    clinicContact: '+27-21-555-0105',
    profilePicture: 'https://images.unsplash.com/photo-1594824694021-c6cd32c98c00?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9292, 18.4174], // Gardens - Central Cape Town
    registrationDate: '2023-04-18',
    facilityId: 'facility1',
    department: 'Dermatology',
    isHead: true
  },
  {
    id: '6',
    name: 'Dr. Daniel Dlamini',
    email: 'daniel.dlamini@email.com',
    specialization: 'Dermatologist',
    experience: 9,
    location: 'Cape Town',
    clinicName: 'Cape Town Dermatology Centre',
    clinicAddress: '78 Kloof Street, Gardens, Cape Town, 8001',
    clinicContact: '+27-21-555-0106',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9278, 18.4167], // Kloof Street - Cape Town
    registrationDate: '2022-07-12',
    facilityId: 'facility2',
    department: 'Dermatology',
    isHead: true
  },
  {
    id: '7',
    name: 'Dr. Emma Williams',
    email: 'emma.williams@email.com',
    specialization: 'Pediatrician',
    experience: 8,
    location: 'Cape Town',
    clinicName: 'Cape Kids Medical',
    clinicAddress: '45 Mill Street, Gardens, Cape Town, 8001',
    clinicContact: '+27-21-555-0107',
    profilePicture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9284, 18.4156], // Gardens/Mill Street - Cape Town
    registrationDate: '2022-09-05',
    facilityId: 'facility1',
    department: 'Pediatrics',
    isHead: true
  },
  {
    id: '8',
    name: 'Dr. Sipho Mthembu',
    email: 'sipho.mthembu@email.com',
    specialization: 'Pediatrician',
    experience: 11,
    location: 'Cape Town',
    clinicName: 'Cape Town Children Clinic',
    clinicAddress: '67 Loop Street, CBD, Cape Town, 8001',
    clinicContact: '+27-21-555-0108',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9267, 18.4228], // Loop Street - Cape Town CBD
    registrationDate: '2021-11-08',
    facilityId: 'facility3',
    department: 'Pediatrics',
    isHead: false
  },
  {
    id: '9',
    name: 'Dr. Thandiwe Molefe',
    email: 'thandiwe.molefe@email.com',
    specialization: 'Psychiatrist',
    experience: 11,
    location: 'Cape Town',
    clinicName: 'Cape Town Mental Health Institute',
    clinicAddress: '200 Wale Street, CBD, Cape Town, 8001',
    clinicContact: '+27-21-555-0109',
    profilePicture: 'https://images.unsplash.com/photo-1594824694021-c6cd32c98c00?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9256, 18.4247], // Wale Street - Cape Town CBD
    registrationDate: '2022-03-22',
    facilityId: 'facility4',
    department: 'Psychiatry',
    isHead: true,
    facilityRelationship: 'owner',
    monthlyPatients: 78,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    workingHours: '9:00 AM - 6:00 PM'
  },
  {
    id: '10',
    name: 'Dr. James Botha',
    email: 'james.botha@email.com',
    specialization: 'Psychiatrist',
    experience: 9,
    location: 'Cape Town',
    clinicName: 'Cape Town Mental Health',
    clinicAddress: '89 Roeland Street, Gardens, Cape Town, 8001',
    clinicContact: '+27-21-555-0110',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9298, 18.4189], // Roeland Street - Cape Town
    registrationDate: '2022-01-14',
    facilityId: 'facility2',
    department: 'Psychiatry',
    isHead: false
  },
  {
    id: '11',
    name: 'Dr. Lindiwe Ndlovu',
    email: 'lindiwe.ndlovu@email.com',
    specialization: 'Psychologist',
    experience: 6,
    location: 'Cape Town',
    clinicName: 'Cape Mind Wellness',
    clinicAddress: '23 Bree Street, Cape Town CBD, 8001',
    clinicContact: '+27-21-555-0111',
    profilePicture: 'https://images.unsplash.com/photo-1594824694021-c6cd32c98c00?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9258, 18.4232], // Bree Street - Cape Town CBD
    registrationDate: '2023-06-30',
    facilityId: 'facility1',
    department: 'Psychology',
    isHead: false
  },
  {
    id: '12',
    name: 'Dr. Warren Smith',
    email: 'warren.smith@email.com',
    specialization: 'Psychologist',
    experience: 8,
    location: 'Durban',
    clinicName: 'Durban Psychology Practice',
    clinicAddress: '34 Pine Street, Durban, 4001',
    clinicContact: '+27-31-555-0112',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    coordinates: [-29.8594, 31.0218], // Pine Street - Durban
    registrationDate: '2022-05-15',
    facilityId: 'facility3',
    department: 'Psychology',
    isHead: true
  },
  {
    id: '13',
    name: 'Dr. Fatima Osman',
    email: 'fatima.osman@email.com',
    specialization: 'Neurologist',
    experience: 13,
    location: 'Johannesburg',
    clinicName: 'Johannesburg General Hospital',
    clinicAddress: '45 Commissioner Street, Johannesburg CBD, 2001',
    clinicContact: '+27-11-555-0113',
    profilePicture: 'https://images.unsplash.com/photo-1594824694021-c6cd32c98c00?w=150&h=150&fit=crop&crop=face',
    coordinates: [-26.2001, 28.0489], // Johannesburg CBD
    registrationDate: '2021-08-22',
    facilityId: 'facility2',
    department: 'Neurology',
    isHead: true,
    facilityRelationship: 'owner',
    monthlyPatients: 110,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '7:30 AM - 5:00 PM'
  },
  {
    id: '14',
    name: 'Dr. Shaun Govender',
    email: 'shaun.govender@email.com',
    specialization: 'Neurologist',
    experience: 10,
    location: 'Pretoria',
    clinicName: 'Pretoria Neurology Centre',
    clinicAddress: '78 Beatrix Street, Arcadia, Pretoria, 0007',
    clinicContact: '+27-12-555-0114',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    coordinates: [-25.7545, 28.2336], // Arcadia - Pretoria
    registrationDate: '2022-10-03',
    facilityId: 'facility4',
    department: 'Neurology',
    isHead: false
  },
  {
    id: '15',
    name: 'Dr. Thulani Khumalo',
    email: 'thulani.khumalo@email.com',
    specialization: 'Orthopedic Surgeon',
    experience: 12,
    location: 'Durban',
    clinicName: 'Durban Orthopedic Hospital',
    clinicAddress: '123 West Street, Durban, 4000',
    clinicContact: '+27-31-555-0115',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    coordinates: [-29.8587, 31.0218], // West Street - Durban
    registrationDate: '2021-04-20',
    facilityId: 'facility3',
    department: 'Orthopedics',
    isHead: true
  },
  {
    id: '16',
    name: 'Dr. Priya Singh',
    email: 'priya.singh@email.com',
    specialization: 'Orthopedic Surgeon',
    experience: 9,
    location: 'Cape Town',
    clinicName: 'Cape Orthopedic Specialists',
    clinicAddress: '56 Roeland Street, Cape Town, 8001',
    clinicContact: '+27-21-555-0116',
    profilePicture: 'https://images.unsplash.com/photo-1594824694021-c6cd32c98c00?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9312, 18.4197], // Roeland Street - Cape Town
    registrationDate: '2022-12-08',
    facilityId: 'facility1',
    department: 'Orthopedics',
    isHead: false
  },
  {
    id: '17',
    name: 'Dr. Johan Visser',
    email: 'johan.visser@email.com',
    specialization: 'ENT Specialist',
    experience: 11,
    location: 'Johannesburg',
    clinicName: 'Joburg ENT Centre',
    clinicAddress: '45 Fox Street, Johannesburg, 2001',
    clinicContact: '+27-11-555-0117',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    coordinates: [-26.2065, 28.0475], // Fox Street - Johannesburg
    registrationDate: '2021-06-12',
    facilityId: 'facility2',
    department: 'ENT',
    isHead: true
  },
  {
    id: '18',
    name: 'Dr. Lebogang Moagi',
    email: 'lebogang.moagi@email.com',
    specialization: 'ENT Specialist',
    experience: 7,
    location: 'Pretoria',
    clinicName: 'Pretoria ENT Practice',
    clinicAddress: '90 Vermeulen Street, Pretoria, 0002',
    clinicContact: '+27-12-555-0118',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    coordinates: [-25.7463, 28.2284], // Vermeulen Street - Pretoria
    registrationDate: '2023-02-28',
    facilityId: 'facility4',
    department: 'ENT',
    isHead: false
  },
  {
    id: '19',
    name: 'Dr. Patricia Maseko',
    email: 'patricia.maseko@email.com',
    specialization: 'Gynecologist',
    experience: 14,
    location: 'Cape Town',
    clinicName: 'Cape Women\'s Health',
    clinicAddress: '78 Adderley Street, Cape Town, 8000',
    clinicContact: '+21-555-0119',
    profilePicture: 'https://images.unsplash.com/photo-1594824694021-c6cd32c98c00?w=150&h=150&fit=crop&crop=face',
    coordinates: [-33.9205, 18.4228], // Adderley Street - Cape Town
    registrationDate: '2020-09-15',
    facilityId: 'facility1',
    department: 'Gynecology',
    isHead: true
  },
  {
    id: '20',
    name: 'Dr. Andrew Green',
    email: 'andrew.green@email.com',
    specialization: 'Gynecologist',
    experience: 10,
    location: 'Durban',
    clinicName: 'Durban Women\'s Clinic',
    clinicAddress: '234 Victoria Street, Durban, 4001',
    clinicContact: '+27-31-555-0120',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    coordinates: [-29.8579, 31.0292], // Victoria Street - Durban
    registrationDate: '2022-08-10',
    facilityId: 'facility3',
    department: 'Gynecology',
    isHead: false
  }
];

// Mock Patients Data
export const mockPatients: Patient[] = [
  {
    id: 'pat1',
    name: 'John Smith',
    age: 45,
    condition: 'Hypertension',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-02-15',
    doctorId: 'doc1',
    contactNumber: '+27-21-123-1001',
    email: 'john.smith@email.com',
    address: '123 Main Road, Claremont, Cape Town, 7708',
    addedBy: 'doc1'
  },
  {
    id: 'pat2',
    name: 'Maria Garcia',
    age: 32,
    condition: 'Migraine',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-02-10',
    doctorId: 'doc2',
    contactNumber: '+27-21-123-1002',
    email: 'maria.garcia@email.com',
    address: '456 Voortrekker Road, Goodwood, Cape Town, 7460',
    addedBy: 'doc2'
  },
  {
    id: 'pat3',
    name: 'David Wilson',
    age: 58,
    condition: 'Diabetes',
    lastVisit: '2024-01-12',
    nextAppointment: '2024-02-12',
    doctorId: 'doc3',
    contactNumber: '+27-21-123-1003',
    email: 'david.wilson@email.com',
    address: '789 Lansdowne Road, Lansdowne, Cape Town, 7780',
    addedBy: 'doc3'
  },
  {
    id: 'pat4',
    name: 'Lisa Anderson',
    age: 29,
    condition: 'Anxiety',
    lastVisit: '2024-01-08',
    nextAppointment: '2024-02-08',
    doctorId: 'doc4',
    contactNumber: '+27-21-123-1004',
    email: 'lisa.anderson@email.com',
    address: '321 Durban Road, Bellville, Cape Town, 7530',
    addedBy: 'doc4'
  },
  {
    id: 'pat5',
    name: 'James Brown',
    age: 67,
    condition: 'Arthritis',
    lastVisit: '2024-01-14',
    nextAppointment: '2024-02-14',
    doctorId: 'doc1',
    contactNumber: '+27-21-123-1005',
    email: 'james.brown@email.com',
    address: '654 Robert Sobukwe Road, Athlone, Cape Town, 7764',
    addedBy: 'doc1'
  },
  {
    id: 'pat6',
    name: 'Nomsa Dlamini',
    age: 28,
    condition: 'Pregnancy Check-up',
    lastVisit: '2024-01-18',
    nextAppointment: '2024-02-18',
    doctorId: 'doc5',
    contactNumber: '+27-21-123-1006',
    email: 'nomsa.dlamini@email.com',
    address: '78 Kuilsriver Road, Parow, Cape Town, 7500',
    addedBy: 'doc5'
  },
  {
    id: 'pat7',
    name: 'Sipho Ndaba',
    age: 42,
    condition: 'Skin Rash',
    lastVisit: '2024-01-16',
    nextAppointment: '2024-02-16',
    doctorId: 'doc6',
    contactNumber: '+27-21-123-1007',
    email: 'sipho.ndaba@email.com',
    address: '45 Trill Road, Observatory, Cape Town, 7925',
    addedBy: 'doc6'
  },
  {
    id: 'pat8',
    name: 'Priya Sharma',
    age: 29,
    condition: 'Depression',
    lastVisit: '2024-01-20',
    nextAppointment: '2024-02-20',
    doctorId: 'doc7',
    contactNumber: '+27-21-123-1008',
    email: 'priya.sharma@email.com',
    address: '123 Protea Road, Claremont, Cape Town, 7708',
    addedBy: 'doc7'
  },
  {
    id: 'pat9',
    name: 'Michael van Wyk',
    age: 65,
    condition: 'Cataracts',
    lastVisit: '2024-01-22',
    nextAppointment: '2024-02-22',
    doctorId: 'doc8',
    contactNumber: '+27-21-123-1009',
    email: 'michael.vanwyk@email.com',
    address: '67 Constantia Road, Wynberg, Cape Town, 7800',
    addedBy: 'doc8'
  },
  {
    id: 'pat10',
    name: 'Sarah Hassan',
    age: 34,
    condition: 'Diabetes Type 2',
    lastVisit: '2024-01-24',
    nextAppointment: '2024-02-24',
    doctorId: 'doc9',
    contactNumber: '+27-21-123-1010',
    email: 'sarah.hassan@email.com',
    address: '234 Ravensmead Road, Goodwood, Cape Town, 7460',
    addedBy: 'doc9'
  },
  {
    id: 'pat11',
    name: 'Christopher Botha',
    age: 19,
    condition: 'Sports Injury',
    lastVisit: '2024-01-26',
    nextAppointment: '2024-02-26',
    doctorId: 'doc10',
    contactNumber: '+27-21-123-1011',
    email: 'chris.botha@email.com',
    address: '89 Bellville Road, Bellville, Cape Town, 7530',
    addedBy: 'doc10'
  },
  // Additional patients for Dr. Michael Naidoo (ID: 1) - Cape Town Medical Center
  {
    id: 'pat12',
    name: 'Thandiwe Mthembu',
    age: 45,
    condition: 'Annual Check-up',
    lastVisit: '2024-12-10',
    nextAppointment: '2025-01-15',
    doctorId: '1',
    contactNumber: '+27-21-555-1012',
    email: 'thandiwe.mthembu@email.com',
    address: '12 Rondebosch Main Road, Rondebosch, Cape Town, 7700',
    addedBy: '1'
  },
  {
    id: 'pat13',
    name: 'Ahmed Hassan',
    age: 58,
    condition: 'High Blood Pressure',
    lastVisit: '2024-12-08',
    nextAppointment: '2025-01-12',
    doctorId: '1',
    contactNumber: '+27-21-555-1013',
    email: 'ahmed.hassan@email.com',
    address: '34 Woodstock Main Road, Woodstock, Cape Town, 7925',
    addedBy: '1'
  },
  {
    id: 'pat14',
    name: 'Lisa Johnson',
    age: 32,
    condition: 'Flu Symptoms',
    lastVisit: '2024-12-15',
    nextAppointment: '2025-01-20',
    doctorId: '1',
    contactNumber: '+27-21-555-1014',
    email: 'lisa.johnson@email.com',
    address: '78 Sea Point Main Road, Sea Point, Cape Town, 8005',
    addedBy: '1'
  },
  // Patients for Dr. Sarah Jacobs (ID: 2) - Sandton Private Practice
  {
    id: 'pat15',
    name: 'David Miller',
    age: 41,
    condition: 'Back Pain',
    lastVisit: '2024-12-12',
    nextAppointment: '2025-01-18',
    doctorId: '2',
    contactNumber: '+27-11-555-1015',
    email: 'david.miller@email.com',
    address: '45 Sandton Drive, Sandton, Johannesburg, 2196',
    addedBy: '2'
  },
  {
    id: 'pat16',
    name: 'Nomsa Khumalo',
    age: 29,
    condition: 'Stress Management',
    lastVisit: '2024-12-14',
    nextAppointment: '2025-01-22',
    doctorId: '2',
    contactNumber: '+27-11-555-1016',
    email: 'nomsa.khumalo@email.com',
    address: '67 Rivonia Road, Sandton, Johannesburg, 2196',
    addedBy: '2'
  },
  // Patients for Dr. Ayesha Khan (ID: 3) - Durban Medical Centre (Cardiologist)
  {
    id: 'pat17',
    name: 'Robert Singh',
    age: 62,
    condition: 'Chest Pain',
    lastVisit: '2024-12-09',
    nextAppointment: '2025-01-14',
    doctorId: '3',
    contactNumber: '+27-31-555-1017',
    email: 'robert.singh@email.com',
    address: '23 Berea Road, Durban, 4001',
    addedBy: '3'
  },
  {
    id: 'pat18',
    name: 'Fatima Patel',
    age: 55,
    condition: 'Heart Palpitations',
    lastVisit: '2024-12-11',
    nextAppointment: '2025-01-16',
    doctorId: '3',
    contactNumber: '+27-31-555-1018',
    email: 'fatima.patel@email.com',
    address: '89 Chatsworth Road, Chatsworth, Durban, 4092',
    addedBy: '3'
  },
  {
    id: 'pat19',
    name: 'John van der Merwe',
    age: 48,
    condition: 'High Cholesterol',
    lastVisit: '2024-12-13',
    nextAppointment: '2025-01-19',
    doctorId: '3',
    contactNumber: '+27-31-555-1019',
    email: 'john.vandermerwe@email.com',
    address: '156 Westville Road, Westville, Durban, 3630',
    addedBy: '3'
  },
  // Patients for Dr. Pieter van der Merwe (ID: 4) - Pretoria Health Institute (Cardiologist)
  {
    id: 'pat20',
    name: 'Elizabeth Molefe',
    age: 59,
    condition: 'Cardiac Arrhythmia',
    lastVisit: '2024-12-07',
    nextAppointment: '2025-01-11',
    doctorId: '4',
    contactNumber: '+27-12-555-1020',
    email: 'elizabeth.molefe@email.com',
    address: '78 Church Street, Pretoria Central, 0002',
    addedBy: '4'
  },
  {
    id: 'pat21',
    name: 'Sipho Dlamini',
    age: 44,
    condition: 'Hypertension',
    lastVisit: '2024-12-16',
    nextAppointment: '2025-01-23',
    doctorId: '4',
    contactNumber: '+27-12-555-1021',
    email: 'sipho.dlamini@email.com',
    address: '234 Schoeman Street, Pretoria, 0001',
    addedBy: '4'
  },
  // Patients for Dr. Nomsa Mokoena (ID: 5) - Cape Town Medical Center (Dermatologist)
  {
    id: 'pat22',
    name: 'Rachel Adams',
    age: 35,
    condition: 'Acne Treatment',
    lastVisit: '2024-12-05',
    nextAppointment: '2025-01-09',
    doctorId: '5',
    contactNumber: '+27-21-555-1022',
    email: 'rachel.adams@email.com',
    address: '45 Kloof Street, Gardens, Cape Town, 8001',
    addedBy: '5'
  },
  {
    id: 'pat23',
    name: 'Marcus Williams',
    age: 28,
    condition: 'Skin Allergy',
    lastVisit: '2024-12-18',
    nextAppointment: '2025-01-25',
    doctorId: '5',
    contactNumber: '+27-21-555-1023',
    email: 'marcus.williams@email.com',
    address: '67 Long Street, Cape Town CBD, 8001',
    addedBy: '5'
  },
  // Patients for Dr. Daniel Dlamini (ID: 6) - Johannesburg General Hospital (Dermatologist)
  {
    id: 'pat24',
    name: 'Lerato Motsepe',
    age: 33,
    condition: 'Eczema',
    lastVisit: '2024-12-06',
    nextAppointment: '2025-01-10',
    doctorId: '6',
    contactNumber: '+27-11-555-1024',
    email: 'lerato.motsepe@email.com',
    address: '123 Commissioner Street, Johannesburg CBD, 2001',
    addedBy: '6'
  },
  {
    id: 'pat25',
    name: 'Trevor Johnson',
    age: 51,
    condition: 'Psoriasis',
    lastVisit: '2024-12-17',
    nextAppointment: '2025-01-24',
    doctorId: '6',
    contactNumber: '+27-11-555-1025',
    email: 'trevor.johnson@email.com',
    address: '89 Pritchard Street, Johannesburg, 2001',
    addedBy: '6'
  },
  // Patients for Dr. Emma Williams (ID: 7) - Cape Town Medical Center (Pediatrician)
  {
    id: 'pat26',
    name: 'Amara Okafor',
    age: 8,
    condition: 'Vaccination Schedule',
    lastVisit: '2024-12-04',
    nextAppointment: '2025-01-08',
    doctorId: '7',
    contactNumber: '+27-21-555-1026',
    email: 'parent.okafor@email.com',
    address: '34 Cavendish Street, Claremont, Cape Town, 7708',
    addedBy: '7'
  },
  {
    id: 'pat27',
    name: 'Liam Thompson',
    age: 12,
    condition: 'Asthma Check-up',
    lastVisit: '2024-12-19',
    nextAppointment: '2025-01-26',
    doctorId: '7',
    contactNumber: '+27-21-555-1027',
    email: 'parent.thompson@email.com',
    address: '78 Wynberg Main Road, Wynberg, Cape Town, 7800',
    addedBy: '7'
  },
  // Patients for Dr. Sipho Mthembu (ID: 8) - Durban Children & Women Clinic (Pediatrician)
  {
    id: 'pat28',
    name: 'Zara Patel',
    age: 6,
    condition: 'Growth Check',
    lastVisit: '2024-12-03',
    nextAppointment: '2025-01-07',
    doctorId: '8',
    contactNumber: '+27-31-555-1028',
    email: 'parent.patel@email.com',
    address: '456 Florida Road, Durban, 4001',
    addedBy: '8'
  },
  {
    id: 'pat29',
    name: 'Aiden Naidoo',
    age: 10,
    condition: 'Stomach Flu',
    lastVisit: '2024-12-20',
    nextAppointment: '2025-01-27',
    doctorId: '8',
    contactNumber: '+27-31-555-1029',
    email: 'parent.naidoo@email.com',
    address: '234 Umbilo Road, Umbilo, Durban, 4001',
    addedBy: '8'
  },
  // Patients for Dr. Thandiwe Molefe (ID: 9) - Pretoria Health Institute (Psychiatrist)
  {
    id: 'pat30',
    name: 'Grace Mokoena',
    age: 38,
    condition: 'Anxiety Disorder',
    lastVisit: '2024-12-02',
    nextAppointment: '2025-01-06',
    doctorId: '9',
    contactNumber: '+27-12-555-1030',
    email: 'grace.mokoena@email.com',
    address: '45 Paul Kruger Street, Pretoria, 0002',
    addedBy: '9'
  },
  {
    id: 'pat31',
    name: 'Michael Botha',
    age: 42,
    condition: 'Depression',
    lastVisit: '2024-12-21',
    nextAppointment: '2025-01-28',
    doctorId: '9',
    contactNumber: '+27-12-555-1031',
    email: 'michael.botha@email.com',
    address: '67 Church Street, Pretoria Central, 0001',
    addedBy: '9'
  },
  // Patients for Dr. James Botha (ID: 10) - Sandton Private Practice (Psychiatrist)
  {
    id: 'pat32',
    name: 'Sarah du Plessis',
    age: 31,
    condition: 'PTSD Treatment',
    lastVisit: '2024-12-01',
    nextAppointment: '2025-01-05',
    doctorId: '10',
    contactNumber: '+27-11-555-1032',
    email: 'sarah.duplessis@email.com',
    address: '123 Rivonia Road, Sandton, Johannesburg, 2196',
    addedBy: '10'
  }
];

// Mock Consultations Data - Updated with new doctor IDs and comprehensive appointments
export const mockConsultations: Consultation[] = [
  // Past consultations
  {
    id: 'cons1',
    patientId: 'pat12',
    patientName: 'Thandiwe Mthembu',
    doctorId: '1',
    doctorName: 'Dr. Michael Naidoo',
    date: '2024-12-10',
    time: '10:00 AM',
    notes: 'Annual health screening completed. All vital signs normal. Recommended continued healthy lifestyle.',
    type: 'past',
    status: 'completed'
  },
  {
    id: 'cons2',
    patientId: 'pat13',
    patientName: 'Ahmed Hassan',
    doctorId: '1',
    doctorName: 'Dr. Michael Naidoo',
    date: '2024-12-08',
    time: '2:30 PM',
    notes: 'Blood pressure elevated at 150/95. Started on Lisinopril 10mg daily. Follow-up in 4 weeks.',
    type: 'past',
    status: 'completed'
  },
  {
    id: 'cons3',
    patientId: 'pat15',
    patientName: 'David Miller',
    doctorId: '2',
    doctorName: 'Dr. Sarah Jacobs',
    date: '2024-12-12',
    time: '11:30 AM',
    notes: 'Lower back pain assessment. Recommended physiotherapy and pain management exercises.',
    type: 'past',
    status: 'completed'
  },
  {
    id: 'cons4',
    patientId: 'pat17',
    patientName: 'Robert Singh',
    doctorId: '3',
    doctorName: 'Dr. Ayesha Khan',
    date: '2024-12-09',
    time: '9:15 AM',
    notes: 'Chest pain evaluation. ECG normal. Stress test scheduled. Prescribed nitrates as needed.',
    type: 'past',
    status: 'completed'
  },
  {
    id: 'cons5',
    patientId: 'pat20',
    patientName: 'Elizabeth Molefe',
    doctorId: '4',
    doctorName: 'Dr. Pieter van der Merwe',
    date: '2024-12-07',
    time: '1:45 PM',
    notes: 'Cardiac arrhythmia monitoring. Holter monitor results reviewed. Medication adjusted.',
    type: 'past',
    status: 'completed'
  },
  {
    id: 'cons6',
    patientId: 'pat22',
    patientName: 'Rachel Adams',
    doctorId: '5',
    doctorName: 'Dr. Nomsa Mokoena',
    date: '2024-12-05',
    time: '3:00 PM',
    notes: 'Acne treatment response good. Continue current topical regimen. Follow-up in 6 weeks.',
    type: 'past',
    status: 'completed'
  },
  {
    id: 'cons7',
    patientId: 'pat24',
    patientName: 'Lerato Motsepe',
    doctorId: '6',
    doctorName: 'Dr. Daniel Dlamini',
    date: '2024-12-06',
    time: '10:45 AM',
    notes: 'Eczema flare-up. Prescribed stronger topical steroid. Discussed trigger avoidance.',
    type: 'past',
    status: 'completed'
  },
  {
    id: 'cons8',
    patientId: 'pat26',
    patientName: 'Amara Okafor',
    doctorId: '7',
    doctorName: 'Dr. Emma Williams',
    date: '2024-12-04',
    time: '4:15 PM',
    notes: 'Vaccination schedule updated. MMR and DTP boosters administered. No adverse reactions.',
    type: 'past',
    status: 'completed'
  },
  {
    id: 'cons9',
    patientId: 'pat28',
    patientName: 'Zara Patel',
    doctorId: '8',
    doctorName: 'Dr. Sipho Mthembu',
    date: '2024-12-03',
    time: '2:00 PM',
    notes: 'Growth parameters within normal range. Developmental milestones appropriate for age.',
    type: 'past',
    status: 'completed'
  },
  {
    id: 'cons10',
    patientName: 'Grace Mokoena',
    patientId: 'pat30',
    doctorId: '9',
    doctorName: 'Dr. Thandiwe Molefe',
    date: '2024-12-02',
    time: '11:00 AM',
    notes: 'Anxiety symptoms improving with CBT. Medication dosage stable. Continue therapy sessions.',
    type: 'past',
    status: 'completed'
  },
  
  // Upcoming consultations/appointments for 2025
  {
    id: 'cons_upcoming1',
    patientId: 'pat13',
    patientName: 'Ahmed Hassan',
    doctorId: '1',
    doctorName: 'Dr. Michael Naidoo',
    date: '2025-01-12',
    time: '10:30 AM',
    notes: 'Follow-up for blood pressure management.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming2',
    patientId: 'pat12',
    patientName: 'Thandiwe Mthembu',
    doctorId: '1',
    doctorName: 'Dr. Michael Naidoo',
    date: '2025-01-15',
    time: '9:00 AM',
    notes: 'Annual follow-up examination.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming3',
    patientId: 'pat14',
    patientName: 'Lisa Johnson',
    doctorId: '1',
    doctorName: 'Dr. Michael Naidoo',
    date: '2025-01-20',
    time: '2:15 PM',
    notes: 'Flu symptoms follow-up.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming4',
    patientId: 'pat15',
    patientName: 'David Miller',
    doctorId: '2',
    doctorName: 'Dr. Sarah Jacobs',
    date: '2025-01-18',
    time: '11:00 AM',
    notes: 'Back pain physiotherapy progress review.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming5',
    patientId: 'pat16',
    patientName: 'Nomsa Khumalo',
    doctorId: '2',
    doctorName: 'Dr. Sarah Jacobs',
    date: '2025-01-22',
    time: '3:30 PM',
    notes: 'Stress management techniques discussion.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming6',
    patientId: 'pat17',
    patientName: 'Robert Singh',
    doctorId: '3',
    doctorName: 'Dr. Ayesha Khan',
    date: '2025-01-14',
    time: '9:45 AM',
    notes: 'Stress test results and treatment plan.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming7',
    patientId: 'pat18',
    patientName: 'Fatima Patel',
    doctorId: '3',
    doctorName: 'Dr. Ayesha Khan',
    date: '2025-01-16',
    time: '1:20 PM',
    notes: 'Heart palpitations monitoring review.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming8',
    patientId: 'pat19',
    patientName: 'John van der Merwe',
    doctorId: '3',
    doctorName: 'Dr. Ayesha Khan',
    date: '2025-01-19',
    time: '10:15 AM',
    notes: 'Cholesterol management and diet consultation.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming9',
    patientId: 'pat20',
    patientName: 'Elizabeth Molefe',
    doctorId: '4',
    doctorName: 'Dr. Pieter van der Merwe',
    date: '2025-01-11',
    time: '2:00 PM',
    notes: 'Arrhythmia medication adjustment follow-up.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming10',
    patientId: 'pat21',
    patientName: 'Sipho Dlamini',
    doctorId: '4',
    doctorName: 'Dr. Pieter van der Merwe',
    date: '2025-01-23',
    time: '11:30 AM',
    notes: 'Hypertension management review.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming11',
    patientId: 'pat22',
    patientName: 'Rachel Adams',
    doctorId: '5',
    doctorName: 'Dr. Nomsa Mokoena',
    date: '2025-01-09',
    time: '4:00 PM',
    notes: 'Acne treatment progress evaluation.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming12',
    patientId: 'pat23',
    patientName: 'Marcus Williams',
    doctorId: '5',
    doctorName: 'Dr. Nomsa Mokoena',
    date: '2025-01-25',
    time: '10:45 AM',
    notes: 'Skin allergy management and testing.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming13',
    patientId: 'pat24',
    patientName: 'Lerato Motsepe',
    doctorId: '6',
    doctorName: 'Dr. Daniel Dlamini',
    date: '2025-01-10',
    time: '9:30 AM',
    notes: 'Eczema flare-up follow-up.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming14',
    patientId: 'pat25',
    patientName: 'Trevor Johnson',
    doctorId: '6',
    doctorName: 'Dr. Daniel Dlamini',
    date: '2025-01-24',
    time: '1:15 PM',
    notes: 'Psoriasis treatment adjustment.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming15',
    patientId: 'pat26',
    patientName: 'Amara Okafor',
    doctorId: '7',
    doctorName: 'Dr. Emma Williams',
    date: '2025-01-08',
    time: '3:45 PM',
    notes: 'Vaccination schedule completion.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming16',
    patientId: 'pat27',
    patientName: 'Liam Thompson',
    doctorId: '7',
    doctorName: 'Dr. Emma Williams',
    date: '2025-01-26',
    time: '11:15 AM',
    notes: 'Asthma management and inhaler technique.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming17',
    patientId: 'pat28',
    patientName: 'Zara Patel',
    doctorId: '8',
    doctorName: 'Dr. Sipho Mthembu',
    date: '2025-01-07',
    time: '2:30 PM',
    notes: 'Growth and development assessment.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming18',
    patientId: 'pat29',
    patientName: 'Aiden Naidoo',
    doctorId: '8',
    doctorName: 'Dr. Sipho Mthembu',
    date: '2025-01-27',
    time: '10:00 AM',
    notes: 'Post-illness recovery check.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming19',
    patientId: 'pat30',
    patientName: 'Grace Mokoena',
    doctorId: '9',
    doctorName: 'Dr. Thandiwe Molefe',
    date: '2025-01-06',
    time: '1:00 PM',
    notes: 'Anxiety disorder therapy session.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming20',
    patientId: 'pat31',
    patientName: 'Michael Botha',
    doctorId: '9',
    doctorName: 'Dr. Thandiwe Molefe',
    date: '2025-01-28',
    time: '3:15 PM',
    notes: 'Depression treatment progress review.',
    type: 'upcoming',
    status: 'scheduled'
  },
  {
    id: 'cons_upcoming21',
    patientId: 'pat32',
    patientName: 'Sarah du Plessis',
    doctorId: '10',
    doctorName: 'Dr. James Botha',
    date: '2025-01-05',
    time: '10:30 AM',
    notes: 'PTSD therapy session.',
    type: 'upcoming',
    status: 'scheduled'
  }
];

// Update mock authentication credentials with new doctor IDs
export const mockAuthCredentials = [
  { email: 'michael.naidoo@email.com', password: 'password123', doctorId: '1' },
  { email: 'sarah.jacobs@email.com', password: 'password123', doctorId: '2' },
  { email: 'ayesha.khan@email.com', password: 'password123', doctorId: '3' },
  { email: 'pieter.vandermerwe@email.com', password: 'password123', doctorId: '4' },
  { email: 'nomsa.mokoena@email.com', password: 'password123', doctorId: '5' },
  { email: 'daniel.dlamini@email.com', password: 'password123', doctorId: '6' },
  { email: 'emma.williams@email.com', password: 'password123', doctorId: '7' },
  { email: 'sipho.mthembu@email.com', password: 'password123', doctorId: '8' },
  { email: 'thandiwe.molefe@email.com', password: 'password123', doctorId: '9' },
  { email: 'james.botha@email.com', password: 'password123', doctorId: '10' },
  { email: 'lindiwe.ndlovu@email.com', password: 'password123', doctorId: '11' },
  { email: 'warren.smith@email.com', password: 'password123', doctorId: '12' },
  { email: 'fatima.osman@email.com', password: 'password123', doctorId: '13' },
  { email: 'shaun.govender@email.com', password: 'password123', doctorId: '14' },
  { email: 'thulani.khumalo@email.com', password: 'password123', doctorId: '15' },
  { email: 'priya.singh@email.com', password: 'password123', doctorId: '16' },
  { email: 'johan.visser@email.com', password: 'password123', doctorId: '17' },
  { email: 'lebogang.moagi@email.com', password: 'password123', doctorId: '18' },
  { email: 'patricia.maseko@email.com', password: 'password123', doctorId: '19' },
  { email: 'andrew.green@email.com', password: 'password123', doctorId: '20' },
  // Admin credentials
  { email: 'admin@integratedhealth.co.za', password: 'admin123', doctorId: 'admin1' },
  { email: 'admin@johannesburghospital.co.za', password: 'admin123', doctorId: 'admin2' },
  { email: 'superadmin@integratedhealth.co.za', password: 'superadmin123', doctorId: 'superadmin1' }
];

// Mock Notifications Data
export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    title: 'New Patient Referral',
    message: 'Dr. Sarah Jacobs referred a patient to you for cardiology consultation.',
    date: '2024-12-22',
    read: false,
    doctorId: '1'
  },
  {
    id: 'notif2',
    title: 'Appointment Reminder',
    message: 'You have 3 appointments scheduled for tomorrow.',
    date: '2024-12-21',
    read: true,
    doctorId: '1'
  },
  {
    id: 'notif3',
    title: 'Lab Results Available',
    message: 'Blood work results for Ahmed Hassan are ready for review.',
    date: '2024-12-20',
    read: false,
    doctorId: '1'
  }
];

// Mock Referrals Data
export const mockHospitalCompanies: HospitalCompany[] = [
  {
    id: 'hosp1',
    name: 'Integrated Health Ecosystem',
    type: 'medical_center',
    address: '456 Health Avenue, Cape Town',
    city: 'Cape Town',
    phone: '+27 21 555 0101',
    email: 'info@integratedhealth.co.za',
    website: 'www.integratedhealth.co.za',
    established: '2020',
    totalDoctors: 120,
    departments: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine', 'Dermatology', 'Psychiatry', 'Emergency Medicine'],
    description: 'Comprehensive medical management platform providing integrated healthcare solutions and seamless patient care coordination.',
    logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop&crop=center'
  },
  {
    id: 'hosp2',
    name: 'Johannesburg General Hospital',
    type: 'hospital',
    address: '456 Main Street, Johannesburg',
    city: 'Johannesburg',
    phone: '+27 11 555 0202',
    email: 'admin@johannesburghospital.co.za',
    website: 'www.johannesburghospital.co.za',
    established: '1988',
    totalDoctors: 78,
    departments: ['Emergency Medicine', 'Surgery', 'Cardiology', 'Oncology', 'Psychiatry'],
    description: 'Premier hospital serving Johannesburg with comprehensive medical services and emergency care.',
    logo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&h=150&fit=crop&crop=center'
  },
  {
    id: 'hosp3',
    name: 'Durban Medical Clinic',
    type: 'clinic',
    address: '789 Beach Road, Durban',
    city: 'Durban',
    phone: '+27 31 555 0303',
    email: 'contact@durbanclinic.co.za',
    website: 'www.durbanclinic.co.za',
    established: '2002',
    totalDoctors: 32,
    departments: ['Family Medicine', 'Dermatology', 'Gynecology', 'Pediatrics'],
    description: 'Family-focused medical clinic providing personalized care in a comfortable environment.',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=150&fit=crop&crop=center'
  },
  {
    id: 'hosp4',
    name: 'Pretoria Heart Institute',
    type: 'specialty_clinic',
    address: '321 Heart Street, Pretoria',
    city: 'Pretoria',
    phone: '+27 12 555 0404',
    email: 'info@pretoriaheart.co.za',
    website: 'www.pretoriaheart.co.za',
    established: '2008',
    totalDoctors: 28,
    departments: ['Cardiology', 'Cardiac Surgery', 'Cardiac Rehabilitation'],
    description: 'Specialized cardiac care center with advanced heart treatment facilities.',
    logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop&crop=center'
  },
  {
    id: 'hosp5',
    name: 'Port Elizabeth Medical Group',
    type: 'medical_center',
    address: '654 Ocean Drive, Port Elizabeth',
    city: 'Port Elizabeth',
    phone: '+27 41 555 0505',
    email: 'admin@pemedical.co.za',
    website: 'www.pemedical.co.za',
    established: '1992',
    totalDoctors: 56,
    departments: ['Internal Medicine', 'Surgery', 'Radiology', 'Anesthesiology', 'Emergency Medicine'],
    description: 'Comprehensive medical group providing integrated healthcare services.',
    logo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&h=150&fit=crop&crop=center'
  },
  {
    id: 'hosp6',
    name: 'Bloemfontein Children\'s Hospital',
    type: 'hospital',
    address: '987 Child Care Avenue, Bloemfontein',
    city: 'Bloemfontein',
    phone: '+27 51 555 0606',
    email: 'info@bloemchildren.co.za',
    website: 'www.bloemchildren.co.za',
    established: '1999',
    totalDoctors: 42,
    departments: ['Pediatrics', 'Pediatric Surgery', 'Neonatology', 'Child Psychiatry'],
    description: 'Specialized children\'s hospital providing compassionate care for young patients.',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=150&fit=crop&crop=center'
  },
  {
    id: 'hosp7',
    name: 'East London Medical Center',
    type: 'medical_center',
    address: '147 Health Boulevard, East London',
    city: 'East London',
    phone: '+27 43 555 0707',
    email: 'contact@elmedical.co.za',
    website: 'www.elmedical.co.za',
    established: '2005',
    totalDoctors: 38,
    departments: ['General Practice', 'Dermatology', 'Orthopedics', 'Physiotherapy'],
    description: 'Modern medical center offering comprehensive healthcare with a focus on community wellness.',
    logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop&crop=center'
  },
  {
    id: 'hosp8',
    name: 'Nelspruit Specialty Clinic',
    type: 'specialty_clinic',
    address: '258 Specialist Road, Nelspruit',
    city: 'Nelspruit',
    phone: '+27 13 555 0808',
    email: 'info@nelspruitspecialty.co.za',
    website: 'www.nelspruitspecialty.co.za',
    established: '2010',
    totalDoctors: 24,
    departments: ['Oncology', 'Neurology', 'Endocrinology', 'Rheumatology'],
    description: 'Specialty clinic focusing on complex medical conditions and advanced treatments.',
    logo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&h=150&fit=crop&crop=center'
  },
  {
    id: 'hosp9',
    name: 'Kimberley General Hospital',
    type: 'hospital',
    address: '369 Diamond Street, Kimberley',
    city: 'Kimberley',
    phone: '+27 53 555 0909',
    email: 'admin@kimberleyhospital.co.za',
    website: 'www.kimberleyhospital.co.za',
    established: '1985',
    totalDoctors: 65,
    departments: ['Emergency Medicine', 'General Surgery', 'Obstetrics', 'Gynecology', 'Pediatrics'],
    description: 'Full-service hospital providing emergency and routine medical care to the community.',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=150&fit=crop&crop=center'
  },
  {
    id: 'hosp10',
    name: 'Polokwane Medical Practice',
    type: 'clinic',
    address: '741 Limpopo Avenue, Polokwane',
    city: 'Polokwane',
    phone: '+27 15 555 1010',
    email: 'info@polokwanemedical.co.za',
    website: 'www.polokwanemedical.co.za',
    established: '2003',
    totalDoctors: 18,
    departments: ['Family Medicine', 'General Practice', 'Preventive Care'],
    description: 'Community-focused medical practice emphasizing preventive care and family health.',
    logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop&crop=center'
  }
];

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'admin1',
    name: 'Dr. Sarah Johnson',
    email: 'admin@integratedhealth.co.za',
    role: 'admin',
    facilityId: 'hosp1',
    permissions: ['approve_doctors', 'view_patients', 'view_progress', 'manage_schedules'],
    lastLogin: '2024-12-22'
  },
  {
    id: 'admin2',
    name: 'Dr. Michael Chen',
    email: 'admin@johannesburghospital.co.za',
    role: 'admin',
    facilityId: 'hosp2',
    permissions: ['approve_doctors', 'view_patients', 'view_progress', 'manage_schedules'],
    lastLogin: '2024-12-22'
  },
  {
    id: 'superadmin1',
    name: 'Dr. Elizabeth Williams',
    email: 'superadmin@integratedhealth.co.za',
    role: 'super_admin',
    facilityId: 'all',
    permissions: ['approve_doctors', 'view_patients', 'view_progress', 'manage_schedules', 'manage_facilities'],
    lastLogin: '2024-12-22'
  }
];

export const mockPatientProgress: PatientProgress[] = [
  {
    id: 'progress1',
    patientId: 'pat1',
    date: '2024-12-20',
    doctorId: '1',
    doctorName: 'Dr. Michael Naidoo',
    progressType: 'improvement',
    progressScore: 8,
    notes: 'Patient showing significant improvement in mobility and pain management.',
    symptoms: ['Reduced pain', 'Improved mobility', 'Better sleep'],
    treatmentResponse: 'Excellent response to physical therapy and medication.',
    nextSteps: 'Continue current treatment plan, schedule follow-up in 2 weeks.',
    weeklyReviewNotes: 'Patient progressing well, consider reducing medication dosage.'
  },
  {
    id: 'progress2',
    patientId: 'pat2',
    date: '2024-12-21',
    doctorId: '2',
    doctorName: 'Dr. Sarah Jacobs',
    progressType: 'stable',
    progressScore: 6,
    notes: 'Patient condition remains stable with no significant changes.',
    symptoms: ['Stable blood pressure', 'Consistent energy levels', 'Regular sleep pattern'],
    treatmentResponse: 'Good response to current medication regimen.',
    nextSteps: 'Maintain current treatment, monitor for any changes.',
    weeklyReviewNotes: 'Patient stable, continue monitoring.'
  },
  {
    id: 'progress3',
    patientId: 'pat3',
    date: '2024-12-22',
    doctorId: '3',
    doctorName: 'Dr. Ayesha Khan',
    progressType: 'improvement',
    progressScore: 9,
    notes: 'Excellent progress in cardiac function and overall health.',
    symptoms: ['Improved heart function', 'Better exercise tolerance', 'Reduced fatigue'],
    treatmentResponse: 'Outstanding response to cardiac rehabilitation program.',
    nextSteps: 'Continue rehabilitation, gradually increase exercise intensity.',
    weeklyReviewNotes: 'Patient exceeding expectations, consider early discharge planning.'
  },
  {
    id: 'progress4',
    patientId: 'pat4',
    date: '2024-12-19',
    doctorId: '4',
    doctorName: 'Dr. Pieter van der Merwe',
    progressType: 'decline',
    progressScore: 3,
    notes: 'Patient showing signs of regression in treatment response.',
    symptoms: ['Increased pain', 'Reduced mobility', 'Poor sleep quality'],
    treatmentResponse: 'Poor response to current treatment, needs adjustment.',
    nextSteps: 'Review and adjust treatment plan, consider alternative therapies.',
    weeklyReviewNotes: 'Patient needs immediate attention, consider specialist consultation.'
  },
  {
    id: 'progress5',
    patientId: 'pat5',
    date: '2024-12-18',
    doctorId: '5',
    doctorName: 'Dr. Nomsa Mokoena',
    progressType: 'stable',
    progressScore: 7,
    notes: 'Patient maintaining good condition with consistent treatment response.',
    symptoms: ['Stable skin condition', 'Good medication compliance', 'Regular check-ups'],
    treatmentResponse: 'Consistent response to topical treatments.',
    nextSteps: 'Continue current treatment regimen, schedule monthly review.',
    weeklyReviewNotes: 'Patient compliant and stable, continue current approach.'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    fromDoctorId: '1',
    fromDoctorName: 'Dr. Michael Naidoo',
    toDoctorId: '3',
    toDoctorName: 'Dr. Ayesha Khan',
    subject: 'Patient Consultation Request',
    content: 'Hi Dr. Khan, I have a patient with suspected cardiac issues that I would like to discuss with you. Patient is showing symptoms of chest pain and irregular heartbeat. Would you be available for a consultation this week?',
    date: '2024-12-22',
    read: false,
    priority: 'medium',
    messageType: 'consultation',
    relatedPatientId: 'pat1',
    relatedPatientName: 'Ahmed Hassan'
  },
  {
    id: 'msg2',
    fromDoctorId: '2',
    fromDoctorName: 'Dr. Sarah Jacobs',
    toDoctorId: '1',
    toDoctorName: 'Dr. Michael Naidoo',
    subject: 'Patient Referral - Dermatology Case',
    content: 'Dr. Naidoo, I\'m referring a patient with a complex skin condition that requires specialist attention. The patient has been experiencing persistent rashes and skin lesions. Please review the attached medical history.',
    date: '2024-12-21',
    read: true,
    priority: 'high',
    messageType: 'patient_referral',
    relatedPatientId: 'pat2',
    relatedPatientName: 'Maria Rodriguez'
  },
  {
    id: 'msg3',
    fromDoctorId: '3',
    fromDoctorName: 'Dr. Ayesha Khan',
    toDoctorId: '2',
    toDoctorName: 'Dr. Sarah Jacobs',
    subject: 'Emergency Consultation Needed',
    content: 'URGENT: I have a patient with severe cardiac symptoms that requires immediate attention. Patient is experiencing chest pain, shortness of breath, and irregular heartbeat. Please respond as soon as possible.',
    date: '2024-12-22',
    read: false,
    priority: 'urgent',
    messageType: 'emergency',
    relatedPatientId: 'pat3',
    relatedPatientName: 'John Smith'
  },
  {
    id: 'msg4',
    fromDoctorId: '4',
    fromDoctorName: 'Dr. Pieter van der Merwe',
    toDoctorId: '5',
    toDoctorName: 'Dr. Nomsa Mokoena',
    subject: 'Weekly Department Meeting',
    content: 'Hi Dr. Mokoena, just a reminder about our weekly department meeting tomorrow at 2 PM. We\'ll be discussing new protocols and patient cases. Please bring any updates on your current patients.',
    date: '2024-12-20',
    read: true,
    priority: 'low',
    messageType: 'general'
  },
  {
    id: 'msg5',
    fromDoctorId: '5',
    fromDoctorName: 'Dr. Nomsa Mokoena',
    toDoctorId: '4',
    toDoctorName: 'Dr. Pieter van der Merwe',
    subject: 'Patient Progress Update',
    content: 'Dr. van der Merwe, I wanted to update you on the progress of our shared patient. The treatment plan is working well and we\'re seeing significant improvement. Should we schedule a follow-up consultation?',
    date: '2024-12-19',
    read: true,
    priority: 'medium',
    messageType: 'consultation',
    relatedPatientId: 'pat4',
    relatedPatientName: 'Lisa Johnson'
  },
  {
    id: 'msg6',
    fromDoctorId: '1',
    fromDoctorName: 'Dr. Michael Naidoo',
    toDoctorId: '2',
    toDoctorName: 'Dr. Sarah Jacobs',
    subject: 'Hospital Protocol Discussion',
    content: 'Dr. Jacobs, I wanted to discuss some improvements to our hospital protocols. I\'ve noticed some areas where we could enhance patient care and efficiency. Would you be interested in meeting to discuss this?',
    date: '2024-12-18',
    read: false,
    priority: 'low',
    messageType: 'general'
  }
];

export const mockReferrals: Referral[] = [
  {
    id: 'ref1',
    patientId: 'pat15',
    patientName: 'David Miller',
    fromDoctorId: '2',
    fromDoctorName: 'Dr. Sarah Jacobs',
    toDoctorId: '3',
    toDoctorName: 'Dr. Ayesha Khan',
    reason: 'Suspected cardiac issues requiring specialist evaluation',
    notes: 'Patient experiencing chest pain and irregular heartbeat. ECG shows minor abnormalities. Blood pressure elevated at 150/95. Requesting cardiology consultation for comprehensive evaluation.',
    urgency: 'medium',
    status: 'pending',
    createdDate: '2024-12-22',
    specialtyRequested: 'Cardiology',
    patientCondition: 'Chest pain, irregular heartbeat, hypertension',
    expectedOutcome: 'Cardiac assessment, treatment plan, ongoing monitoring'
  },
  {
    id: 'ref2',
    patientId: 'pat27',
    patientName: 'Liam Thompson',
    fromDoctorId: '1',
    fromDoctorName: 'Dr. Michael Naidoo',
    toDoctorId: '7',
    toDoctorName: 'Dr. Emma Williams',
    reason: 'Asthma management requiring pediatric specialist',
    notes: 'Young patient with worsening asthma symptoms. Current inhaler not providing adequate relief. Family history of respiratory issues. Would benefit from pediatric pulmonary assessment.',
    urgency: 'high',
    status: 'accepted',
    createdDate: '2024-12-20',
    respondedDate: '2024-12-21',
    specialtyRequested: 'Pediatrics',
    patientCondition: 'Worsening asthma, poor inhaler response',
    expectedOutcome: 'Improved asthma management plan, medication adjustment'
  },
  {
    id: 'ref3',
    patientId: 'pat30',
    patientName: 'Grace Mokoena',
    fromDoctorId: '1',
    fromDoctorName: 'Dr. Michael Naidoo',
    toDoctorId: '9',
    toDoctorName: 'Dr. Thandiwe Molefe',
    reason: 'Anxiety symptoms requiring psychiatric evaluation',
    notes: 'Patient presenting with severe anxiety symptoms affecting daily life. Has been on general anxiety medication but symptoms persist. Requesting psychiatric consultation for comprehensive mental health assessment.',
    urgency: 'medium',
    status: 'accepted',
    createdDate: '2024-12-18',
    respondedDate: '2024-12-19',
    specialtyRequested: 'Psychiatry',
    patientCondition: 'Severe anxiety, medication resistance',
    expectedOutcome: 'Comprehensive mental health assessment, treatment optimization'
  },
  {
    id: 'ref4',
    patientId: 'pat22',
    patientName: 'Rachel Adams',
    fromDoctorId: '1',
    fromDoctorName: 'Dr. Michael Naidoo',
    toDoctorId: '5',
    toDoctorName: 'Dr. Nomsa Mokoena',
    reason: 'Persistent skin condition requiring dermatology expertise',
    notes: 'Patient has persistent acne that hasn\'t responded to standard treatments. Considering hormonal factors and advanced dermatological interventions. Requesting specialist evaluation.',
    urgency: 'low',
    status: 'pending',
    createdDate: '2024-12-23',
    specialtyRequested: 'Dermatology',
    patientCondition: 'Treatment-resistant acne',
    expectedOutcome: 'Advanced dermatological assessment, specialized treatment plan'
  }
];

// Hospital/Facility Grouping Component for easy display
export const getHospitalGroupedDoctors = () => {
  const grouped = mockFacilities.map(facility => ({
    ...facility,
    doctors: mockDoctors.filter(doctor => doctor.facilityId === facility.id)
      .map(doctor => ({
        ...doctor,
        relationship: doctor.facilityRelationship || 'employee'
      }))
  }));
  
  return grouped.filter(group => group.doctors.length > 0);
};

// Wellness Professionals Data based on Amity Wellness
export const mockWellnessProfessionals: WellnessProfessional[] = [
  {
    id: 'wp1',
    name: 'Michelle Cooper',
    specialization: 'Diagnostic Nutrition & Functional Medicine',
    expertise: ['Diagnostic Nutrition', 'Functional Medicine', 'Gut Specialist', 'Wellness Coaching', 'Detox Specialist'],
    experience: 15,
    location: 'Cape Town, South Africa',
    facilityName: 'Cape Town Wellness Centre',
    facilityAddress: '45 Kloof Nek Road, Gardens, Cape Town, 8001',
    contactNumber: '+27-21-555-0101',
    email: 'michelle@capetownwellness.co.za',
    profilePicture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec0?w=400&h=400&fit=crop&crop=face',
    coordinates: [-33.9278, 18.4167], // Kloof Nek Road - Cape Town
    services: ['Nutritional Consultations', 'Functional Medicine', 'Gut Health', 'Detox Programs', 'Wellness Coaching'],
    qualifications: ['Diagnostic Nutrition', 'Functional Medicine', 'Gut Specialist'],
    availability: 'Available for consultations and retreats',
    consultationFee: 'Contact for pricing',
    isExternal: true,
    category: 'nutrition',
    description: 'Founder of Cape Town Wellness Centre with expertise in diagnostic nutrition, functional medicine, and gut health. Specializes in creating personalized wellness programs.',
    workingHours: 'Mon - Sun 09:00 - 18:00',
    languages: ['English', 'Afrikaans']
  },
  {
    id: 'wp2',
    name: 'Hayden Rhodes',
    specialization: 'Holistic Lifestyle Coaching & Mindset',
    expertise: ['CHEK Holistic Lifestyle Coach', 'Mindset Specialist', 'Functional Diagnostic Nutrition'],
    experience: 12,
    location: 'Cape Town, South Africa',
    facilityName: 'Cape Town Wellness Centre',
    facilityAddress: '67 Bree Street, CBD, Cape Town, 8001',
    contactNumber: '+27-21-555-0102',
    email: 'hayden@capetownwellness.co.za',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    coordinates: [-33.9258, 18.4238], // Bree Street - Cape Town CBD
    services: ['Holistic Lifestyle Coaching', 'Mindset Coaching', 'Functional Nutrition', 'Wellness Programs'],
    qualifications: ['CHEK Holistic Lifestyle Coach', 'Mindset Specialist'],
    availability: 'Available for coaching sessions',
    consultationFee: 'Contact for pricing',
    isExternal: true,
    category: 'wellness',
    description: 'International mindset specialist and holistic lifestyle coach with expertise in performance psychology and functional nutrition.',
    workingHours: 'Mon - Sun 09:00 - 18:00',
    languages: ['English']
  },
  {
    id: 'wp3',
    name: 'Marco Economides',
    specialization: 'Emotional Release Therapy & Mindset Coaching',
    expertise: ['Emotional Release Therapy', 'Subconscious Work', 'Family Constellations', 'NLP', 'Hypnotherapy'],
    experience: 18,
    location: 'Cape Town, South Africa',
    facilityName: 'Cape Town Wellness Centre',
    facilityAddress: '89 Loop Street, CBD, Cape Town, 8001',
    contactNumber: '+27-21-555-0103',
    email: 'marco@capetownwellness.co.za',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    coordinates: [-33.9267, 18.4228], // Loop Street - Cape Town CBD
    services: ['Emotional Release Therapy', 'Subconscious Work', 'Family Constellations', 'NLP Sessions', 'Hypnotherapy'],
    qualifications: ['NLP Practitioner', 'Hypnotherapist', 'Family Constellations Facilitator'],
    availability: 'Available for therapy sessions',
    consultationFee: 'Contact for pricing',
    isExternal: true,
    category: 'therapy',
    description: 'Specialist in emotional release therapy and subconscious work, helping clients overcome deep-seated emotional patterns.',
    workingHours: 'Mon - Sun 09:00 - 18:00',
    languages: ['English', 'Greek']
  },
  {
    id: 'wp4',
    name: 'Kim White',
    specialization: 'Mind Body Yoga & Sound Healing',
    expertise: ['Mind Body Yoga', 'Sound Healing', 'Meditation', 'Breathwork'],
    experience: 10,
    location: 'Cape Town, South Africa',
    facilityName: 'Cape Town Wellness Centre',
    facilityAddress: '123 Wale Street, CBD, Cape Town, 8001',
    contactNumber: '+27-21-555-0104',
    email: 'kim@capetownwellness.co.za',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    coordinates: [-33.9256, 18.4247], // Wale Street - Cape Town CBD
    services: ['Private Yoga', 'Sound Healing Sessions', 'Meditation Classes', 'Breathwork Workshops'],
    qualifications: ['Yoga Instructor', 'Sound Healer', 'Meditation Teacher'],
    availability: 'Available for private sessions and group classes',
    consultationFee: 'Contact for pricing',
    isExternal: true,
    category: 'fitness',
    description: 'Experienced yoga instructor specializing in mind-body connection, sound healing, and meditation practices.',
    workingHours: 'Mon - Sun 09:00 - 18:00',
    languages: ['English']
  },
  {
    id: 'wp5',
    name: 'Sarunya Samutsarun',
    specialization: 'Physiotherapy & Deep Tissue Massage',
    expertise: ['Physiotherapy', 'Deep Tissue Massage', 'Therapeutic Exercise', 'Structural Realignment'],
    experience: 8,
    location: 'Cape Town, South Africa',
    facilityName: 'Cape Town Wellness Centre',
    facilityAddress: '156 Long Street, CBD, Cape Town, 8001',
    contactNumber: '+27-21-555-0105',
    email: 'sarunya@capetownwellness.co.za',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    coordinates: [-33.9258, 18.4238], // Long Street - Cape Town CBD
    services: ['Physiotherapy', 'Deep Tissue Massage', 'Therapeutic Exercise', 'Structural Assessment'],
    qualifications: ['Physiotherapist', 'Massage Therapist', 'Exercise Specialist'],
    availability: 'Available for therapy sessions',
    consultationFee: 'Contact for pricing',
    isExternal: true,
    category: 'therapy',
    description: 'Skilled physiotherapist specializing in deep tissue massage and therapeutic exercise for rehabilitation and wellness.',
    workingHours: 'Mon - Sun 09:00 - 18:00',
    languages: ['English', 'Afrikaans']
  },
  {
    id: 'wp6',
    name: 'Khun Pit',
    specialization: 'Raw Food Chef & Wellness Cuisine',
    expertise: ['Raw Vegan Cuisine', 'Living Foods', 'Wellness Nutrition', 'Kitchen Management'],
    experience: 12,
    location: 'Cape Town, South Africa',
    facilityName: 'Cape Town Wellness Centre',
    facilityAddress: '234 Orange Street, Gardens, Cape Town, 8001',
    contactNumber: '+27-21-555-0106',
    email: 'pit@capetownwellness.co.za',
    profilePicture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    coordinates: [-33.9292, 18.4174], // Orange Street - Cape Town
    services: ['Raw Food Preparation', 'Wellness Meal Planning', 'Cooking Workshops', 'Nutritional Guidance'],
    qualifications: ['Raw Food Chef', 'Wellness Cuisine Specialist', 'Management Degree'],
    availability: 'Available for workshops and meal planning',
    consultationFee: 'Contact for pricing',
    isExternal: true,
    category: 'nutrition',
    description: 'Head Raw Food Chef with expertise in creating vibrant, living foods that nourish both body and soul. Passionate about raw vegan cuisine and wellness.',
    workingHours: 'Mon - Sun 09:00 - 18:00',
    languages: ['English', 'Afrikaans']
  },
  {
    id: 'wp7',
    name: 'Simon Sutherland',
    specialization: 'Reiki & Quantum Healing',
    expertise: ['Reiki Attunements', 'Quantum Healing', 'Bikram Yoga', 'Energy Work'],
    experience: 15,
    location: 'Cape Town, South Africa',
    facilityName: 'Cape Town Wellness Centre',
    facilityAddress: '78 Mill Street, Gardens, Cape Town, 8001',
    contactNumber: '+27-21-555-0107',
    email: 'simon@capetownwellness.co.za',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    coordinates: [-33.9284, 18.4156], // Mill Street - Cape Town
    services: ['Reiki Sessions', 'Quantum Healing', 'Bikram Yoga Classes', 'Energy Work'],
    qualifications: ['Reiki Master', 'Quantum Healer', 'Bikram Yoga Instructor'],
    availability: 'Available for healing sessions and yoga classes',
    consultationFee: 'Contact for pricing',
    isExternal: true,
    category: 'spiritual',
    description: 'Experienced Reiki master and quantum healer specializing in energy work and spiritual development through various healing modalities.',
    workingHours: 'Mon - Sun 09:00 - 18:00',
    languages: ['English']
  },
  {
    id: 'wp8',
    name: 'Tia Saohong',
    specialization: 'Traditional Thai Massage & Aromatherapy',
    expertise: ['Traditional Thai Massage', 'Oil Aromatherapy Massage', 'Reflexology', 'Wellness Therapy'],
    experience: 6,
    location: 'Cape Town, South Africa',
    facilityName: 'Cape Town Wellness Centre',
    facilityAddress: '45 Somerset Road, Green Point, Cape Town, 8005',
    contactNumber: '+27-21-555-0108',
    email: 'tia@capetownwellness.co.za',
    profilePicture: 'https://images.unsplash.com/photo-1594824488872-0b2ff0c0e4b0?w=400&h=400&fit=crop&crop=face',
    coordinates: [-33.9089, 18.4089], // Somerset Road - Green Point, Cape Town
    services: ['Traditional Thai Massage', 'Aromatherapy Massage', 'Reflexology', 'Wellness Treatments'],
    qualifications: ['Thai Massage Therapist', 'Aromatherapist', 'Reflexologist'],
    availability: 'Available for massage sessions',
    consultationFee: 'Contact for pricing',
    isExternal: true,
    category: 'spa',
    description: 'Skilled Thai massage therapist specializing in traditional techniques and aromatherapy for relaxation and wellness.',
    workingHours: 'Mon - Sun 09:00 - 18:00',
    languages: ['English', 'Afrikaans']
  }
];

// Helper function to get wellness professionals by category
export const getWellnessProfessionalsByCategory = (category?: string) => {
  if (!category) return mockWellnessProfessionals;
  return mockWellnessProfessionals.filter(wp => wp.category === category);
};

// Helper function to get wellness professionals by specialization
export const getWellnessProfessionalsBySpecialization = (specialization: string) => {
  return mockWellnessProfessionals.filter(wp => 
    wp.specialization.toLowerCase().includes(specialization.toLowerCase()) ||
    wp.expertise.some(exp => exp.toLowerCase().includes(specialization.toLowerCase()))
  );
};

// Comprehensive List of 50 Fictional South African Healthcare & Wellness Professionals
export const comprehensiveHealthcareProfessionals = [
  // MEDICAL DOCTORS (GPs, Specialists, Surgeons)
  {
    id: 'cp1',
    name: 'Dr. Thabo Maseko',
    title: 'General Practitioner',
    facilityName: 'Cape Town Family Medical Centre',
    specialty: 'Primary Care & Family Medicine',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp2',
    name: 'Dr. Aisha Patel',
    title: 'Cardiologist',
    facilityName: 'Groote Schuur Heart Institute',
    specialty: 'Interventional Cardiology',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp3',
    name: 'Dr. Pieter van der Berg',
    title: 'Orthopedic Surgeon',
    facilityName: 'Tygerberg Orthopedic Hospital',
    specialty: 'Joint Replacement & Sports Medicine',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp4',
    name: 'Dr. Nomsa Dlamini',
    title: 'Pediatrician',
    facilityName: 'Red Cross Children\'s Medical Centre',
    specialty: 'Pediatric Care & Development',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp5',
    name: 'Dr. Rajesh Naidoo',
    title: 'Neurologist',
    facilityName: 'Cape Town Neurology Institute',
    specialty: 'Neurological Disorders & Stroke Care',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp6',
    name: 'Dr. Sarah Jacobs',
    title: 'Dermatologist',
    facilityName: 'Sea Point Skin Clinic',
    specialty: 'Medical & Cosmetic Dermatology',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp7',
    name: 'Dr. Themba Nkosi',
    title: 'Psychiatrist',
    facilityName: 'Cape Town Mental Health Centre',
    specialty: 'Adult Psychiatry & Addiction Medicine',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp8',
    name: 'Dr. Emma Botha',
    title: 'Gynecologist',
    facilityName: 'Cape Town Women\'s Health Clinic',
    specialty: 'Women\'s Health & Obstetrics',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp9',
    name: 'Dr. Sipho Mthembu',
    title: 'ENT Specialist',
    facilityName: 'Cape Town ENT & Hearing Centre',
    specialty: 'Ear, Nose & Throat Surgery',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp10',
    name: 'Dr. Lindiwe Ndlovu',
    title: 'Oncologist',
    facilityName: 'Cape Town Cancer Treatment Centre',
    specialty: 'Medical Oncology & Chemotherapy',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // NURSES & ALLIED HEALTH WORKERS
  {
    id: 'cp11',
    name: 'Sister Grace Williams',
    title: 'Registered Nurse',
    facilityName: 'Cape Town General Hospital',
    specialty: 'Emergency & Trauma Nursing',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp12',
    name: 'Sister Zanele Khumalo',
    title: 'Midwife',
    facilityName: 'Cape Town Maternity Centre',
    specialty: 'Prenatal Care & Delivery',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp13',
    name: 'Sister Fatima Abrahams',
    title: 'ICU Nurse',
    facilityName: 'Cape Town Critical Care Unit',
    specialty: 'Intensive Care & Life Support',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp14',
    name: 'Sister Lerato Molefe',
    title: 'Pediatric Nurse',
    facilityName: 'Red Cross Children\'s Hospital',
    specialty: 'Pediatric Nursing & Care',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp15',
    name: 'Sister Annette de Villiers',
    title: 'Operating Theatre Nurse',
    facilityName: 'Cape Town Surgical Centre',
    specialty: 'Surgical Nursing & Sterilization',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // PHYSIOTHERAPISTS & REHABILITATION
  {
    id: 'cp16',
    name: 'Mpho Ramaphosa',
    title: 'Physiotherapist',
    facilityName: 'Cape Town Rehabilitation Centre',
    specialty: 'Sports Injury & Rehabilitation',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp17',
    name: 'Johan van Rensburg',
    title: 'Physiotherapist',
    facilityName: 'Cape Town Sports Medicine Clinic',
    specialty: 'Athletic Performance & Recovery',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp18',
    name: 'Nokuthula Dube',
    title: 'Occupational Therapist',
    facilityName: 'Cape Town Occupational Therapy Centre',
    specialty: 'Workplace Injury & Rehabilitation',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp19',
    name: 'David Cohen',
    title: 'Speech Therapist',
    facilityName: 'Cape Town Speech & Language Centre',
    specialty: 'Communication Disorders & Swallowing',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp20',
    name: 'Thandiwe Mokoena',
    title: 'Respiratory Therapist',
    facilityName: 'Cape Town Respiratory Care Unit',
    specialty: 'Lung Function & Breathing Disorders',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // DIETITIANS & NUTRITION
  {
    id: 'cp21',
    name: 'Michelle Cooper',
    title: 'Clinical Dietitian',
    facilityName: 'Cape Town Nutrition Centre',
    specialty: 'Medical Nutrition Therapy',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp22',
    name: 'Khaya Ndlovu',
    title: 'Sports Dietitian',
    facilityName: 'Cape Town Sports Nutrition Clinic',
    specialty: 'Athletic Performance & Recovery Nutrition',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp23',
    name: 'Priya Singh',
    title: 'Pediatric Dietitian',
    facilityName: 'Cape Town Children\'s Nutrition Centre',
    specialty: 'Child & Adolescent Nutrition',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // PSYCHOLOGISTS & MENTAL HEALTH
  {
    id: 'cp24',
    name: 'Dr. Marco Economides',
    title: 'Clinical Psychologist',
    facilityName: 'Cape Town Psychology Centre',
    specialty: 'Trauma Therapy & PTSD Treatment',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp25',
    name: 'Dr. Kim White',
    title: 'Child Psychologist',
    facilityName: 'Cape Town Child Psychology Clinic',
    specialty: 'Child Development & Behavioral Therapy',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp26',
    name: 'Dr. Simon Sutherland',
    title: 'Forensic Psychologist',
    facilityName: 'Cape Town Forensic Psychology Institute',
    specialty: 'Criminal Psychology & Court Evaluations',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // SPA & WELLNESS EXPERTS
  {
    id: 'cp27',
    name: 'Tia Saohong',
    title: 'Spa Director & Massage Therapist',
    facilityName: 'Cape Town Luxury Spa & Wellness',
    specialty: 'Thai Massage & Aromatherapy',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp28',
    name: 'Hayden Rhodes',
    title: 'Wellness Coach',
    facilityName: 'Cape Town Wellness Retreat',
    specialty: 'Holistic Lifestyle & Mindset Coaching',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp29',
    name: 'Sarunya Samutsarun',
    title: 'Wellness Chef',
    facilityName: 'Cape Town Wellness Cuisine Centre',
    specialty: 'Raw Food & Detox Cuisine',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp30',
    name: 'Khun Pit',
    title: 'Raw Food Specialist',
    facilityName: 'Cape Town Living Foods Kitchen',
    specialty: 'Raw Vegan Cuisine & Nutrition',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // YOGA & FITNESS INSTRUCTORS
  {
    id: 'cp31',
    name: 'Kim White',
    title: 'Yoga Instructor',
    facilityName: 'Cape Town Mind Body Studio',
    specialty: 'Mind Body Yoga & Meditation',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp32',
    name: 'Zara Ismail',
    title: 'Pilates Instructor',
    facilityName: 'Cape Town Pilates Centre',
    specialty: 'Clinical Pilates & Rehabilitation',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp33',
    name: 'Lungile Nkosi',
    title: 'Personal Trainer',
    facilityName: 'Cape Town Fitness Academy',
    specialty: 'Strength Training & Conditioning',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp34',
    name: 'Andre van der Merwe',
    title: 'CrossFit Coach',
    facilityName: 'Cape Town CrossFit Box',
    specialty: 'Functional Fitness & Competition Training',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // BEAUTY & AESTHETIC SPECIALISTS
  {
    id: 'cp35',
    name: 'Dr. Natasha Govender',
    title: 'Aesthetic Physician',
    facilityName: 'Cape Town Aesthetic Medicine Clinic',
    specialty: 'Botox, Fillers & Skin Rejuvenation',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp36',
    name: 'Dr. Leila Hassan',
    title: 'Plastic Surgeon',
    facilityName: 'Cape Town Plastic Surgery Centre',
    specialty: 'Cosmetic & Reconstructive Surgery',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp37',
    name: 'Dr. Johan Kruger',
    title: 'Dental Surgeon',
    facilityName: 'Cape Town Dental Implant Centre',
    specialty: 'Dental Implants & Cosmetic Dentistry',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // RADIOLOGY & DIAGNOSTIC SERVICES
  {
    id: 'cp38',
    name: 'Dr. Thabo Mokoena',
    title: 'Radiologist',
    facilityName: 'Cape Town Radiology Institute',
    specialty: 'Diagnostic Imaging & Interventional Radiology',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp39',
    name: 'Dr. Ayesha Khan',
    title: 'Nuclear Medicine Specialist',
    facilityName: 'Cape Town Nuclear Medicine Centre',
    specialty: 'PET Scans & Nuclear Imaging',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp40',
    name: 'Dr. Pieter van der Walt',
    title: 'Pathologist',
    facilityName: 'Cape Town Pathology Laboratory',
    specialty: 'Clinical Pathology & Laboratory Medicine',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // SPECIALIZED MEDICAL SERVICES
  {
    id: 'cp41',
    name: 'Dr. Nomsa Molefe',
    title: 'Emergency Medicine Specialist',
    facilityName: 'Cape Town Emergency Medical Centre',
    specialty: 'Emergency Medicine & Trauma Care',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp42',
    name: 'Dr. Rajesh Patel',
    title: 'Intensivist',
    facilityName: 'Cape Town Intensive Care Unit',
    specialty: 'Critical Care Medicine',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp43',
    name: 'Dr. Sarah van der Berg',
    title: 'Palliative Care Specialist',
    facilityName: 'Cape Town Palliative Care Centre',
    specialty: 'End-of-Life Care & Pain Management',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // AQUATIC & ALTERNATIVE THERAPY
  {
    id: 'cp44',
    name: 'Dr. Themba Dlamini',
    title: 'Aquatic Therapy Specialist',
    facilityName: 'Cape Town Aquatic Therapy Centre',
    specialty: 'Water-Based Rehabilitation & Exercise',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp45',
    name: 'Dr. Emma Jacobs',
    title: 'Acupuncture Specialist',
    facilityName: 'Cape Town Traditional Chinese Medicine Centre',
    specialty: 'Acupuncture & Traditional Chinese Medicine',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp46',
    name: 'Dr. Sipho Nkosi',
    title: 'Homeopathic Physician',
    facilityName: 'Cape Town Homeopathic Clinic',
    specialty: 'Homeopathic Medicine & Natural Remedies',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // RESEARCH & ACADEMIC MEDICINE
  {
    id: 'cp47',
    name: 'Dr. Lindiwe Khumalo',
    title: 'Medical Researcher',
    facilityName: 'Cape Town Medical Research Institute',
    specialty: 'Clinical Trials & Medical Research',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp48',
    name: 'Dr. David Williams',
    title: 'Medical Educator',
    facilityName: 'University of Cape Town Medical School',
    specialty: 'Medical Education & Training',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp49',
    name: 'Dr. Fatima Abrahams',
    title: 'Public Health Specialist',
    facilityName: 'Cape Town Public Health Institute',
    specialty: 'Public Health & Epidemiology',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp50',
    name: 'Dr. Andre van Rensburg',
    title: 'Healthcare Administrator',
    facilityName: 'Cape Town Healthcare Management Group',
    specialty: 'Healthcare Administration & Policy',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // ADDITIONAL WELLNESS PRACTITIONERS
  {
    id: 'cp51',
    name: 'Dr. Zanele Dlamini',
    title: 'Somatologist',
    facilityName: 'Cape Town Beauty & Wellness Institute',
    specialty: 'Somatology & Advanced Skin Treatments',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp52',
    name: 'Coach Themba Maseko',
    title: 'Life Coach & Wellness Consultant',
    facilityName: 'Cape Town Life Transformation Centre',
    specialty: 'Life Coaching & Personal Development',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp53',
    name: 'Dr. Sipho Ndlovu',
    title: 'Chiropractor',
    facilityName: 'Cape Town Chiropractic & Wellness Clinic',
    specialty: 'Chiropractic Care & Spinal Health',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp54',
    name: 'Dr. Nomvula Khumalo',
    title: 'Reflexologist',
    facilityName: 'Cape Town Reflexology & Healing Centre',
    specialty: 'Reflexology & Pressure Point Therapy',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp55',
    name: 'Dr. Aisha Patel',
    title: 'Aesthetics Specialist',
    facilityName: 'Cape Town Aesthetics & Beauty Clinic',
    specialty: 'Aesthetic Medicine & Beauty Treatments',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp56',
    name: 'Dr. Thabo Molefe',
    title: 'Reiki Master',
    facilityName: 'Cape Town Energy Healing Centre',
    specialty: 'Reiki Healing & Energy Work',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp57',
    name: 'Dr. Lerato Mokoena',
    title: 'Quantum Healing Practitioner',
    facilityName: 'Cape Town Quantum Wellness Institute',
    specialty: 'Quantum Healing & Consciousness Work',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp58',
    name: 'Dr. Zinhle Zulu',
    title: 'Mind Body Yoga Instructor',
    facilityName: 'Cape Town Mind Body Wellness Studio',
    specialty: 'Mind Body Yoga & Holistic Wellness',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp59',
    name: 'Dr. Wei Chen',
    title: 'Acupuncture Specialist',
    facilityName: 'Cape Town Traditional Chinese Medicine Centre',
    specialty: 'Acupuncture & Traditional Chinese Medicine',
    city: 'Cape Town',
    province: 'Western Cape'
  },

  // HOSPITAL-BASED PROFESSIONALS
  {
    id: 'cp60',
    name: 'Dr. Lerato Nkosi',
    title: 'Social Worker',
    facilityName: 'Cape Town General Hospital',
    specialty: 'Medical Social Work & Patient Advocacy',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp61',
    name: 'Dr. Fatima Osman',
    title: 'Chemical Pathologist',
    facilityName: 'Cape Town Pathology Laboratory',
    specialty: 'Chemical Pathology & Biochemical Analysis',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp62',
    name: 'Dr. James Botha',
    title: 'Social Worker',
    facilityName: 'Cape Town Children\'s Hospital',
    specialty: 'Pediatric Social Work & Family Support',
    city: 'Cape Town',
    province: 'Western Cape'
  },
  {
    id: 'cp63',
    name: 'Dr. Sipho Mthembu',
    title: 'Social Worker',
    facilityName: 'Cape Town Mental Health Institute',
    specialty: 'Mental Health Social Work & Crisis Intervention',
    city: 'Cape Town',
    province: 'Western Cape'
  }
];

// Helper function to get healthcare professionals by specialty
export const getHealthcareProfessionalsBySpecialty = (specialty?: string) => {
  if (!specialty) return comprehensiveHealthcareProfessionals;
  return comprehensiveHealthcareProfessionals.filter(prof => 
    prof.specialty.toLowerCase().includes(specialty.toLowerCase()) ||
    prof.title.toLowerCase().includes(specialty.toLowerCase())
  );
};

// Helper function to get healthcare professionals by facility type
export const getHealthcareProfessionalsByFacilityType = (facilityType: 'hospital' | 'clinic' | 'spa' | 'wellness') => {
  const facilityKeywords = {
    hospital: ['hospital', 'institute', 'unit', 'centre'],
    clinic: ['clinic', 'medical centre'],
    spa: ['spa', 'beauty'],
    wellness: ['wellness', 'retreat', 'studio', 'academy']
  };
  
  return comprehensiveHealthcareProfessionals.filter(prof => 
    facilityKeywords[facilityType].some(keyword => 
      prof.facilityName.toLowerCase().includes(keyword)
    )
  );
};

// Helper function to get healthcare professionals by city
export const getHealthcareProfessionalsByCity = (city: string) => {
  return comprehensiveHealthcareProfessionals.filter(prof => 
    prof.city.toLowerCase() === city.toLowerCase()
  );
};
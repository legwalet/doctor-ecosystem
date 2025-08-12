import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheck, FiUser, FiHome, FiCamera, FiBriefcase, FiHeart, FiActivity } from 'react-icons/fi';
import useStore from '../../store/useStore';

// Icon components with proper typing  
const ArrowLeftIcon = FiArrowLeft as React.ComponentType<{ className?: string; [key: string]: any }>;
const ArrowRightIcon = FiArrowRight as React.ComponentType<{ className?: string; [key: string]: any }>;
const CheckIcon = FiCheck as React.ComponentType<{ className?: string; size?: number; [key: string]: any }>;
const UserIcon = FiUser as React.ComponentType<{ className?: string; size?: number; [key: string]: any }>;
const HomeIcon = FiHome as React.ComponentType<{ className?: string; size?: number; [key: string]: any }>;
const CameraIcon = FiCamera as React.ComponentType<{ className?: string; size?: number; [key: string]: any }>;
const BriefcaseIcon = FiBriefcase as React.ComponentType<{ className?: string; size?: number; [key: string]: any }>;
const HeartIcon = FiHeart as React.ComponentType<{ className?: string; size?: number; [key: string]: any }>;
const ActivityIcon = FiActivity as React.ComponentType<{ className?: string; size?: number; [key: string]: any }>;

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  professionType: 'hospital' | 'wellness';
  specialization: string;
  experience: number;
  location: string;
  hospitalCompanyId: string;
  department: string;
  clinicName: string;
  clinicAddress: string;
  clinicContact: string;
  profilePicture: string;
  coordinates: [number, number];
  
  // Hospital-specific fields
  medicalLicense: string;
  boardCertification: string;
  hospitalAffiliations: string[];
  insuranceAccepted: string[];
  
  // Wellness-specific fields
  wellnessCategory: string;
  certifications: string[];
  services: string[];
  consultationFee: string;
  workingHours: string;
  languages: string[];
  description: string;
}

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    professionType: 'hospital',
    specialization: '',
    experience: 0,
    location: '',
    hospitalCompanyId: '',
    department: '',
    clinicName: '',
    clinicAddress: '',
    clinicContact: '',
    profilePicture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    coordinates: [40.7128, -74.0060], // Default to NYC
    
    // Hospital-specific fields
    medicalLicense: '',
    boardCertification: '',
    hospitalAffiliations: [],
    insuranceAccepted: [],
    
    // Wellness-specific fields
    wellnessCategory: '',
    certifications: [],
    services: [],
    consultationFee: '',
    workingHours: '',
    languages: [],
    description: ''
  });

  const { register } = useStore();
  const navigate = useNavigate();

  // Profession-specific data
  const hospitalSpecializations = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology',
    'Psychiatry', 'General Medicine', 'Surgery', 'Radiology', 'Anesthesiology',
    'Emergency Medicine', 'Oncology', 'Gynecology', 'Urology', 'Ophthalmology',
    'ENT', 'Pulmonology', 'Gastroenterology', 'Endocrinology', 'Rheumatology'
  ];

  const wellnessCategories = [
    'nutrition', 'therapy', 'fitness', 'spa', 'wellness', 'spiritual',
    'somatology', 'life-coaching', 'chiropractic', 'reflexology', 'aesthetics',
    'reiki', 'quantum-healing', 'mind-body-yoga', 'acupuncture'
  ];

  const wellnessServices = [
    'Nutritional Counseling', 'Massage Therapy', 'Yoga Instruction', 'Meditation',
    'Life Coaching', 'Chiropractic Care', 'Reflexology', 'Aesthetic Treatments',
    'Energy Healing', 'Acupuncture', 'Herbal Medicine', 'Holistic Wellness',
    'Stress Management', 'Weight Management', 'Detox Programs', 'Mindfulness Training'
  ];

  const locations = [
    'Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth',
    'Bloemfontein', 'East London', 'Pietermaritzburg', 'Kimberley', 'Nelspruit'
  ];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTotalSteps = () => {
    return formData.professionType === 'hospital' ? 7 : 8;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Remove password fields from professional data
      const { password, confirmPassword, ...professionalData } = formData;
      const success = await register({ ...professionalData, password });
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword && formData.password.length >= 6;
      case 2:
        return formData.professionType;
      case 3:
        return formData.specialization && formData.experience > 0 && formData.location;
      case 4:
        if (formData.professionType === 'hospital') {
          return formData.hospitalCompanyId && formData.department && formData.medicalLicense;
        } else {
          return formData.wellnessCategory && formData.services.length > 0 && formData.consultationFee;
        }
      case 5:
        if (formData.professionType === 'hospital') {
          return formData.clinicName && formData.clinicAddress && formData.clinicContact;
        } else {
          return formData.clinicName && formData.clinicAddress && formData.clinicContact;
        }
      case 6:
        if (formData.professionType === 'hospital') {
          return formData.profilePicture;
        } else {
          return formData.certifications.length > 0 && formData.workingHours && formData.description;
        }
      case 7:
        if (formData.professionType === 'hospital') {
          return true; // Confirmation step
        } else {
          return formData.profilePicture;
        }
      case 8:
        return true; // Confirmation step for wellness
      default:
        return false;
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const getStepTitle = (step: number) => {
    if (formData.professionType === 'hospital') {
      switch (step) {
        case 1: return 'Account Info';
        case 2: return 'Profession Type';
        case 3: return 'Medical Info';
        case 4: return 'Hospital Info';
        case 5: return 'Clinic Info';
        case 6: return 'Profile Picture';
        case 7: return 'Confirmation';
        default: return '';
      }
    } else {
      switch (step) {
        case 1: return 'Account Info';
        case 2: return 'Profession Type';
        case 3: return 'Wellness Info';
        case 4: return 'Services Info';
        case 5: return 'Clinic Info';
        case 6: return 'Certifications';
        case 7: return 'Profile Picture';
        case 8: return 'Confirmation';
        default: return '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Join Healthcare Ecosystem</h2>
          <p className="mt-2 text-sm text-gray-600">Create your professional account</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-medical-primary h-2 rounded-full"
            initial={{ width: "16.67%" }}
            animate={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {Array.from({ length: getTotalSteps() }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-medical-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step < currentStep ? <CheckIcon /> : step}
              </div>
              <div className="text-xs mt-2 text-gray-500 text-center">
                {getStepTitle(step)}
              </div>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="card min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <UserIcon className="text-medical-primary mr-3" size={24} />
                  <h3 className="text-xl font-semibold">Account Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Dr. John Doe"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="doctor@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Profession Type Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <BriefcaseIcon className="text-medical-primary mr-3" size={24} />
                  <h3 className="text-xl font-semibold">Select Your Profession Type</h3>
                </div>

                <div className="space-y-4">
                  <div className="text-center text-gray-600 mb-6">
                    <p>Choose the category that best describes your professional role</p>
                  </div>

                  {/* Hospital Professional Option */}
                  <div 
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.professionType === 'hospital' 
                        ? 'border-medical-primary bg-medical-light' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData('professionType', 'hospital')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🏥</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">Hospital & Medical Professional</h4>
                        <p className="text-gray-600">Medical doctors, specialists, surgeons, nurses, and allied health professionals working in hospitals, clinics, and medical facilities.</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="font-medium">Includes:</span> Cardiologists, Neurologists, Pediatricians, Surgeons, Radiologists, Pathologists, Social Workers, Occupational Therapists
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wellness Professional Option */}
                  <div 
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.professionType === 'wellness' 
                        ? 'border-medical-primary bg-medical-light' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData('professionType', 'wellness')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🌿</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">Wellness & Alternative Therapy Professional</h4>
                        <p className="text-gray-600">Wellness practitioners, alternative therapists, and holistic health professionals providing complementary and integrative health services.</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="font-medium">Includes:</span> Life Coaches, Chiropractors, Reflexologists, Aesthetics Specialists, Reiki Masters, Acupuncturists, Yoga Instructors
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Professional Information */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <ActivityIcon className="text-medical-primary mr-3" size={24} />
                  <h3 className="text-xl font-semibold">
                    {formData.professionType === 'hospital' ? 'Medical' : 'Wellness'} Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.professionType === 'hospital' ? 'Medical Specialization' : 'Wellness Category'}
                    </label>
                    <select
                      className="input-field"
                      value={formData.specialization}
                      onChange={(e) => updateFormData('specialization', e.target.value)}
                    >
                      <option value="">Select {formData.professionType === 'hospital' ? 'Specialization' : 'Category'}</option>
                      {(formData.professionType === 'hospital' ? hospitalSpecializations : wellnessCategories).map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="5"
                      min="0"
                      max="50"
                      value={formData.experience}
                      onChange={(e) => updateFormData('experience', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <select
                      className="input-field"
                      value={formData.location}
                      onChange={(e) => updateFormData('location', e.target.value)}
                    >
                      <option value="">Select Location</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Profession-Specific Information */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {formData.professionType === 'hospital' ? (
                  // Hospital-specific fields
                  <div>
                    <div className="flex items-center mb-6">
                      <BriefcaseIcon className="text-medical-primary mr-3" size={24} />
                      <h3 className="text-xl font-semibold">Hospital & Medical Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medical License Number
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="MP123456"
                          value={formData.medicalLicense}
                          onChange={(e) => updateFormData('medicalLicense', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Board Certification
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g., American Board of Internal Medicine"
                          value={formData.boardCertification}
                          onChange={(e) => updateFormData('boardCertification', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hospital/Company ID
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="HOSP001"
                          value={formData.hospitalCompanyId}
                          onChange={(e) => updateFormData('hospitalCompanyId', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Cardiology"
                          value={formData.department}
                          onChange={(e) => updateFormData('department', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Wellness-specific fields
                  <div>
                    <div className="flex items-center mb-6">
                      <HeartIcon className="text-medical-primary mr-3" size={24} />
                      <h3 className="text-xl font-semibold">Wellness Services Information</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Wellness Category
                        </label>
                        <select
                          className="input-field"
                          value={formData.wellnessCategory}
                          onChange={(e) => updateFormData('wellnessCategory', e.target.value)}
                        >
                          <option value="">Select Category</option>
                          {wellnessCategories.map((category) => (
                            <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Services Offered
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {wellnessServices.map((service) => (
                            <label key={service} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.services.includes(service)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateFormData('services', [...formData.services, service]);
                                  } else {
                                    updateFormData('services', formData.services.filter(s => s !== service));
                                  }
                                }}
                                className="rounded border-gray-300 text-medical-primary focus:ring-medical-primary"
                              />
                              <span className="text-sm text-gray-700">{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Consultation Fee
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="R500 per session"
                          value={formData.consultationFee}
                          onChange={(e) => updateFormData('consultationFee', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Clinic Information */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <HomeIcon className="text-medical-primary mr-3" size={24} />
                  <h3 className="text-xl font-semibold">Clinic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic/Facility Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Cape Town Medical Centre"
                      value={formData.clinicName}
                      onChange={(e) => updateFormData('clinicName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="+27 21 555 0123"
                      value={formData.clinicContact}
                      onChange={(e) => updateFormData('clinicContact', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="123 Main Street, Cape Town, Western Cape, 8001"
                      value={formData.clinicAddress}
                      onChange={(e) => updateFormData('clinicAddress', e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Additional Information */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {formData.professionType === 'hospital' ? (
                  // Hospital: Profile Picture
                  <div>
                    <div className="flex items-center mb-6">
                      <CameraIcon className="text-medical-primary mr-3" size={24} />
                      <h3 className="text-xl font-semibold">Profile Picture</h3>
                    </div>

                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-200">
                        <img
                          src={formData.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Profile picture URL"
                        value={formData.profilePicture}
                        onChange={(e) => updateFormData('profilePicture', e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  // Wellness: Certifications and Details
                  <div>
                    <div className="flex items-center mb-6">
                      <HeartIcon className="text-medical-primary mr-3" size={24} />
                      <h3 className="text-xl font-semibold">Certifications & Details</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certifications
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g., Reiki Master, Yoga Alliance 200hr, Life Coach Certification"
                          value={formData.certifications.join(', ')}
                          onChange={(e) => updateFormData('certifications', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Working Hours
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g., Mon-Fri 9AM-6PM, Sat 9AM-2PM"
                          value={formData.workingHours}
                          onChange={(e) => updateFormData('workingHours', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Languages Spoken
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g., English, Afrikaans, Xhosa"
                          value={formData.languages.join(', ')}
                          onChange={(e) => updateFormData('languages', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Professional Description
                        </label>
                        <textarea
                          className="input-field"
                          rows={4}
                          placeholder="Describe your approach, philosophy, and what makes you unique..."
                          value={formData.description}
                          onChange={(e) => updateFormData('description', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 7: Profile Picture for Wellness or Confirmation for Hospital */}
            {currentStep === 7 && (
              <motion.div
                key="step7"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {formData.professionType === 'hospital' ? (
                  // Hospital: Confirmation
                  <div>
                    <div className="flex items-center mb-6">
                      <CheckIcon className="text-medical-primary mr-3" size={24} />
                      <h3 className="text-xl font-semibold">Review & Confirm</h3>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Name:</span>
                          <p className="text-gray-900">{formData.name}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Email:</span>
                          <p className="text-gray-900">{formData.email}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Specialization:</span>
                          <p className="text-gray-900">{formData.specialization}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Experience:</span>
                          <p className="text-gray-900">{formData.experience} years</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Location:</span>
                          <p className="text-gray-900">{formData.location}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Medical License:</span>
                          <p className="text-gray-900">{formData.medicalLicense}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Department:</span>
                          <p className="text-gray-900">{formData.department}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Clinic:</span>
                          <p className="text-gray-900">{formData.clinicName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Wellness: Profile Picture
                  <div>
                    <div className="flex items-center mb-6">
                      <CameraIcon className="text-medical-primary mr-3" size={24} />
                      <h3 className="text-xl font-semibold">Profile Picture</h3>
                    </div>

                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-200">
                        <img
                          src={formData.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Profile picture URL"
                        value={formData.profilePicture}
                        onChange={(e) => updateFormData('profilePicture', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 8: Confirmation for Wellness */}
            {currentStep === 8 && formData.professionType === 'wellness' && (
              <motion.div
                key="step8"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <CheckIcon className="text-medical-primary mr-3" size={24} />
                  <h3 className="text-xl font-semibold">Review & Confirm</h3>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-900">{formData.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-900">{formData.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <p className="text-gray-900">{formData.wellnessCategory}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Experience:</span>
                      <p className="text-gray-900">{formData.experience} years</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <p className="text-gray-900">{formData.location}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Services:</span>
                      <p className="text-gray-900">{formData.services.join(', ')}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Consultation Fee:</span>
                      <p className="text-gray-900">{formData.consultationFee}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Clinic:</span>
                      <p className="text-gray-900">{formData.clinicName}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
              }`}
            >
              <ArrowLeftIcon />
              <span>Previous</span>
            </button>

            {currentStep < getTotalSteps() ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isStepValid()
                    ? 'bg-medical-primary text-white hover:bg-blue-700 hover:shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ArrowRightIcon />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isStepValid()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  loading || !isStepValid()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-medical-primary hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
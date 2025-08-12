import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import useStore from '../store/useStore';
import { getHospitalGroupedDoctors, mockWellnessProfessionals, comprehensiveHealthcareProfessionals, getHealthcareProfessionalsByFacilityType } from '../data/mockData';

// Fix Leaflet default icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Enhanced Icons with better visual feedback
const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const NetworkIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const StarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface DoctorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
}

const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({ isOpen, onClose, doctorId }) => {
  const { doctors, getPatientsByDoctor, getConsultationsByDoctor } = useStore();
  
  if (!isOpen) return null;

  const doctor = doctors.find(d => d.id === doctorId);
  
  if (!doctor) return null;

  const doctorPatients = getPatientsByDoctor(doctorId);
  const doctorConsultations = getConsultationsByDoctor(doctorId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-medical-primary">
            {doctor.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={doctor.profilePicture}
                alt={doctor.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-medical-light"
              />
              <div>
                <h4 className="text-lg font-semibold text-medical-primary">{doctor.specialization}</h4>
                <p className="text-medical-gray">{doctor.experience} years experience</p>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`w-4 h-4 ${i < Math.min(doctor.experience / 2, 5) ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <LocationIcon />
                <div>
                  <p className="font-medium text-sm">{doctor.clinicName}</p>
                  <p className="text-sm text-medical-gray">{doctor.clinicAddress}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <PhoneIcon />
                <div>
                  <p className="font-medium text-sm">Contact</p>
                  <p className="text-sm text-medical-gray">{doctor.clinicContact}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <EmailIcon />
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-sm text-medical-gray">{doctor.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-medical-light p-4 rounded-lg">
              <h4 className="font-semibold text-medical-primary mb-2">Practice Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Location:</span> {doctor.location}</p>
                <p><span className="font-medium">Registration:</span> {new Date(doctor.registrationDate).toLocaleDateString()}</p>
                {doctor.workingDays && (
                  <p><span className="font-medium">Working Days:</span> {doctor.workingDays.join(', ')}</p>
                )}
                {doctor.workingHours && (
                  <p><span className="font-medium">Hours:</span> {doctor.workingHours}</p>
                )}
                {doctor.monthlyPatients && (
                  <p><span className="font-medium">Monthly Patients:</span> ~{doctor.monthlyPatients}</p>
                )}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => window.open(`mailto:${doctor.email}`, '_blank')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                >
                  Send Email
                </button>
                <button
                  onClick={() => window.open(`tel:${doctor.clinicContact}`, '_blank')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  Call Clinic
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-medical-primary mb-3">Recent Activity</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-medical-primary">{doctorPatients.length} Patients</p>
              <p className="text-xs text-medical-gray">Under care</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-medical-primary">{doctorConsultations.length} Consultations</p>
              <p className="text-xs text-medical-gray">Total sessions</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Enhanced medical icon creation with better visual feedback
const createMedicalIcon = (specialization: string) => {
  const getSpecializationColor = (specialization: string) => {
    const colors: { [key: string]: string } = {
      'Cardiology': '#ef4444',
      'Neurology': '#8b5cf6',
      'Pediatrics': '#06b6d4', 
      'Orthopedics': '#f59e0b',
      'General Practice': '#10b981',
      'Dermatology': '#ec4899',
      'Psychiatry': '#a855f7',
      'Ophthalmology': '#06b6d4',
      'Endocrinology': '#f97316',
      'Emergency Medicine': '#dc2626'
    };
    return colors[specialization] || '#6b7280';
  };

  return L.divIcon({
    html: `
      <div class="medical-marker" style="
        background: ${getSpecializationColor(specialization)};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      " onmouseover="this.style.transform='scale(1.2)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)'">
        ${specialization.charAt(0)}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createWellnessIcon = (category: string) => {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'nutrition': '#10b981',      // Green
      'therapy': '#3b82f6',        // Blue
      'fitness': '#8b5cf6',        // Purple
      'spa': '#ec4899',            // Pink
      'wellness': '#059669',       // Emerald
      'spiritual': '#7c3aed'       // Indigo
    };
    return colors[category] || '#6b7280';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'nutrition': '🥗',
      'therapy': '💆',
      'fitness': '🧘',
      'spa': '💆‍♀️',
      'wellness': '🌿',
      'spiritual': '✨'
    };
    return icons[category] || '🌿';
  };

  return L.divIcon({
    html: `
      <div class="wellness-marker" style="
        background: ${getCategoryColor(category)};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      " onmouseover="this.style.transform='scale(1.2)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)'">
        ${getCategoryIcon(category)}
      </div>
    `,
    className: 'custom-marker wellness',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

// Enhanced Map View with better interactions
const MapView: React.FC<{ 
  doctors: any[]; 
  wellnessProfessionals: any[];
  onDoctorClick: (doctorId: string) => void;
  onWellnessClick: (wellnessId: string) => void;
}> = ({ doctors, wellnessProfessionals, onDoctorClick, onWellnessClick }) => {
  // Cape Town center coordinates
  const capeTownCenter: [number, number] = [-33.9249, 18.4241];
  
  // Specialization colors for legend
  const getSpecializationColor = (specialization: string) => {
    const colors: { [key: string]: string } = {
      'Cardiology': '#ef4444',
      'Neurology': '#8b5cf6',
      'Pediatrics': '#06b6d4', 
      'Orthopedics': '#f59e0b',
      'General Practice': '#10b981',
      'Dermatology': '#ec4899',
      'Psychiatry': '#a855f7',
      'Ophthalmology': '#06b6d4',
      'Endocrinology': '#f97316',
      'Emergency Medicine': '#dc2626'
    };
    return colors[specialization] || '#6b7280';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="mb-4">
          <h3 className="text-xl font-semibold text-medical-primary mb-2">Cape Town IHCE Network Map</h3>
          

          
          <div className="bg-medical-light p-3 rounded-lg border border-medical-primary border-opacity-30">
            <p className="text-sm text-medical-primary font-medium mb-1">
              🗺️ Interactive Map Guide
            </p>
            <p className="text-xs text-medical-gray">
              📍 {doctors.length} doctors + {wellnessProfessionals.length} wellness professionals available • Click markers for details • Zoom & pan enabled • Hover over legend items
            </p>
          </div>
        </div>
      
      <div className="relative overflow-hidden rounded-lg border border-gray-200" style={{ height: '500px' }}>
        <MapContainer
          center={capeTownCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="leaflet-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Medical Doctors Markers */}
          {doctors.map((doctor, index) => {
            const position: [number, number] = [doctor.coordinates[0], doctor.coordinates[1]];
            
            // Validate coordinates
            if (!position[0] || !position[1] || isNaN(position[0]) || isNaN(position[1])) {
              console.error(`❌ Invalid coordinates for ${doctor.name}:`, position);
              return null;
            }
            
            return (
              <Marker
                key={doctor.id}
                position={position}
                icon={createMedicalIcon(doctor.specialization)}
                eventHandlers={{
                  click: () => {
                    onDoctorClick(doctor.id);
                  }
                }}
              >
                <Popup>
                  <div className="p-2 min-w-max">
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src={doctor.profilePicture}
                        alt={doctor.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-medical-light"
                      />
                      <div>
                        <h4 className="font-semibold text-medical-primary">{doctor.name}</h4>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      <p><span className="font-medium">Clinic:</span> {doctor.clinicName}</p>
                      <p><span className="font-medium">Experience:</span> {doctor.experience} years</p>
                      <p><span className="font-medium">Phone:</span> {doctor.clinicContact}</p>
                      <p><span className="font-medium">Location:</span> {doctor.clinicAddress}</p>
                    </div>
                    
                    <button
                      onClick={() => onDoctorClick(doctor.id)}
                      className="w-full px-3 py-2 bg-medical-primary text-white rounded-md text-sm hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      View Full Profile
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          {/* Wellness Professionals Markers */}
          {wellnessProfessionals.map((professional, index) => {
            const position: [number, number] = [professional.coordinates[0], professional.coordinates[1]];
            
            // Validate coordinates
            if (!position[0] || !position[1] || isNaN(position[0]) || isNaN(position[1])) {
              console.error(`❌ Invalid coordinates for ${professional.name}:`, position);
              return null;
            }
            
            return (
              <Marker
                key={professional.id}
                position={position}
                icon={createWellnessIcon(professional.category)}
                eventHandlers={{
                  click: () => {
                    onWellnessClick(professional.id);
                  }
                }}
              >
                <Popup>
                  <div className="p-2 min-w-max">
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src={professional.profilePicture}
                        alt={professional.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-medical-light"
                      />
                      <div>
                        <h4 className="font-semibold text-medical-primary">{professional.name}</h4>
                        <p className="text-sm text-gray-600">{professional.specialization}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          professional.category === 'nutrition' ? 'bg-green-100 text-green-800' :
                          professional.category === 'therapy' ? 'bg-blue-100 text-blue-800' :
                          professional.category === 'fitness' ? 'bg-purple-100 text-purple-800' :
                          professional.category === 'spa' ? 'bg-pink-100 text-pink-800' :
                          professional.category === 'wellness' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {professional.category.charAt(0).toUpperCase() + professional.category.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      <p><span className="font-medium">Facility:</span> {professional.facilityName}</p>
                      <p><span className="font-medium">Experience:</span> {professional.experience} years</p>
                      <p><span className="font-medium">Phone:</span> {professional.contactNumber}</p>
                      <p><span className="font-medium">Location:</span> {professional.location}</p>
                    </div>
                    
                    <button
                      onClick={() => onWellnessClick(professional.id)}
                      className="w-full px-3 py-2 bg-medical-accent text-white rounded-md text-sm hover:bg-green-600 transition-colors duration-200 font-medium"
                    >
                      View Wellness Profile
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        
        {/* Enhanced Map overlay info */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-95 p-4 rounded-lg shadow-xl text-xs text-medical-gray z-[1000] backdrop-blur-sm border border-gray-200 hover:shadow-2xl transition-all duration-300 cursor-pointer group map-overlay">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">🗺️</span>
            <p className="font-semibold text-medical-primary">Interactive Map</p>
          </div>
          <div className="space-y-1 text-gray-600">
            <p className="flex items-center space-x-1">
              <span className="text-blue-500">🔍</span>
              <span>Zoom with mouse wheel</span>
            </p>
            <p className="flex items-center space-x-1">
              <span className="text-green-500">✋</span>
              <span>Click & drag to pan</span>
            </p>
            <p className="flex items-center space-x-1">
              <span className="text-purple-500">👆</span>
              <span>Click markers for details</span>
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-medical-primary font-medium group-hover:text-blue-600 transition-colors duration-200">
              💡 Hover over legend items above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const NetworkTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'hospitals' | 'wellness'>('grid');
  const [wellnessCategoryFilter, setWellnessCategoryFilter] = useState<string>('all');
  
  const { doctors, currentUser } = useStore();
  const hospitalGroups = getHospitalGroupedDoctors();
  
  // Filter out current user from the network
  const networkDoctors = doctors.filter(doctor => doctor.id !== currentUser?.id);
  
  // Get unique specializations for filter
  const specializations = Array.from(new Set(networkDoctors.map(d => d.specialization)));
  
  // Filter doctors based on search and specialization
  const filteredDoctors = networkDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.clinicName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = specializationFilter === 'all' || 
                                 doctor.specialization === specializationFilter;
    
    return matchesSearch && matchesSpecialization;
  });
  
  // Filter wellness professionals based on category and search
  const filteredWellnessProfessionals = mockWellnessProfessionals.filter(professional => {
    const matchesCategory = wellnessCategoryFilter === 'all' || professional.category === wellnessCategoryFilter;
    const matchesSearch = searchTerm === '' || 
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
      professional.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });
  
  // Get comprehensive wellness categories including all practitioner types
  const wellnessCategories = [
    'all',
    'nutrition',
    'therapy', 
    'fitness',
    'spa',
    'wellness',
    'spiritual',
    'somatology',
    'life-coaching',
    'chiropractic',
    'reflexology',
    'aesthetics',
    'reiki',
    'quantum-healing',
    'mind-body-yoga',
    'acupuncture'
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-medical-primary">IHCE Network - Cape Town</h2>
          <p className="text-lg text-medical-accent">Integrated Health Care Ecosystem</p>
          <p className="text-medical-gray">Connect with healthcare professionals in your area</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-medical-gray bg-medical-light px-3 py-2 rounded-lg">
            <NetworkIcon />
            <span className="font-medium">
              {viewMode === 'wellness' 
                ? `${filteredWellnessProfessionals.length} wellness professionals available`
                : `${filteredDoctors.length} doctors available`
              }
            </span>
          </div>
          
          {/* Enhanced View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium view-toggle ${
                viewMode === 'grid'
                  ? 'bg-white text-medical-primary shadow-md transform scale-105 ring-2 ring-medical-primary ring-opacity-30 active'
                  : 'text-medical-gray hover:text-medical-primary hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <GridIcon />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium view-toggle ${
                viewMode === 'map'
                  ? 'bg-white text-medical-primary shadow-md transform scale-105 ring-2 ring-medical-primary ring-opacity-30 active'
                  : 'text-medical-gray hover:text-medical-primary hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <MapIcon />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('hospitals')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium view-toggle ${
                viewMode === 'hospitals'
                  ? 'bg-white text-medical-primary shadow-md transform scale-105 ring-2 ring-medical-primary ring-opacity-30 active'
                  : 'text-medical-gray hover:text-medical-primary hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              🏥
              <span>Hospitals</span>
            </button>
            <button
              onClick={() => setViewMode('wellness')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium view-toggle ${
                viewMode === 'wellness'
                  ? 'bg-white text-medical-primary shadow-md transform scale-105 ring-2 ring-medical-primary ring-opacity-30 active'
                  : 'text-medical-gray hover:text-medical-primary hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              🌿
              <span>Wellness & Spa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group search-container">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder={viewMode === 'wellness' 
              ? "Search wellness professionals by name, specialization, or services..." 
              : "Search doctors by name, specialization, or clinic..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent transition-all duration-200 hover:border-gray-400 hover:shadow-sm focus:shadow-md interactive-input"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full border">
              {filteredDoctors.length} results
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FilterIcon />
          </div>
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent bg-white min-w-[180px] transition-all duration-200 hover:border-gray-400 hover:shadow-sm cursor-pointer group-hover:border-medical-primary"
          >
            <option value="all">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400 group-hover:text-medical-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Enhanced Specialization Filter Chips - Only show for doctor views */}
      {viewMode !== 'wellness' && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSpecializationFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium specialization-filter ${
              specializationFilter === 'all'
                ? 'bg-medical-primary text-white shadow-lg ring-2 ring-medical-primary ring-opacity-50 active'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md hover:text-gray-800'
            }`}
          >
            ✨ All Specializations
          </button>
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSpecializationFilter(spec)}
              className={`px-4 py-2 rounded-full text-sm font-medium specialization-filter ${
                specializationFilter === spec
                  ? 'bg-medical-primary text-white shadow-lg ring-2 ring-medical-primary ring-opacity-50 active'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md hover:text-gray-800'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      )}
      
      {/* Wellness Category Filters - Only visible for Grid, Map, and Wellness views (not Hospitals) */}
      {viewMode !== 'hospitals' && (
        <div className="flex flex-wrap gap-3">
          <h4 className="text-sm font-semibold text-medical-primary mr-2 self-center">🌿 Wellness Categories:</h4>
          <button
            onClick={() => setWellnessCategoryFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              wellnessCategoryFilter === 'all'
                ? 'bg-medical-accent text-white shadow-lg ring-2 ring-medical-accent ring-opacity-50'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md hover:text-gray-800'
            }`}
          >
            ✨ All Categories
          </button>
          {wellnessCategories.filter(cat => cat !== 'all').map((category) => (
            <button
              key={category}
              onClick={() => setWellnessCategoryFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                wellnessCategoryFilter === category
                  ? 'bg-medical-accent text-white shadow-lg ring-2 ring-medical-accent ring-opacity-50'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md hover:text-gray-800'
              }`}
            >
              {category === 'nutrition' && '🥗'}
              {category === 'therapy' && '💆'}
              {category === 'fitness' && '🧘'}
              {category === 'spa' && '💆‍♀️'}
              {category === 'wellness' && '🌿'}
              {category === 'spiritual' && '✨'}
              {category === 'somatology' && '💆‍♂️'}
              {category === 'life-coaching' && '🎯'}
              {category === 'chiropractic' && '🦴'}
              {category === 'reflexology' && '🦶'}
              {category === 'aesthetics' && '✨'}
              {category === 'reiki' && '🔮'}
              {category === 'quantum-healing' && '⚛️'}
              {category === 'mind-body-yoga' && '🧘‍♀️'}
              {category === 'acupuncture' && '🪡'}
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === 'grid' && (
        <>
          {/* Enhanced Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredDoctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-medical-primary transition-all duration-300 cursor-pointer group transform-gpu doctor-card"
                  onClick={() => setSelectedDoctorId(doctor.id)}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <img
                        src={doctor.profilePicture}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-medical-light group-hover:border-medical-primary group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-medical-accent rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform duration-200 border-2 border-white">
                        {doctor.experience}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-medical-primary group-hover:text-medical-secondary transition-colors duration-200">{doctor.name}</h3>
                      <p className="text-medical-gray">{doctor.specialization}</p>
                      <p className="text-sm text-medical-gray">{doctor.experience} years exp.</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-sm text-medical-gray">Clinic:</span>
                      <p className="font-medium text-sm">{doctor.clinicName}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-medical-gray">
                      <LocationIcon />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-medical-gray">
                      <PhoneIcon />
                      <span>{doctor.clinicContact}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoctorId(doctor.id);
                      }}
                      className="flex-1 bg-medical-primary text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium action-button-primary"
                    >
                      👁️ View Profile
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`mailto:${doctor.email}`, '_blank');
                      }}
                      className="px-4 py-2 bg-medical-accent text-white rounded-lg hover:bg-green-600 hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 group-hover:bg-green-500 action-button-secondary"
                      title="Send Email"
                    >
                      <EmailIcon />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredDoctors.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
            >
              <div className="mx-auto w-16 h-16 bg-medical-light rounded-full flex items-center justify-center mb-4">
                <NetworkIcon className="text-medical-primary" />
              </div>
              <h3 className="text-xl font-semibold text-medical-primary mb-2">No doctors found</h3>
              <p className="text-medical-gray text-lg mb-3">No doctors match your current search criteria.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  🔍 Clear Search
                </button>
                <button
                  onClick={() => setSpecializationFilter('all')}
                  className="px-4 py-2 bg-medical-accent text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
                >
                  🏥 Show All Specializations
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
      
      {/* Map View */}
      {viewMode === 'map' && (
        <MapView 
          doctors={filteredDoctors} 
          wellnessProfessionals={filteredWellnessProfessionals}
          onDoctorClick={setSelectedDoctorId}
          onWellnessClick={(wellnessId) => {
            // For now, we'll just show an alert. In the future, this could open a wellness professional modal
            const professional = mockWellnessProfessionals.find(wp => wp.id === wellnessId);
            if (professional) {
              alert(`Wellness Professional: ${professional.name}\nSpecialization: ${professional.specialization}\nContact: ${professional.contactNumber}\nEmail: ${professional.email}`);
            }
          }}
        />
      )}
      
      {/* Enhanced Hospital Groups View */}
      {viewMode === 'hospitals' && (
        <div className="space-y-6">
          {hospitalGroups.map((hospital) => (
            <motion.div 
              key={hospital.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-medical-primary transition-all duration-300 cursor-pointer group hospital-card"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{hospital.name}</h2>
                    <p className="text-gray-600 mb-2">{hospital.address}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span 
                        className="flex items-center gap-1 hover:text-medical-primary transition-colors duration-200 cursor-pointer group contact-element"
                        onClick={() => window.open(`tel:${hospital.phone}`, '_blank')}
                        title="Click to call"
                      >
                        <span className="group-hover:scale-110 transition-transform duration-200">📞</span>
                        <span className="group-hover:underline">{hospital.phone}</span>
                      </span>
                      <span 
                        className="flex items-center gap-1 hover:text-medical-primary transition-colors duration-200 cursor-pointer group contact-element"
                        onClick={() => window.open(`mailto:${hospital.email}`, '_blank')}
                        title="Click to email"
                      >
                        <span className="group-hover:scale-110 transition-transform duration-200">📧</span>
                        <span className="group-hover:underline">{hospital.email}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🏗️</span>
                        <span>Est. {hospital.established}</span>
                      </span>
                      {hospital.totalBeds && (
                        <span className="flex items-center gap-1">
                          <span>🛏️</span>
                          <span>{hospital.totalBeds} beds</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    hospital.type === 'hospital' ? 'bg-blue-100 text-blue-800' :
                    hospital.type === 'clinic' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Medical Staff ({hospital.doctors.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hospital.doctors.map((doctor) => (
                    <motion.div 
                      key={doctor.id} 
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-medical-primary transition-all duration-300 cursor-pointer group bg-white hover:bg-gray-50"
                      onClick={() => setSelectedDoctorId(doctor.id)}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={doctor.profilePicture}
                          alt={doctor.name}
                          className="w-12 h-12 rounded-full object-cover group-hover:ring-2 group-hover:ring-medical-primary group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate group-hover:text-medical-primary transition-colors duration-200">{doctor.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">{doctor.specialization}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              doctor.facilityRelationship === 'owner' ? 'bg-yellow-100 text-yellow-800' :
                              doctor.facilityRelationship === 'partner' ? 'bg-blue-100 text-blue-800' :
                              doctor.facilityRelationship === 'renter' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {doctor.facilityRelationship === 'owner' ? '👑 Owner' :
                               doctor.facilityRelationship === 'partner' ? '🤝 Partner' :
                               doctor.facilityRelationship === 'renter' ? '🏠 Renter' :
                               '💼 Employee'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            <p>{doctor.experience} years experience</p>
                            {doctor.workingHours && <p>{doctor.workingHours}</p>}
                            {doctor.monthlyPatients && <p>~{doctor.monthlyPatients} patients/month</p>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

                      {/* Comprehensive Healthcare Professionals by Institution */}
            <div className="space-y-6 mt-8">
              <h3 className="text-xl font-semibold text-medical-primary">👨‍⚕️ Healthcare Professionals by Institution</h3>
              
              {/* Hospital Professionals */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-medical-primary">🏥 Hospital & Institute Staff</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getHealthcareProfessionalsByFacilityType('hospital').map((professional) => (
                    <motion.div
                      key={professional.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-medical-primary transition-all duration-300 cursor-pointer group transform-gpu doctor-card"
                    >
                      <div className="relative mb-4">
                        <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-6xl font-bold shadow-sm group-hover:shadow-md">
                          {professional.title.includes('Dr.') ? '👨‍⚕️' : '👩‍⚕️'}
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Hospital
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-medical-primary transition-colors duration-200">
                            {professional.name}
                          </h3>
                          <p className="text-medical-primary font-medium">{professional.title}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-medical-primary">🏢</span>
                            <span>{professional.facilityName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-medical-primary">🎯</span>
                            <span>{professional.specialty}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-medical-primary">📍</span>
                            <span>{professional.city}, {professional.province}</span>
                          </div>
                        </div>
                        
                        <div className="pt-3">
                          <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-medical-light text-medical-primary text-xs rounded-full">
                              {professional.specialty}
                            </span>
                            <span className="px-2 py-1 bg-medical-primary text-white text-xs rounded-full">
                              {professional.title}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-600">
                              {professional.title.includes('Dr.') ? 'Medical Doctor' : 'Healthcare Professional'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add contact functionality here
                              }}
                              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium text-sm"
                              title="Contact Professional"
                            >
                              📞 Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Clinic Professionals */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-medical-primary">🏥 Clinic & Medical Centre Staff</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getHealthcareProfessionalsByFacilityType('clinic').map((professional) => (
                    <motion.div
                      key={professional.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-medical-primary transition-all duration-300 cursor-pointer group transform-gpu doctor-card"
                    >
                      <div className="relative mb-4">
                        <div className="w-full h-48 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white text-6xl font-bold shadow-sm group-hover:shadow-md">
                          {professional.title.includes('Dr.') ? '👨‍⚕️' : '👩‍⚕️'}
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Clinic
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-medical-primary transition-colors duration-200">
                            {professional.name}
                          </h3>
                          <p className="text-medical-primary font-medium">{professional.title}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-medical-primary">🏢</span>
                            <span>{professional.facilityName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-medical-primary">🎯</span>
                            <span>{professional.specialty}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-medical-primary">📍</span>
                            <span>{professional.city}, {professional.province}</span>
                          </div>
                        </div>
                        
                        <div className="pt-3">
                          <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-medical-light text-medical-primary text-xs rounded-full">
                              {professional.specialty}
                            </span>
                            <span className="px-2 py-1 bg-medical-primary text-white text-xs rounded-full">
                              {professional.title}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-600">
                              {professional.title.includes('Dr.') ? 'Medical Doctor' : 'Healthcare Professional'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add contact functionality here
                              }}
                              className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium text-sm"
                              title="Contact Professional"
                            >
                              📞 Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Summary Count for Comprehensive Healthcare Professionals */}
              <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-medical-primary font-medium">
                  🏥 Showing {getHealthcareProfessionalsByFacilityType('hospital').length + getHealthcareProfessionalsByFacilityType('clinic').length} comprehensive healthcare professionals
                </p>
              </div>
            </div>
        </div>
      )}

      {/* Wellness & Spa View */}
      {viewMode === 'wellness' && (
        <div className="space-y-6">
          
          {/* Wellness Professionals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWellnessProfessionals.map((professional) => (
              <motion.div
                key={professional.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-medical-primary transition-all duration-300 cursor-pointer group transform-gpu doctor-card"
              >
                <div className="relative mb-4">
                  <img
                    src={professional.profilePicture}
                    alt={professional.name}
                    className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-md"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      professional.category === 'nutrition' ? 'bg-green-100 text-green-800' :
                      professional.category === 'therapy' ? 'bg-blue-100 text-blue-800' :
                      professional.category === 'fitness' ? 'bg-purple-100 text-purple-800' :
                      professional.category === 'spa' ? 'bg-pink-100 text-pink-800' :
                      professional.category === 'wellness' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {professional.category.charAt(0).toUpperCase() + professional.category.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-medical-primary transition-colors duration-200">
                      {professional.name}
                    </h3>
                    <p className="text-medical-primary font-medium">{professional.specialization}</p>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">{professional.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-medical-primary">📍</span>
                      <span>{professional.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-medical-primary">🏢</span>
                      <span>{professional.facilityName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-medical-primary">⏰</span>
                      <span>{professional.workingHours}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {professional.services.slice(0, 3).map((service, index) => (
                        <span key={index} className="px-2 py-1 bg-medical-light text-medical-primary text-xs rounded-full">
                          {service}
                        </span>
                      ))}
                      {professional.services.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{professional.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600">{professional.experience} years</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${professional.contactNumber}`, '_blank');
                        }}
                        className="px-3 py-2 bg-medical-primary text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium text-sm"
                        title="Call Professional"
                      >
                        📞 Call
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`mailto:${professional.email}`, '_blank');
                        }}
                        className="px-3 py-2 bg-medical-accent text-white rounded-lg hover:bg-green-600 hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium text-sm"
                        title="Send Email"
                      >
                        📧 Email
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Comprehensive Wellness & Spa Professionals by Category */}
          <div className="space-y-6 mt-8">
            <h3 className="text-xl font-semibold text-medical-primary">🌿 Comprehensive Wellness & Spa Professionals</h3>
            
            {/* Unified Wellness Category Filter */}
            <div className="flex flex-wrap gap-3">
              <h4 className="text-sm font-semibold text-medical-primary mr-2 self-center">🌿 Filter by Category:</h4>
              <button
                onClick={() => setWellnessCategoryFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  wellnessCategoryFilter === 'all'
                    ? 'bg-medical-accent text-white shadow-lg ring-2 ring-medical-accent ring-opacity-50'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md hover:text-gray-800'
                }`}
              >
                ✨ All Categories
              </button>
              {wellnessCategories.filter(cat => cat !== 'all').map((category) => (
                <button
                  key={category}
                  onClick={() => setWellnessCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    wellnessCategoryFilter === category
                      ? 'bg-medical-accent text-white shadow-lg ring-2 ring-medical-accent ring-opacity-50'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md hover:text-gray-800'
                  }`}
                >
                  {category === 'nutrition' && '🥗'}
                  {category === 'therapy' && '💆'}
                  {category === 'fitness' && '🧘'}
                  {category === 'spa' && '💆‍♀️'}
                  {category === 'wellness' && '🌿'}
                  {category === 'spiritual' && '✨'}
                  {category === 'somatology' && '💆‍♂️'}
                  {category === 'life-coaching' && '🎯'}
                  {category === 'chiropractic' && '🦴'}
                  {category === 'reflexology' && '🦶'}
                  {category === 'aesthetics' && '✨'}
                  {category === 'reiki' && '🔮'}
                  {category === 'quantum-healing' && '⚛️'}
                  {category === 'mind-body-yoga' && '🧘‍♀️'}
                  {category === 'acupuncture' && '🪡'}
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
            
            {/* Unified Comprehensive Wellness Professionals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                // Combine all comprehensive wellness professionals with proper categorization
                const allProfessionals = [
                  ...getHealthcareProfessionalsByFacilityType('spa').map(prof => ({ ...prof, category: 'spa' })),
                  ...getHealthcareProfessionalsByFacilityType('wellness').map(prof => ({ ...prof, category: 'wellness' })),
                  ...comprehensiveHealthcareProfessionals.filter(prof => 
                    prof.title.includes('Somatologist') || prof.specialty.includes('Somatology')
                  ).map(prof => ({ ...prof, category: 'somatology' })),
                  ...comprehensiveHealthcareProfessionals.filter(prof => 
                    (prof.title.includes('Life Coach') || prof.title.includes('Coach')) && prof.specialty.includes('Life Coaching')
                  ).map(prof => ({ ...prof, category: 'life-coaching' })),
                  ...comprehensiveHealthcareProfessionals.filter(prof => 
                    prof.title.includes('Chiropractor') || prof.specialty.includes('Chiropractic')
                  ).map(prof => ({ ...prof, category: 'chiropractic' })),
                  ...comprehensiveHealthcareProfessionals.filter(prof => 
                    prof.title.includes('Reflexologist') || prof.specialty.includes('Reflexology')
                  ).map(prof => ({ ...prof, category: 'reflexology' })),
                  ...comprehensiveHealthcareProfessionals.filter(prof => 
                    prof.title.includes('Aesthetics') || prof.specialty.includes('Aesthetic')
                  ).map(prof => ({ ...prof, category: 'aesthetics' })),
                  ...comprehensiveHealthcareProfessionals.filter(prof => 
                    prof.title.includes('Reiki') || prof.specialty.includes('Reiki')
                  ).map(prof => ({ ...prof, category: 'reiki' })),
                  ...comprehensiveHealthcareProfessionals.filter(prof => 
                    prof.title.includes('Quantum Healing') || prof.specialty.includes('Quantum')
                  ).map(prof => ({ ...prof, category: 'quantum-healing' })),
                  ...comprehensiveHealthcareProfessionals.filter(prof => 
                    prof.title.includes('Mind Body Yoga') || prof.specialty.includes('Mind Body')
                  ).map(prof => ({ ...prof, category: 'mind-body-yoga' })),
                  ...comprehensiveHealthcareProfessionals.filter(prof => 
                    prof.title.includes('Acupuncture') || prof.specialty.includes('Acupuncture')
                  ).map(prof => ({ ...prof, category: 'acupuncture' })),
                  ...comprehensiveHealthcareProfessionals.filter(prof => 
                    (prof.title.includes('Therapist') || 
                     prof.title.includes('Instructor') ||
                     prof.specialty.includes('Alternative') ||
                     prof.specialty.includes('Holistic') ||
                     prof.specialty.includes('Traditional')) &&
                    !prof.title.includes('Somatologist') &&
                    !prof.title.includes('Life Coach') &&
                    !prof.title.includes('Chiropractor') &&
                    !prof.title.includes('Reflexologist') &&
                    !prof.title.includes('Aesthetics') &&
                    !prof.title.includes('Reiki') &&
                    !prof.title.includes('Quantum Healing') &&
                    !prof.title.includes('Mind Body Yoga') &&
                    !prof.title.includes('Acupuncture')
                  ).map(prof => ({ ...prof, category: 'therapy' }))
                ];

                // Filter by selected category
                const filteredProfessionals = allProfessionals.filter(professional => 
                  wellnessCategoryFilter === 'all' || 
                  professional.category === wellnessCategoryFilter
                );

                return filteredProfessionals.map((professional) => (
                  <motion.div
                    key={professional.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-medical-primary transition-all duration-300 cursor-pointer group transform-gpu doctor-card"
                  >
                    <div className="relative mb-4">
                      <div className={`w-full h-48 rounded-lg flex items-center justify-center text-white text-6xl font-bold shadow-sm group-hover:shadow-md ${
                        professional.category === 'spa' ? 'bg-gradient-to-br from-pink-500 to-rose-600' :
                        professional.category === 'wellness' ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                        'bg-gradient-to-br from-purple-500 to-indigo-600'
                      }`}>
                        {professional.category === 'spa' ? '💆‍♀️' :
                         professional.category === 'wellness' ? '🌿' :
                         '🧘'}
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          professional.category === 'spa' ? 'bg-pink-100 text-pink-800' :
                          professional.category === 'wellness' ? 'bg-emerald-100 text-emerald-800' :
                          professional.category === 'somatology' ? 'bg-blue-100 text-blue-800' :
                          professional.category === 'life-coaching' ? 'bg-indigo-100 text-indigo-800' :
                          professional.category === 'chiropractic' ? 'bg-green-100 text-green-800' :
                          professional.category === 'reflexology' ? 'bg-orange-100 text-orange-800' :
                          professional.category === 'aesthetics' ? 'bg-purple-100 text-purple-800' :
                          professional.category === 'reiki' ? 'bg-red-100 text-red-800' :
                          professional.category === 'quantum-healing' ? 'bg-yellow-100 text-yellow-800' :
                          professional.category === 'mind-body-yoga' ? 'bg-teal-100 text-teal-800' :
                          professional.category === 'acupuncture' ? 'bg-cyan-100 text-cyan-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {professional.category === 'spa' ? 'Spa' :
                           professional.category === 'wellness' ? 'Wellness' :
                           professional.category === 'somatology' ? 'Somatology' :
                           professional.category === 'life-coaching' ? 'Life Coaching' :
                           professional.category === 'chiropractic' ? 'Chiropractic' :
                           professional.category === 'reflexology' ? 'Reflexology' :
                           professional.category === 'aesthetics' ? 'Aesthetics' :
                           professional.category === 'reiki' ? 'Reiki' :
                           professional.category === 'quantum-healing' ? 'Quantum Healing' :
                           professional.category === 'mind-body-yoga' ? 'Mind Body Yoga' :
                           professional.category === 'acupuncture' ? 'Acupuncture' :
                           'Therapy'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-medical-primary transition-colors duration-200">
                          {professional.name}
                        </h3>
                        <p className="text-medical-primary font-medium">{professional.title}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-medical-primary">🏢</span>
                          <span>{professional.facilityName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-medical-primary">🎯</span>
                          <span>{professional.specialty}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-medical-primary">📍</span>
                          <span>{professional.city}, {professional.province}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3">
                        <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-medical-light text-medical-primary text-xs rounded-full">
                            {professional.specialty}
                          </span>
                          <span className="px-2 py-1 bg-medical-primary text-white text-xs rounded-full">
                            {professional.title}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm text-gray-600">
                            {professional.category === 'spa' ? 'Specialist' :
                             professional.category === 'wellness' ? 'Specialist' :
                             'Therapist'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add contact functionality here
                            }}
                            className={`px-3 py-2 text-white rounded-lg hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium text-sm ${
                              professional.category === 'spa' ? 'bg-pink-500 hover:bg-pink-600' :
                              professional.category === 'wellness' ? 'bg-emerald-500 hover:bg-emerald-600' :
                              'bg-purple-500 hover:bg-purple-600'
                            }`}
                            title="Contact Professional"
                          >
                            📞 Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ));
              })()}
            </div>

            {/* Summary Count for Comprehensive Professionals */}
            <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-medical-primary font-medium">
                🌟 Showing {(() => {
                  const spaCount = getHealthcareProfessionalsByFacilityType('spa')
                    .filter(professional => 
                      wellnessCategoryFilter === 'all' || 
                      wellnessCategoryFilter === 'spa'
                    ).length;
                  const wellnessCount = getHealthcareProfessionalsByFacilityType('wellness')
                    .filter(professional => 
                      wellnessCategoryFilter === 'all' || 
                      wellnessCategoryFilter === 'wellness'
                    ).length;
                  const therapyCount = comprehensiveHealthcareProfessionals.filter(prof => 
                    (prof.title.includes('Therapist') || 
                    prof.title.includes('Instructor') || 
                    prof.title.includes('Coach') ||
                    prof.specialty.includes('Alternative') ||
                    prof.specialty.includes('Holistic') ||
                    prof.specialty.includes('Traditional')) &&
                    (wellnessCategoryFilter === 'all' || 
                     wellnessCategoryFilter === 'therapy')
                  ).length;
                  return spaCount + wellnessCount + therapyCount;
                })()} comprehensive wellness professionals
                {wellnessCategoryFilter !== 'all' && (
                  <span className="text-gray-600"> in {wellnessCategoryFilter} category</span>
                )}
              </p>
            </div>
          </div>


        </div>
      )}

      {/* Doctor Detail Modal */}
      {selectedDoctorId && (
        <DoctorDetailModal
          isOpen={true}
          onClose={() => setSelectedDoctorId(null)}
          doctorId={selectedDoctorId}
        />
      )}
    </div>
  );
};

export default NetworkTab;
import React, { useState, useMemo } from 'react';
import useStore from '../store/useStore';

// Icons

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);



const SchedulingCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'consultation' | 'follow-up' | 'emergency'>('consultation');
  const [notes, setNotes] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'schedule'>('calendar');

  const { consultations, patients, currentUser, addConsultation } = useStore();

  // Generate time slots (9 AM to 5 PM, 30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        slots.push({ value: displayTime, display: displayTime });
      }
    }
    return slots;
  }, []);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  }, [currentDate]);

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return consultations.filter(c => c.date === dateString && c.type === 'upcoming');
  };

  // Check if a time slot is available
  const isTimeSlotAvailable = (date: string, time: string) => {
    const conflicts = consultations.filter(c => 
      c.date === date && 
      c.time === time && 
      c.type === 'upcoming'
    );
    return conflicts.length === 0;
  };

  // Get conflicts for a specific date/time
  const getConflicts = (date: string, time: string) => {
    return consultations.filter(c => 
      c.date === date && 
      c.time === time && 
      c.type === 'upcoming'
    );
  };

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedPatientId) {
      alert('Please select a date, time, and patient.');
      return;
    }

    // Check for conflicts
    const conflicts = getConflicts(selectedDate, selectedTime);
    if (conflicts.length > 0) {
      const conflictDoctors = conflicts.map(c => c.doctorName).join(', ');
      alert(`Time slot unavailable. Conflicting appointments with: ${conflictDoctors}`);
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    const newAppointment = {
      patientId: selectedPatientId,
      patientName: patient.name,
      doctorId: currentUser?.id || '',
      doctorName: currentUser?.name || '',
      date: selectedDate,
      time: selectedTime,
      notes: notes,
      type: 'upcoming' as const,
      status: 'scheduled' as const
    };

    addConsultation(newAppointment);
    
    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSelectedPatientId('');
    setNotes('');
    
    alert('Appointment scheduled successfully!');
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-medical-primary">Appointment Scheduling</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-medical-primary shadow-sm'
                : 'text-medical-gray hover:text-medical-primary'
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setViewMode('schedule')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'schedule'
                ? 'bg-white text-medical-primary shadow-sm'
                : 'text-medical-gray hover:text-medical-primary'
            }`}
          >
            Schedule Appointment
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="text-center font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const isPast = day < new Date(new Date().toDateString());
              const appointments = getAppointmentsForDate(day);
              
              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 border border-gray-100 ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${isToday ? 'ring-2 ring-medical-primary' : ''} ${
                    isPast ? 'opacity-50' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {appointments.slice(0, 3).map((apt, i) => {
                      return (
                        <div
                          key={i}
                          className="text-xs bg-medical-primary text-white px-1 py-0.5 rounded truncate"
                          title={`${apt.time} - ${apt.patientName} with ${apt.doctorName}`}
                        >
                          {apt.time} - {apt.patientName}
                        </div>
                      );
                    })}
                    {appointments.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{appointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-medical-primary rounded"></div>
              <span>Scheduled Appointments</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-medical-primary rounded"></div>
              <span>Today</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-medical-primary mb-6">Schedule New Appointment</h3>
          
          <form onSubmit={handleScheduleAppointment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="form-input"
                />
              </div>

              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient
                </label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Selection with Availability */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {timeSlots.map((slot) => {
                    const isAvailable = isTimeSlotAvailable(selectedDate, slot.value);
                    const conflicts = getConflicts(selectedDate, slot.value);
                    
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => setSelectedTime(slot.value)}
                        disabled={!isAvailable}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedTime === slot.value
                            ? 'bg-medical-primary text-white border-medical-primary'
                            : isAvailable
                            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                        title={
                          !isAvailable 
                            ? `Unavailable - conflicts with ${conflicts.map(c => c.doctorName).join(', ')}`
                            : 'Available'
                        }
                      >
                        {slot.display}
                        {!isAvailable && (
                          <div className="text-xs mt-1 text-red-500">Booked</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type
              </label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value as any)}
                className="form-select"
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="Add any notes or special instructions..."
              />
            </div>

            {/* Conflict Warning */}
            {selectedDate && selectedTime && !isTimeSlotAvailable(selectedDate, selectedTime) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-red-800">
                  <ClockIcon />
                  <span className="font-medium">Time Slot Conflict</span>
                </div>
                <p className="text-red-700 text-sm mt-1">
                  This time slot is already booked by: {getConflicts(selectedDate, selectedTime).map(c => c.doctorName).join(', ')}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || !selectedPatientId || !isTimeSlotAvailable(selectedDate, selectedTime)}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Appointment
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate('');
                  setSelectedTime('');
                  setSelectedPatientId('');
                  setNotes('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SchedulingCalendar;
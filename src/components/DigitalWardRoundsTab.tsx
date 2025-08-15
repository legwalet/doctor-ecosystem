import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface WardRoundEntry {
  id: string;
  date: string;
  time: string;
  discipline: string;
  professionalName: string;
  summary: string;
  observations: string[];
  recommendations: string[];
  nextReviewDate: string;
  status: 'completed' | 'pending' | 'overdue';
}

interface DigitalWardRoundsTabProps {
  patientId: string;
  patientName: string;
}

const DigitalWardRoundsTab: React.FC<DigitalWardRoundsTabProps> = ({ patientId, patientName }) => {
  const [activeDiscipline, setActiveDiscipline] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<WardRoundEntry>>({
    discipline: 'psychiatrist',
    summary: '',
    observations: [''],
    recommendations: [''],
    nextReviewDate: '',
    status: 'completed'
  });

  // Mock data for multidisciplinary team members
  const disciplines = [
    {
      id: 'psychiatrist',
      name: 'Psychiatrist',
      color: 'bg-purple-100 text-purple-800',
      icon: '🧠',
      description: 'Mental health assessment and psychiatric care'
    },
    {
      id: 'psychologist',
      name: 'Psychologist',
      color: 'bg-blue-100 text-blue-800',
      icon: '🧘',
      description: 'Psychological evaluation and therapy'
    },
    {
      id: 'occupational-therapist',
      name: 'Occupational Therapist',
      color: 'bg-green-100 text-green-800',
      icon: '🛠️',
      description: 'Functional assessment and rehabilitation'
    },
    {
      id: 'social-worker',
      name: 'Social Worker',
      color: 'bg-orange-100 text-orange-800',
      icon: '🤝',
      description: 'Social support and discharge planning'
    },
    {
      id: 'nursing-team',
      name: 'Nursing Team',
      color: 'bg-red-100 text-red-800',
      icon: '👩‍⚕️',
      description: 'Daily care and monitoring'
    }
  ];

  // Mock ward round data
  const wardRoundData: WardRoundEntry[] = [
    {
      id: '1',
      date: '2024-12-23',
      time: '09:00',
      discipline: 'psychiatrist',
      professionalName: 'Dr. Sarah Johnson',
      summary: 'Patient showing significant improvement in mood and cognitive function. Reduced anxiety levels and improved sleep patterns.',
      observations: [
        'Mood: Stable and positive',
        'Sleep: 7-8 hours per night',
        'Medication compliance: Excellent',
        'Social interaction: Improved'
      ],
      recommendations: [
        'Continue current medication regimen',
        'Maintain therapy sessions twice weekly',
        'Encourage social activities',
        'Monitor for any mood changes'
      ],
      nextReviewDate: '2024-12-30',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-12-23',
      time: '10:30',
      discipline: 'psychologist',
      professionalName: 'Dr. Michael Chen',
      summary: 'Cognitive behavioral therapy sessions are showing positive results. Patient demonstrates improved coping mechanisms.',
      observations: [
        'Coping skills: Significantly improved',
        'Cognitive distortions: Reduced',
        'Therapy engagement: High',
        'Homework completion: Consistent'
      ],
      recommendations: [
        'Continue CBT sessions',
        'Practice relaxation techniques daily',
        'Journal mood and thoughts',
        'Schedule family therapy session'
      ],
      nextReviewDate: '2024-12-27',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-12-23',
      time: '11:00',
      discipline: 'occupational-therapist',
      professionalName: 'Dr. Emily Rodriguez',
      summary: 'Patient demonstrates improved daily living skills and increased independence in self-care activities.',
      observations: [
        'ADL skills: Independent in most tasks',
        'Fine motor skills: Improved coordination',
        'Energy conservation: Good understanding',
        'Adaptive equipment: No longer needed'
      ],
      recommendations: [
        'Continue daily living skills practice',
        'Begin vocational assessment',
        'Plan community reintegration activities',
        'Schedule home visit assessment'
      ],
      nextReviewDate: '2024-12-26',
      status: 'completed'
    },
    {
      id: '4',
      date: '2024-12-23',
      time: '13:00',
      discipline: 'social-worker',
      professionalName: 'Ms. Lisa Thompson',
      summary: 'Discharge planning progressing well. Family support system is strong and ready for patient return home.',
      observations: [
        'Family support: Excellent',
        'Housing: Suitable and accessible',
        'Financial resources: Adequate',
        'Community resources: Identified'
      ],
      recommendations: [
        'Schedule family meeting for discharge planning',
        'Arrange home health services',
        'Connect with community support groups',
        'Plan follow-up appointments'
      ],
      nextReviewDate: '2024-12-24',
      status: 'completed'
    },
    {
      id: '5',
      date: '2024-12-23',
      time: '14:00',
      discipline: 'nursing-team',
      professionalName: 'Sister Maria Santos',
      summary: 'Patient remains stable with no acute medical concerns. Vital signs normal, medication administration smooth.',
      observations: [
        'Vital signs: All within normal range',
        'Medication: Administered as prescribed',
        'Pain: Well controlled',
        'Mobility: Independent with supervision'
      ],
      recommendations: [
        'Continue current nursing care plan',
        'Monitor vital signs twice daily',
        'Encourage ambulation',
        'Prepare for discharge education'
      ],
      nextReviewDate: '2024-12-24',
      status: 'completed'
    }
  ];

  const filteredData = activeDiscipline === 'all' 
    ? wardRoundData 
    : wardRoundData.filter(entry => entry.discipline === activeDiscipline);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would save to store/backend
    console.log('Adding ward round entry:', newEntry);
    alert('Ward round entry added successfully!');
    setShowAddForm(false);
    setNewEntry({
      discipline: 'psychiatrist',
      summary: '',
      observations: [''],
      recommendations: [''],
      nextReviewDate: '',
      status: 'completed'
    });
  };

  const addObservation = () => {
    setNewEntry(prev => ({
      ...prev,
      observations: [...(prev.observations || []), '']
    }));
  };

  const addRecommendation = () => {
    setNewEntry(prev => ({
      ...prev,
      recommendations: [...(prev.recommendations || []), '']
    }));
  };

  const updateObservation = (index: number, value: string) => {
    setNewEntry(prev => ({
      ...prev,
      observations: prev.observations?.map((obs, i) => i === index ? value : obs)
    }));
  };

  const updateRecommendation = (index: number, value: string) => {
    setNewEntry(prev => ({
      ...prev,
      recommendations: prev.recommendations?.map((rec, i) => i === index ? value : rec)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-medical-primary">Digital Ward-Rounds</h3>
          <p className="text-medical-gray">Multidisciplinary team summaries and progress tracking for {patientName}</p>
        </div>
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Monday Ward-Rounds
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Discipline Filter */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveDiscipline('all')}
            className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeDiscipline === 'all'
                ? 'border-medical-primary text-medical-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <UsersIcon />
            <span>All Disciplines</span>
          </button>
          {disciplines.map((discipline) => (
            <button
              key={discipline.id}
              onClick={() => setActiveDiscipline(discipline.id)}
              className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeDiscipline === discipline.id
                  ? 'border-medical-primary text-medical-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{discipline.icon}</span>
              <span>{discipline.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Add New Entry Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border rounded-lg p-6 shadow-sm"
          >
            <h4 className="font-semibold text-medical-primary mb-4">Add New Ward-Round Entry</h4>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discipline</label>
                  <select
                    value={newEntry.discipline}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, discipline: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-medical-primary"
                    required
                  >
                    {disciplines.map((discipline) => (
                      <option key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Review Date</label>
                  <input
                    type="date"
                    value={newEntry.nextReviewDate}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, nextReviewDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-medical-primary"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea
                  value={newEntry.summary}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, summary: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-medical-primary"
                  placeholder="Enter a comprehensive summary of the ward-round findings..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Observations</label>
                {newEntry.observations?.map((observation, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={observation}
                      onChange={(e) => updateObservation(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-medical-primary"
                      placeholder="Enter observation..."
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addObservation}
                  className="text-sm text-medical-primary hover:text-medical-accent"
                >
                  + Add Observation
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
                {newEntry.recommendations?.map((recommendation, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={recommendation}
                      onChange={(e) => updateRecommendation(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-medical-primary"
                      placeholder="Enter recommendation..."
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRecommendation}
                  className="text-sm text-medical-primary hover:text-medical-accent"
                >
                  + Add Recommendation
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn-primary px-4 py-2"
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ward-Round Entries */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UsersIcon />
            <p className="mt-2">No ward-round entries found for the selected discipline.</p>
          </div>
        ) : (
          filteredData.map((entry) => {
            const discipline = disciplines.find(d => d.id === entry.discipline);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                      {discipline?.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-medical-primary">{discipline?.name}</h4>
                      <p className="text-sm text-gray-600">{entry.professionalName}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center space-x-1">
                          <CalendarIcon />
                          <span>{entry.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ClockIcon />
                          <span>{entry.time}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Summary</h5>
                  <p className="text-gray-600 text-sm leading-relaxed">{entry.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Key Observations</h5>
                    <ul className="space-y-1">
                      {entry.observations.map((observation, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{observation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Recommendations</h5>
                    <ul className="space-y-1">
                      {entry.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Next Review: <span className="font-medium text-gray-700">{entry.nextReviewDate}</span>
                    </span>
                    <button className="text-medical-primary hover:text-medical-accent text-sm">
                      View Full Report
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Summary Statistics */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-medical-primary mb-4">Ward-Round Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {disciplines.map((discipline) => {
            const disciplineEntries = wardRoundData.filter(entry => entry.discipline === discipline.id);
            const completedEntries = disciplineEntries.filter(entry => entry.status === 'completed');
            const pendingEntries = disciplineEntries.filter(entry => entry.status === 'pending');
            
            return (
              <div key={discipline.id} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-2`}>
                  {discipline.icon}
                </div>
                <h5 className="font-medium text-sm text-gray-700 mb-1">{discipline.name}</h5>
                <div className="text-xs text-gray-500">
                  <div>Completed: {completedEntries.length}</div>
                  <div>Pending: {pendingEntries.length}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DigitalWardRoundsTab; 
import React, { useState } from 'react';

// Simple Line Chart Component (without external libraries)
interface ChartProps {
  data: { date: string; score: number; type: string }[];
  width?: number;
  height?: number;
}

const SimpleLineChart: React.FC<ChartProps> = ({ data, width = 400, height = 200 }) => {
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  if (data.length === 0) return <div>No data available</div>;
  
  const maxScore = 10;
  const minScore = 0;
  
  // Create points for the line
  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((point.score - minScore) / (maxScore - minScore)) * chartHeight;
    return { x, y, ...point };
  });
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  const getColorByType = (type: string) => {
    switch (type) {
      case 'improvement': return '#10b981';
      case 'stable': return '#3b82f6';
      case 'decline': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  return (
    <svg width={width} height={height} className="border border-gray-200 rounded">
      {/* Grid lines */}
      {[0, 2, 4, 6, 8, 10].map(score => {
        const y = padding + chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight;
        return (
          <g key={score}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={padding - 5} y={y + 4} fontSize="12" fill="#6b7280" textAnchor="end">{score}</text>
          </g>
        );
      })}
      
      {/* Progress line */}
      <path d={pathData} stroke="#3b82f6" strokeWidth="2" fill="none" />
      
      {/* Data points */}
      {points.map((point, index) => (
        <g key={index}>
          <circle 
            cx={point.x} 
            cy={point.y} 
            r="4" 
            fill={getColorByType(point.type)} 
            stroke="white" 
            strokeWidth="2"
          />
          <title>{`${point.date}: ${point.score}/10 (${point.type})`}</title>
        </g>
      ))}
      
      {/* Axis labels */}
      <text x={width / 2} y={height - 5} fontSize="12" fill="#6b7280" textAnchor="middle">
        Progress Over Time
      </text>
      <text x={15} y={height / 2} fontSize="12" fill="#6b7280" textAnchor="middle" transform={`rotate(-90 15 ${height / 2})`}>
        Progress Score
      </text>
    </svg>
  );
};

// Icons
const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

interface PatientProgressTabProps {
  patientId: string;
  patientName: string;
  facilityId: string;
}

const PatientProgressTab: React.FC<PatientProgressTabProps> = ({ patientId, patientName, facilityId }) => {
  const [activeSection, setActiveSection] = useState<'progress' | 'add' | 'weekly'>('progress');
  const [newProgress, setNewProgress] = useState({
    progressType: 'stable' as 'improvement' | 'stable' | 'decline' | 'critical',
    progressScore: 5,
    notes: '',
    symptoms: '',
    treatmentResponse: '',
    nextSteps: ''
  });

  // Mock data - in real app, this would come from props or store
  const progressData = [
    { date: '2024-12-03', score: 6, type: 'stable' },
    { date: '2024-12-10', score: 7, type: 'improvement' },
    { date: '2024-12-17', score: 8, type: 'improvement' }
  ];

  const weeklyReviewData = {
    lastReview: '2024-12-16',
    nextReview: '2024-12-23',
    attendingDoctors: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez'],
    priority: 'low' as 'low' | 'medium' | 'high' | 'urgent',
    teamNotes: 'Patient showing consistent improvement. Continue current treatment plan.'
  };

  const handleAddProgress = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would save to store/backend
    console.log('Adding progress:', newProgress);
    alert('Progress entry added successfully!');
    setNewProgress({
      progressType: 'stable',
      progressScore: 5,
      notes: '',
      symptoms: '',
      treatmentResponse: '',
      nextSteps: ''
    });
  };

  const getProgressColor = (type: string) => {
    switch (type) {
      case 'improvement': return 'text-green-600 bg-green-50';
      case 'stable': return 'text-blue-600 bg-blue-50';
      case 'decline': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-medical-primary">Patient Progress Tracking</h3>
          <p className="text-medical-gray">Monitor {patientName}'s treatment progress and outcomes</p>
        </div>
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Facility Access Only
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'progress', label: 'Progress Chart', icon: <TrendingUpIcon /> },
            { id: 'add', label: 'Add Progress', icon: <PlusIcon /> },
            { id: 'weekly', label: 'Weekly Reviews', icon: <CalendarIcon /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeSection === tab.id
                  ? 'border-medical-primary text-medical-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activeSection === 'progress' && (
          <div className="space-y-6">
            {/* Progress Chart */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Progress Over Time</h4>
              <div className="flex justify-center">
                <SimpleLineChart data={progressData} width={600} height={300} />
              </div>
            </div>

            {/* Progress Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { type: 'improvement', label: 'Improvement', color: 'bg-green-500' },
                { type: 'stable', label: 'Stable', color: 'bg-blue-500' },
                { type: 'decline', label: 'Decline', color: 'bg-yellow-500' },
                { type: 'critical', label: 'Critical', color: 'bg-red-500' }
              ].map((item) => (
                <div key={item.type} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Recent Progress Entries */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Progress Notes</h4>
              <div className="space-y-3">
                {/* Mock progress entries */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor('improvement')}`}>
                        Improvement
                      </span>
                      <span className="text-sm font-medium">Score: 8/10</span>
                      <span className="text-xs text-gray-500">Dec 17, 2024</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Significant reduction in migraine frequency. Patient very satisfied with current treatment.
                  </p>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Next Steps:</span> Continue current dose, consider lifestyle modifications
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor('stable')}`}>
                        Stable
                      </span>
                      <span className="text-sm font-medium">Score: 6/10</span>
                      <span className="text-xs text-gray-500">Dec 10, 2024</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Blood pressure readings remain consistent. Patient compliant with medication.
                  </p>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Weekly Review:</span> Team consensus: continue current treatment plan
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'add' && (
          <div className="max-w-2xl">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Add Progress Entry</h4>
            
            <form onSubmit={handleAddProgress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress Type
                  </label>
                  <select
                    value={newProgress.progressType}
                    onChange={(e) => setNewProgress({...newProgress, progressType: e.target.value as any})}
                    className="form-select"
                  >
                    <option value="improvement">Improvement</option>
                    <option value="stable">Stable</option>
                    <option value="decline">Decline</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress Score (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newProgress.progressScore}
                    onChange={(e) => setNewProgress({...newProgress, progressScore: parseInt(e.target.value)})}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress Notes
                </label>
                <textarea
                  value={newProgress.notes}
                  onChange={(e) => setNewProgress({...newProgress, notes: e.target.value})}
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe the patient's current condition and progress..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Symptoms
                </label>
                <input
                  type="text"
                  value={newProgress.symptoms}
                  onChange={(e) => setNewProgress({...newProgress, symptoms: e.target.value})}
                  className="form-input"
                  placeholder="e.g., mild headaches, fatigue, chest tightness"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment Response
                </label>
                <textarea
                  value={newProgress.treatmentResponse}
                  onChange={(e) => setNewProgress({...newProgress, treatmentResponse: e.target.value})}
                  className="form-textarea"
                  rows={2}
                  placeholder="How is the patient responding to current treatment?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Steps
                </label>
                <textarea
                  value={newProgress.nextSteps}
                  onChange={(e) => setNewProgress({...newProgress, nextSteps: e.target.value})}
                  className="form-textarea"
                  rows={2}
                  placeholder="Planned next steps in treatment or monitoring..."
                />
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  Add Progress Entry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('progress')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSection === 'weekly' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <UsersIcon />
              <h4 className="text-lg font-medium text-gray-900">Monday Team Reviews</h4>
            </div>

            {/* Next Review */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-blue-900">Next Team Review</h5>
                  <p className="text-blue-700 text-sm">Monday, {weeklyReviewData.nextReview}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(weeklyReviewData.priority)}`}>
                  {weeklyReviewData.priority.toUpperCase()} Priority
                </span>
              </div>
            </div>

            {/* Last Review Summary */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900">Last Review Summary</h5>
                <span className="text-sm text-gray-500">{weeklyReviewData.lastReview}</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Attending Doctors:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {weeklyReviewData.attendingDoctors.map((doctor, index) => (
                      <span key={index} className="px-2 py-1 bg-medical-light text-medical-primary rounded text-xs">
                        {doctor}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Team Notes:</span>
                  <p className="text-sm text-gray-600 mt-1">{weeklyReviewData.teamNotes}</p>
                </div>
              </div>
            </div>

            {/* Weekly Review Guidelines */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Weekly Review Process</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Team reviews occur every Monday at 9:00 AM</li>
                <li>• All facility doctors discuss patient progress</li>
                <li>• Progress notes are reviewed and treatment plans adjusted</li>
                <li>• Priority levels are assigned for the upcoming week</li>
                <li>• Shared notes are updated for consultation awareness</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProgressTab;
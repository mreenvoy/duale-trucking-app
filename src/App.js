import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, Truck } from 'lucide-react';

// Firebase configuration - Replace these with your own values from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export default function TruckDriverApplication() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    ssn: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'MN',
    zip: '',
    
    // License Information
    licenseNumber: '',
    licenseState: '',
    licenseClass: '',
    endorsements: [],
    licenseExpiration: '',
    
    // Employment History
    employmentHistory: [
      { company: '', position: '', startDate: '', endDate: '', reason: '', supervisor: '', phone: '' }
    ],
    
    // Driving Experience
    yearsExperience: '',
    truckTypes: [],
    accidentCount: '',
    accidentDetails: '',
    
    // Background
    felonyConviction: '',
    felonyDetails: '',
    drivingViolations: '',
    violationDetails: '',
    
    // References
    references: [
      { name: '', relationship: '', phone: '', yearsKnown: '' },
      { name: '', relationship: '', phone: '', yearsKnown: '' }
    ],
    
    // Certifications
    medicalCardExpiration: '',
    hazmatEndorsement: '',
    twicCard: '',
    
    // Availability
    startDate: '',
    routePreference: '',
    
    // Acknowledgment
    certifyTruth: false,
    authorizeBackground: false
  });

  const steps = [
    'Personal Info',
    'License',
    'Employment',
    'Experience',
    'Background',
    'References',
    'Review'
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedData = (array, index, field, value) => {
    const newArray = [...formData[array]];
    newArray[index] = { ...newArray[index], [field]: value };
    setFormData(prev => ({ ...prev, [array]: newArray }));
  };

  const addEmployment = () => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: [...prev.employmentHistory, 
        { company: '', position: '', startDate: '', endDate: '', reason: '', supervisor: '', phone: '' }
      ]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveToFirebase = async (applicationData) => {
    try {
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/applications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              submittedAt: { timestampValue: new Date().toISOString() },
              firstName: { stringValue: applicationData.firstName },
              lastName: { stringValue: applicationData.lastName },
              email: { stringValue: applicationData.email },
              phone: { stringValue: applicationData.phone },
              formData: { stringValue: JSON.stringify(applicationData) }
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Add submission timestamp
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString()
      };

      // Save to Firebase
      await saveToFirebase(submissionData);
      
      alert('Application submitted successfully! You will be contacted by our recruiting team.');
      
      // Reset form
      window.location.reload();
    } catch (error) {
      alert('There was an error submitting your application. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Driver Application</h1>
              <p className="text-gray-600">Duale Trucking</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentStep ? <CheckCircle className="w-6 h-6" /> : index + 1}
                  </div>
                  <span className="text-xs mt-2 text-center hidden sm:block">{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Step 0: Personal Information */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="First Name *"
                  className="border rounded px-4 py-2"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Middle Name"
                  className="border rounded px-4 py-2"
                  value={formData.middleName}
                  onChange={(e) => updateFormData('middleName', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  className="border rounded px-4 py-2"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  placeholder="Social Security Number *"
                  className="border rounded px-4 py-2"
                  value={formData.ssn}
                  onChange={(e) => updateFormData('ssn', e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Date of Birth *"
                  className="border rounded px-4 py-2"
                  value={formData.dob}
                  onChange={(e) => updateFormData('dob', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  className="border rounded px-4 py-2"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  className="border rounded px-4 py-2"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />
              </div>

              <input
                type="text"
                placeholder="Street Address *"
                className="border rounded px-4 py-2 w-full mt-4"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <input
                  type="text"
                  placeholder="City *"
                  className="border rounded px-4 py-2"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                />
                <select
                  className="border rounded px-4 py-2"
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                >
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
                <input
                  type="text"
                  placeholder="ZIP Code *"
                  className="border rounded px-4 py-2"
                  value={formData.zip}
                  onChange={(e) => updateFormData('zip', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 1: License Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Commercial Driver's License</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="CDL Number *"
                  className="border rounded px-4 py-2"
                  value={formData.licenseNumber}
                  onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                />
                <select
                  className="border rounded px-4 py-2"
                  value={formData.licenseState}
                  onChange={(e) => updateFormData('licenseState', e.target.value)}
                >
                  <option value="">Select State *</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <select
                  className="border rounded px-4 py-2"
                  value={formData.licenseClass}
                  onChange={(e) => updateFormData('licenseClass', e.target.value)}
                >
                  <option value="">License Class *</option>
                  <option value="A">Class A</option>
                  <option value="B">Class B</option>
                  <option value="C">Class C</option>
                </select>
                <input
                  type="date"
                  placeholder="Expiration Date *"
                  className="border rounded px-4 py-2"
                  value={formData.licenseExpiration}
                  onChange={(e) => updateFormData('licenseExpiration', e.target.value)}
                />
              </div>

              <div className="mt-4">
                <label className="block font-semibold mb-2">Endorsements (Check all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['H - Hazmat', 'N - Tank', 'T - Doubles/Triples', 'X - Hazmat + Tank'].map(end => (
                    <label key={end} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.endorsements.includes(end)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('endorsements', [...formData.endorsements, end]);
                          } else {
                            updateFormData('endorsements', formData.endorsements.filter(e => e !== end));
                          }
                        }}
                      />
                      <span className="text-sm">{end}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block font-semibold mb-2">Medical Card Expiration *</label>
                <input
                  type="date"
                  className="border rounded px-4 py-2 w-full"
                  value={formData.medicalCardExpiration}
                  onChange={(e) => updateFormData('medicalCardExpiration', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Employment History */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Employment History</h2>
              <p className="text-gray-600 mb-4">Please provide your last 3 years of employment</p>
              
              {formData.employmentHistory.map((emp, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-3">Employer {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Company Name *"
                      className="border rounded px-4 py-2"
                      value={emp.company}
                      onChange={(e) => updateNestedData('employmentHistory', index, 'company', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Position *"
                      className="border rounded px-4 py-2"
                      value={emp.position}
                      onChange={(e) => updateNestedData('employmentHistory', index, 'position', e.target.value)}
                    />
                    <input
                      type="date"
                      placeholder="Start Date *"
                      className="border rounded px-4 py-2"
                      value={emp.startDate}
                      onChange={(e) => updateNestedData('employmentHistory', index, 'startDate', e.target.value)}
                    />
                    <input
                      type="date"
                      placeholder="End Date"
                      className="border rounded px-4 py-2"
                      value={emp.endDate}
                      onChange={(e) => updateNestedData('employmentHistory', index, 'endDate', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Supervisor Name"
                      className="border rounded px-4 py-2"
                      value={emp.supervisor}
                      onChange={(e) => updateNestedData('employmentHistory', index, 'supervisor', e.target.value)}
                    />
                    <input
                      type="tel"
                      placeholder="Supervisor Phone"
                      className="border rounded px-4 py-2"
                      value={emp.phone}
                      onChange={(e) => updateNestedData('employmentHistory', index, 'phone', e.target.value)}
                    />
                  </div>
                  <textarea
                    placeholder="Reason for Leaving"
                    className="border rounded px-4 py-2 w-full mt-4"
                    rows="2"
                    value={emp.reason}
                    onChange={(e) => updateNestedData('employmentHistory', index, 'reason', e.target.value)}
                  />
                </div>
              ))}
              
              <button
                onClick={addEmployment}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add Another Employer
              </button>
            </div>
          )}

          {/* Step 3: Driving Experience */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Driving Experience</h2>
              
              <div className="mb-4">
                <label className="block font-semibold mb-2">Years of CDL Driving Experience *</label>
                <select
                  className="border rounded px-4 py-2 w-full"
                  value={formData.yearsExperience}
                  onChange={(e) => updateFormData('yearsExperience', e.target.value)}
                >
                  <option value="">Select Years</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2">Types of Equipment Operated (Check all that apply)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Dry Van', 'Flatbed', 'Reefer', 'Tanker', 'Doubles/Triples', 'Hazmat'].map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.truckTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('truckTypes', [...formData.truckTypes, type]);
                          } else {
                            updateFormData('truckTypes', formData.truckTypes.filter(t => t !== type));
                          }
                        }}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2">Number of Preventable Accidents (Last 3 Years) *</label>
                <input
                  type="number"
                  min="0"
                  className="border rounded px-4 py-2 w-full"
                  value={formData.accidentCount}
                  onChange={(e) => updateFormData('accidentCount', e.target.value)}
                />
              </div>

              {parseInt(formData.accidentCount) > 0 && (
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Please Describe Each Accident</label>
                  <textarea
                    className="border rounded px-4 py-2 w-full"
                    rows="4"
                    placeholder="Include dates, locations, and brief descriptions"
                    value={formData.accidentDetails}
                    onChange={(e) => updateFormData('accidentDetails', e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 4: Background */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Background Information</h2>
              
              <div className="mb-6">
                <label className="block font-semibold mb-2">
                  Have you been convicted of a felony in the past 7 years? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="felony"
                      value="yes"
                      checked={formData.felonyConviction === 'yes'}
                      onChange={(e) => updateFormData('felonyConviction', e.target.value)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="felony"
                      value="no"
                      checked={formData.felonyConviction === 'no'}
                      onChange={(e) => updateFormData('felonyConviction', e.target.value)}
                    />
                    <span>No</span>
                  </label>
                </div>
                {formData.felonyConviction === 'yes' && (
                  <textarea
                    className="border rounded px-4 py-2 w-full mt-3"
                    rows="3"
                    placeholder="Please explain"
                    value={formData.felonyDetails}
                    onChange={(e) => updateFormData('felonyDetails', e.target.value)}
                  />
                )}
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2">
                  Have you had any moving violations in the past 3 years? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="violations"
                      value="yes"
                      checked={formData.drivingViolations === 'yes'}
                      onChange={(e) => updateFormData('drivingViolations', e.target.value)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="violations"
                      value="no"
                      checked={formData.drivingViolations === 'no'}
                      onChange={(e) => updateFormData('drivingViolations', e.target.value)}
                    />
                    <span>No</span>
                  </label>
                </div>
                {formData.drivingViolations === 'yes' && (
                  <textarea
                    className="border rounded px-4 py-2 w-full mt-3"
                    rows="3"
                    placeholder="Please list all violations with dates"
                    value={formData.violationDetails}
                    onChange={(e) => updateFormData('violationDetails', e.target.value)}
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2">Earliest Available Start Date *</label>
                <input
                  type="date"
                  className="border rounded px-4 py-2 w-full"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2">Route Preference</label>
                <select
                  className="border rounded px-4 py-2 w-full"
                  value={formData.routePreference}
                  onChange={(e) => updateFormData('routePreference', e.target.value)}
                >
                  <option value="">Select Preference</option>
                  <option value="local">Local (Home Daily)</option>
                  <option value="regional">Regional (Home Weekly)</option>
                  <option value="otr">Over-the-Road (2-3 weeks out)</option>
                  <option value="dedicated">Dedicated Route</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 5: References */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Professional References</h2>
              <p className="text-gray-600 mb-4">Please provide 2 professional references</p>
              
              {formData.references.map((ref, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-3">Reference {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      className="border rounded px-4 py-2"
                      value={ref.name}
                      onChange={(e) => updateNestedData('references', index, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Relationship *"
                      className="border rounded px-4 py-2"
                      value={ref.relationship}
                      onChange={(e) => updateNestedData('references', index, 'relationship', e.target.value)}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      className="border rounded px-4 py-2"
                      value={ref.phone}
                      onChange={(e) => updateNestedData('references', index, 'phone', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Years Known *"
                      className="border rounded px-4 py-2"
                      value={ref.yearsKnown}
                      onChange={(e) => updateNestedData('references', index, 'yearsKnown', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 6: Review and Submit */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Review & Submit</h2>
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                <p className="font-semibold">Please review your information before submitting</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="border-b pb-3">
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  <p>{formData.firstName} {formData.middleName} {formData.lastName}</p>
                  <p>{formData.email} | {formData.phone}</p>
                  <p>{formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                </div>

                <div className="border-b pb-3">
                  <h3 className="font-semibold text-lg">License Information</h3>
                  <p>CDL: {formData.licenseNumber} ({formData.licenseState})</p>
                  <p>Class: {formData.licenseClass}</p>
                  <p>Endorsements: {formData.endorsements.join(', ') || 'None'}</p>
                </div>

                <div className="border-b pb-3">
                  <h3 className="font-semibold text-lg">Experience</h3>
                  <p>Years: {formData.yearsExperience}</p>
                  <p>Equipment: {formData.truckTypes.join(', ') || 'None selected'}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <label className="flex items-start gap-3 mb-3">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={formData.certifyTruth}
                    onChange={(e) => updateFormData('certifyTruth', e.target.checked)}
                  />
                  <span className="text-sm">
                    I certify that all information provided in this application is true and complete to the best of my knowledge. I understand that any false information or omission may disqualify me from further consideration for employment and may result in termination if discovered at a later date.
                  </span>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={formData.authorizeBackground}
                    onChange={(e) => updateFormData('authorizeBackground', e.target.checked)}
                  />
                  <span className="text-sm">
                    I authorize investigation of all statements contained in this application and authorize my previous employers to provide information regarding my employment. I release all parties from liability for any damage that may result from furnishing information to you.
                  </span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.certifyTruth || !formData.authorizeBackground || isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold text-lg ${
                  formData.certifyTruth && formData.authorizeBackground && !isSubmitting
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
              currentStep === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < steps.length - 1 && (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
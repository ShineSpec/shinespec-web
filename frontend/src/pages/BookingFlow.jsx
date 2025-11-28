import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  ChevronRight, 
  Home,
  Star,
  Check,
  ArrowLeft,
  AlertCircle,
  User,
  CreditCard,
  Building,
  Phone,
  Mail,
  ChevronDown,
  Info,
  X
} from 'lucide-react';

const FormalBookingFlow = ({ selectedService, onClose }) => {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showWorkerProfile, setShowWorkerProfile] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    serviceType: selectedService?.label || 'Indoor Services',
    homeSize: 'medium',
    extraTasks: [],
    hoursNeeded: 5.5,
    frequency: 'one-time',
    scheduledDate: '',
    scheduledTime: '',
    notes: '',
    paymentMethod: 'credit-card',
  });
  const [loading, setLoading] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Update serviceType when selectedService changes
  useEffect(() => {
    if (selectedService?.label) {
      setBookingDetails(prev => ({
        ...prev,
        serviceType: selectedService.label
      }));
    }
  }, [selectedService]);

  // Mock workers data
  const mockWorkers = [
    {
      id: 1,
      name: 'Polite Mutumbami',
      rating: 98,
      jobsCompleted: 293,
      experience: 'Hospitality',
      avatar: '👤',
      bio: 'I live in Protea Hoogte and grew up in Harare, Zimbabwe. I have been doing domestic work for 4 years. My previous employers have described me as a hard working, honest and trustworthy person.',
      reviews: [
        { name: 'Derick', date: '2023-11-03', text: 'Thank you great experience. Very good manners thank you.' },
        { name: 'Lerato', date: '2023-10-16', text: 'Thank you Polite. I appreciate your help.' }
      ]
    },
    {
      id: 2,
      name: 'Anthia Jooste',
      rating: 96,
      jobsCompleted: 85,
      experience: 'Hospitality',
      avatar: '👤',
      bio: 'Experienced professional with attention to detail.',
      reviews: []
    },
    {
      id: 3,
      name: 'Maina Mahlangu',
      rating: 97,
      jobsCompleted: 614,
      experience: 'Hospitality',
      avatar: '👤',
      bio: 'Highly experienced domestic worker.',
      reviews: []
    }
  ];

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setAddresses(data || []);
        const defaultAddr = data.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        } else if (data.length === 1) {
          setSelectedAddress(data[0]);
        }
      }
    } catch (err) {
      console.error('Fetch addresses error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedAddress) {
      alert('Please select an address to continue');
      return;
    }
    if (step === 2 && !selectedWorker) {
      alert('Please select a worker or choose auto-assign');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onClose && typeof onClose === 'function') {
      onClose();
    } else {
      window.history.back();
    }
  };

  const handleSubmitBooking = async () => {
    try {
      setLoading(true);
      
      const bookingData = {
        serviceType: bookingDetails.serviceType,
        address: {
          formattedAddress: selectedAddress.formattedAddress,
          unitNumber: selectedAddress.unitNumber || '',
          addressId: selectedAddress._id
        },
        customTasks: bookingDetails.extraTasks,
        hoursNeeded: bookingDetails.hoursNeeded,
        frequency: bookingDetails.frequency,
        scheduledDate: bookingDetails.scheduledDate,
        scheduledTime: bookingDetails.scheduledTime,
        notes: bookingDetails.notes,
        preferredProvider: selectedWorker ? selectedWorker.id : 'auto-assign',
        totalCost: calculateTotal(),
        payment: {
          method: bookingDetails.paymentMethod,
          status: 'pending'
        }
      };

      const res = await fetch('http://localhost:5000/api/auth/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const data = await res.json();
      // Move to confirmation step instead of closing
      setStep(4);
    } catch (error) {
      console.error('Submit booking error:', error);
      alert('❌ Failed to create booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const baseRate = 150;
    const subtotal = bookingDetails.hoursNeeded * baseRate;
    const serviceFee = subtotal * 0.15;
    return Math.round(subtotal + serviceFee);
  };

  const homeSizes = [
    { value: 'small', label: 'Small Home: 1-2 Bedrooms' },
    { value: 'medium', label: 'Medium Home: 3-4 Bedrooms' },
    { value: 'large', label: 'Large Home: 5+ Bedrooms' }
  ];

  // Service-specific extra tasks
  const serviceExtraTasks = {
    'Indoor Services': [
      { id: 'fridge', label: 'Inside Fridge', icon: '/fridge.png' },
      { id: 'oven', label: 'Inside Oven', icon: '/oven.png' },
      { id: 'cabinets', label: 'Inside Cabinets', icon: '/cabinets.png' },
      { id: 'windows-interior', label: 'Interior Windows', icon: '/window.png' },
      { id: 'walls', label: 'Interior Walls', icon: '/wall.png' },
      { id: 'ironing', label: 'Ironing', icon: '/ironing.png' },
      { id: 'laundry', label: 'Laundry', icon: '/laundry.png' },
      { id: 'carpet-cleaning', label: 'Carpet Cleaning', icon: '/cabinets.png' }
    ],
    'Outdoor Services': [
      { id: 'garden-maintenance', label: 'Garden Maintenance', icon: '/plants.png' },
      { id: 'pool-cleaning', label: 'Pool Cleaning', icon: '/window.png' },
      { id: 'patio-cleaning', label: 'Patio Cleaning', icon: '/wall.png' },
      { id: 'windows-exterior', label: 'Exterior Windows', icon: '/window.png' },
      { id: 'gutter-cleaning', label: 'Gutter Cleaning', icon: '/cabinets.png' },
      { id: 'driveway', label: 'Driveway Cleaning', icon: '/wall.png' },
      { id: 'fence-cleaning', label: 'Fence Cleaning', icon: '/wall.png' },
      { id: 'water-plants', label: 'Water Plants', icon: '/plants.png' }
    ],
    'Office Cleaning': [
      { id: 'desk-sanitization', label: 'Desk Sanitization', icon: '/cabinets.png' },
      { id: 'kitchen-area', label: 'Kitchen Area', icon: '/fridge.png' },
      { id: 'bathroom-deep', label: 'Bathroom Deep Clean', icon: '/oven.png' },
      { id: 'windows-office', label: 'Office Windows', icon: '/window.png' },
      { id: 'carpet-vacuum', label: 'Carpet Vacuuming', icon: '/cabinets.png' },
      { id: 'trash-removal', label: 'Trash Removal', icon: '/laundry.png' },
      { id: 'conference-room', label: 'Conference Room', icon: '/wall.png' },
      { id: 'electronics', label: 'Electronics Dusting', icon: '/cabinets.png' }
    ],
    'Moving Cleaning': [
      { id: 'deep-clean-all', label: 'Deep Clean All Rooms', icon: '/wall.png' },
      { id: 'fridge-freezer', label: 'Fridge & Freezer', icon: '/fridge.png' },
      { id: 'oven-stove', label: 'Oven & Stove', icon: '/oven.png' },
      { id: 'all-cabinets', label: 'All Cabinets', icon: '/cabinets.png' },
      { id: 'all-windows', label: 'All Windows', icon: '/window.png' },
      { id: 'wall-marks', label: 'Remove Wall Marks', icon: '/wall.png' },
      { id: 'carpet-steam', label: 'Carpet Steam Clean', icon: '/cabinets.png' },
      { id: 'balcony-patio', label: 'Balcony/Patio', icon: '/wall.png' }
    ],
    'Laundry & Ironing': [
      { id: 'wash-fold', label: 'Wash & Fold', icon: '/laundry.png' },
      { id: 'ironing-service', label: 'Ironing Service', icon: '/ironing.png' },
      { id: 'delicate-items', label: 'Delicate Items', icon: '/laundry.png' },
      { id: 'bed-linen', label: 'Bed Linen', icon: '/laundry.png' },
      { id: 'towels', label: 'Towels', icon: '/laundry.png' },
      { id: 'curtains', label: 'Curtains', icon: '/window.png' },
      { id: 'steam-press', label: 'Steam Pressing', icon: '/ironing.png' },
      { id: 'hang-fold', label: 'Hang & Fold', icon: '/laundry.png' }
    ],
    'Mom\'s Helper': [
      { id: 'meal-prep', label: 'Meal Prep', icon: '/fridge.png' },
      { id: 'children-pickup', label: 'Children Pickup', icon: '/cabinets.png' },
      { id: 'light-cleaning', label: 'Light Cleaning', icon: '/wall.png' },
      { id: 'laundry-kids', label: 'Kids Laundry', icon: '/laundry.png' },
      { id: 'organize', label: 'Organizing', icon: '/cabinets.png' },
      { id: 'grocery-help', label: 'Grocery Help', icon: '/fridge.png' },
      { id: 'play-supervision', label: 'Play Supervision', icon: '/plants.png' },
      { id: 'homework-help', label: 'Homework Help', icon: '/cabinets.png' }
    ],
    'Elder Care': [
      { id: 'companion', label: 'Companionship', icon: '/plants.png' },
      { id: 'medication-remind', label: 'Medication Reminders', icon: '/cabinets.png' },
      { id: 'meal-prep-elder', label: 'Meal Preparation', icon: '/fridge.png' },
      { id: 'light-exercise', label: 'Light Exercise', icon: '/plants.png' },
      { id: 'errands', label: 'Run Errands', icon: '/laundry.png' },
      { id: 'appointments', label: 'Appointment Transport', icon: '/cabinets.png' },
      { id: 'reading', label: 'Reading Assistance', icon: '/wall.png' },
      { id: 'housekeeping', label: 'Light Housekeeping', icon: '/wall.png' }
    ],
    'Express Cleaning': [
      { id: 'quick-vacuum', label: 'Quick Vacuum', icon: '/cabinets.png' },
      { id: 'surface-wipe', label: 'Surface Wipe Down', icon: '/wall.png' },
      { id: 'bathroom-quick', label: 'Bathroom Quick Clean', icon: '/oven.png' },
      { id: 'kitchen-quick', label: 'Kitchen Quick Clean', icon: '/fridge.png' },
      { id: 'trash-out', label: 'Trash Take Out', icon: '/laundry.png' },
      { id: 'dish-washing', label: 'Dish Washing', icon: '/oven.png' },
      { id: 'floor-sweep', label: 'Floor Sweeping', icon: '/wall.png' },
      { id: 'tidy-up', label: 'General Tidy Up', icon: '/cabinets.png' }
    ]
  };

  // Get extra tasks for current service
  const extraTasksOptions = serviceExtraTasks[bookingDetails.serviceType] || serviceExtraTasks['Indoor Services'];

  const timeSlots = [
    '07:00 - 07:30', '07:30 - 08:00', '08:00 - 08:30', '08:30 - 09:00',
    '09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00',
    '11:00 - 11:30', '11:30 - 12:00', '12:00 - 12:30', '12:30 - 13:00'
  ];

  // Step 1: Booking Details
  const BookingDetailsStep = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add details about your booking</h2>
              
              {/* Address Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Service Address</label>
                {addresses.length === 0 ? (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600"
                  >
                    <Plus className="w-5 h-5" />
                    Add Address
                  </button>
                ) : (
                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <button
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedAddress?._id === addr._id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MapPin className={`w-5 h-5 ${selectedAddress?._id === addr._id ? 'text-blue-500' : 'text-gray-400'}`} />
                            <div>
                              <p className="font-medium text-gray-900">{addr.formattedAddress}</p>
                              {addr.unitNumber && <p className="text-sm text-gray-600">Unit: {addr.unitNumber}</p>}
                            </div>
                          </div>
                          {selectedAddress?._id === addr._id && <Check className="w-5 h-5 text-blue-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Home Size */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">How big is your home?</label>
                <div className="relative">
                  <select
                    value={bookingDetails.homeSize}
                    onChange={(e) => setBookingDetails({...bookingDetails, homeSize: e.target.value})}
                    className="w-full p-4 pr-10 border-2 border-gray-200 rounded-lg appearance-none focus:border-blue-500 focus:outline-none bg-white"
                  >
                    {homeSizes.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Extra Tasks */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Extra Tasks</label>
                <div className="grid grid-cols-4 gap-3">
                  {extraTasksOptions.map(task => (
                    <button
                      key={task.id}
                      onClick={() => {
                        const tasks = bookingDetails.extraTasks.includes(task.id)
                          ? bookingDetails.extraTasks.filter(t => t !== task.id)
                          : [...bookingDetails.extraTasks, task.id];
                        setBookingDetails({...bookingDetails, extraTasks: tasks});
                      }}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        bookingDetails.extraTasks.includes(task.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <img 
                        src={task.icon} 
                        alt={task.label}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-10 h-10 bg-gray-100 rounded-lg hidden items-center justify-center text-xs text-gray-400">
                        {task.label.substring(0, 2)}
                      </div>
                      <span className="text-xs text-center font-medium">{task.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">How Long?</label>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <span className="font-medium">Hours</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setBookingDetails({...bookingDetails, hoursNeeded: Math.max(2, bookingDetails.hoursNeeded - 0.5)})}
                      className="w-10 h-10 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-all font-bold text-xl"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-gray-900 w-16 text-center">
                      {bookingDetails.hoursNeeded}
                    </span>
                    <button
                      onClick={() => setBookingDetails({...bookingDetails, hoursNeeded: Math.min(8, bookingDetails.hoursNeeded + 0.5)})}
                      className="w-10 h-10 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-all font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select start date:</label>
                  <input
                    type="date"
                    value={bookingDetails.scheduledDate}
                    onChange={(e) => setBookingDetails({...bookingDetails, scheduledDate: e.target.value})}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select start time:</label>
                  <div className="relative">
                    <select
                      value={bookingDetails.scheduledTime}
                      onChange={(e) => setBookingDetails({...bookingDetails, scheduledTime: e.target.value})}
                      className="w-full p-4 pr-10 border-2 border-gray-200 rounded-lg appearance-none focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Add specific instructions</label>
                <textarea
                  value={bookingDetails.notes}
                  onChange={(e) => setBookingDetails({...bookingDetails, notes: e.target.value})}
                  placeholder="Add your notes here"
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div className="sticky top-8">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-lg mb-4">Booking Details</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">Where:</p>
                      <p className="font-medium text-sm">{selectedAddress?.formattedAddress || 'No address selected'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <Home className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">What:</p>
                      <p className="font-medium text-sm">{bookingDetails.serviceType}</p>
                    </div>
                  </div>

                  {bookingDetails.scheduledDate && bookingDetails.scheduledTime && (
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">When:</p>
                        <p className="font-medium text-sm">
                          {new Date(bookingDetails.scheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} @ {bookingDetails.scheduledTime}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-900 text-white p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">Total hours</p>
                    <p className="text-2xl font-bold">{bookingDetails.hoursNeeded}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80">Est. Price</p>
                    <p className="text-2xl font-bold">R{Math.round(bookingDetails.hoursNeeded * 150)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-900 mb-1">Book more, save more!</p>
                  <p className="text-yellow-800 text-xs">1-2 days: No service fee</p>
                  <p className="text-yellow-800 text-xs">3-4 days: Up to 15% off</p>
                  <p className="text-yellow-800 text-xs">5+ days: Up to 28% off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Choose Worker
  const ChooseWorkerStep = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left - Summary */}
          <div>
            <div className="sticky top-8">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-lg mb-4">Booking Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 pb-2 border-b">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Where:</p>
                      <p className="font-medium">{selectedAddress?.formattedAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pb-2 border-b">
                    <Home className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">What:</p>
                      <p className="font-medium">{bookingDetails.serviceType}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pb-2 border-b">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">When:</p>
                      <p className="font-medium">
                        {new Date(bookingDetails.scheduledDate).toLocaleDateString('en-GB')} @ {bookingDetails.scheduledTime}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-900 text-white p-4 rounded-lg mt-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total hours</span>
                    <span className="font-bold">{bookingDetails.hoursNeeded}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm">Booking Price</span>
                    <span className="font-bold">R{Math.round(bookingDetails.hoursNeeded * 150)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedWorker({ id: 'auto', name: 'Auto-assign' });
                  handleNext();
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-all"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <User className="w-5 h-5" />
                  <span className="font-bold">Choose for me</span>
                </div>
                <p className="text-xs opacity-90">Our team will find a worker that can help you</p>
              </button>
            </div>
          </div>

          {/* Right - Workers List */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose your worker</h2>
            <div className="space-y-4">
              {mockWorkers.map(worker => (
                <div key={worker.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-teal-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                      {worker.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{worker.name}</h3>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold">{worker.rating}%</span>
                          <span className="text-xs text-gray-600">Recommend</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {worker.jobsCompleted} Jobs Completed
                        </div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => setShowWorkerProfile(worker)}
                          className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-all text-sm font-semibold"
                        >
                          View profile
                        </button>
                        <button
                          onClick={() => {
                            setSelectedWorker(worker);
                            handleNext();
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold"
                        >
                          Choose me
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Worker Profile Modal */}
      {showWorkerProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold">SweepStar Profile</h3>
              <button onClick={() => setShowWorkerProfile(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
                  {showWorkerProfile.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{showWorkerProfile.name}</h3>
                  <div className="flex gap-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Recommend</p>
                      <p className="text-xl font-bold">{showWorkerProfile.rating}%</p>
                      <p className="text-xs text-gray-600">({showWorkerProfile.reviews.length} reviews)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jobs Completed</p>
                      <p className="text-xl font-bold">{showWorkerProfile.jobsCompleted}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-2">Experience</h4>
                <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-blue-500" />
                  <span>{showWorkerProfile.experience}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-2">About Me</h4>
                <p className="text-gray-700 leading-relaxed">{showWorkerProfile.bio}</p>
              </div>

              {showWorkerProfile.reviews.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold mb-3">Reviews</h4>
                  <div className="space-y-3">
                    {showWorkerProfile.reviews.map((review, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                            {review.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{review.name}</p>
                            <p className="text-xs text-gray-600">{review.date}</p>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedWorker(showWorkerProfile);
                    setShowWorkerProfile(null);
                    handleNext();
                  }}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all font-semibold"
                >
                  Choose me
                </button>
                <button
                  onClick={() => setShowWorkerProfile(null)}
                  className="flex-1 border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Step 3: Payment
  const PaymentStep = () => {
    const subtotal = Math.round(bookingDetails.hoursNeeded * 150);
    const serviceFee = Math.round(subtotal * 0.15);
    const total = subtotal + serviceFee;

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Left - Summary */}
            <div className="md:col-span-2">
              <div className="sticky top-8">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Booking Details</h3>
                  
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex items-start gap-2 pb-3 border-b">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">Where:</p>
                        <p className="font-medium">{selectedAddress?.formattedAddress}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 pb-3 border-b">
                      <Home className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">What:</p>
                        <p className="font-medium">{bookingDetails.serviceType}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pb-3 border-b">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">When:</p>
                        <p className="font-medium">
                          {new Date(bookingDetails.scheduledDate).toLocaleDateString('en-GB', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'short' 
                          })} @ {bookingDetails.scheduledTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pb-3">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">Worker:</p>
                        <p className="font-medium">{selectedWorker?.name || 'Auto-assigned'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total hours</span>
                      <span className="font-medium">{bookingDetails.hoursNeeded}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">R{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Service Fee</span>
                        <Info className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-medium">R{serviceFee}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-2xl text-blue-500">R{total}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Info className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <p className="text-xs text-gray-600">
                      Payment clears immediately (no delay to your order)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Payment Form */}
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-4">Total to pay: <span className="font-bold text-xl text-gray-900">R{total}.00</span></p>
                
                <div className="space-y-3 mb-6">
                  {/* Credit Card Option */}
                  <button
                    onClick={() => setBookingDetails({...bookingDetails, paymentMethod: 'credit-card'})}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                      bookingDetails.paymentMethod === 'credit-card'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        bookingDetails.paymentMethod === 'credit-card'
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {bookingDetails.paymentMethod === 'credit-card' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Credit Card / UCount</span>
                    </div>
                  </button>

                  {/* EFT Option */}
                  <button
                    onClick={() => setBookingDetails({...bookingDetails, paymentMethod: 'eft'})}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                      bookingDetails.paymentMethod === 'eft'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        bookingDetails.paymentMethod === 'eft'
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {bookingDetails.paymentMethod === 'eft' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <Building className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">EFT</span>
                    </div>
                  </button>

                  {/* SnapScan Option */}
                  <button
                    onClick={() => setBookingDetails({...bookingDetails, paymentMethod: 'snapscan'})}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      bookingDetails.paymentMethod === 'snapscan'
                          ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          bookingDetails.paymentMethod === 'snapscan'
                            ? 'border-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {bookingDetails.paymentMethod === 'snapscan' && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <span className="font-medium">SnapScan</span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Payment Form Based on Selection */}
                {bookingDetails.paymentMethod === 'credit-card' && (
                  <div className="space-y-4 border-t-2 border-gray-100 pt-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        maxLength="19"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                          maxLength="3"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {bookingDetails.paymentMethod === 'snapscan' && (
                  <div className="border-t-2 border-gray-100 pt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="font-semibold text-blue-900 mb-2">Pay using Snapscan</p>
                      <p className="text-sm text-blue-800">
                        Make a secure payment of <span className="font-bold">R{total}</span> using SnapScan. 
                        Payment clears immediately (no delay to your order)
                      </p>
                    </div>
                    <div className="flex justify-center py-8">
                      <div className="text-center">
                        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                          <span className="text-6xl">📱</span>
                        </div>
                        <p className="text-sm text-gray-600">SnapScan QR code will appear here</p>
                      </div>
                    </div>
                  </div>
                )}

                {bookingDetails.paymentMethod === 'eft' && (
                  <div className="border-t-2 border-gray-100 pt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="font-semibold text-blue-900 mb-2">Bank Transfer Details</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-800">Bank:</span>
                          <span className="font-medium">Standard Bank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Account Name:</span>
                          <span className="font-medium">SweepSouth Ltd</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Account Number:</span>
                          <span className="font-medium">123456789</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Reference:</span>
                          <span className="font-medium">BOOK-{Date.now()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Secure Payment</p>
                    <p>Your payment information is encrypted and secure. We never store your full card details.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 4: Confirmation
  const ConfirmationStep = () => {
    const total = calculateTotal();

    return (
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-3xl mx-auto p-8 py-16">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">Your booking has been successfully created</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h3 className="font-bold text-xl mb-6 pb-4 border-b-2 border-gray-100">Booking Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-500" />  
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Service Location</p>
                  <p className="font-semibold text-gray-900">{selectedAddress?.formattedAddress}</p>
                  {selectedAddress?.unitNumber && (
                    <p className="text-sm text-gray-600">Unit: {selectedAddress.unitNumber}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Service Type</p>
                  <p className="font-semibold text-gray-900">{bookingDetails.serviceType}</p>
                  <p className="text-sm text-gray-600">{bookingDetails.hoursNeeded} hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Scheduled Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(bookingDetails.scheduledDate).toLocaleDateString('en-GB', { 
                      weekday: 'long',
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{bookingDetails.scheduledTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Service Provider</p>
                  <p className="font-semibold text-gray-900">{selectedWorker?.name || 'Auto-assigned by team'}</p>
                </div>
              </div>

              {bookingDetails.extraTasks.length > 0 && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Extra Tasks</p>
                    <div className="flex flex-wrap gap-2">
                      {bookingDetails.extraTasks.map(task => (
                        <span key={task} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          {extraTasksOptions.find(t => t.id === task)?.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t-2 border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {bookingDetails.paymentMethod.replace('-', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-3xl font-bold text-blue-500">R{total}</span>
              </div>
            </div>
          </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-2">What happens next?</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• You'll receive a confirmation email shortly</li>
                  <li>• Our team will contact you to confirm final details</li>
                  <li>• Your service provider will arrive at the scheduled time</li>
                  <li>• You can manage your booking from your dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                if (onClose && typeof onClose === 'function') {
                  onClose();
                } else {
                  window.location.href = '/dashboard';
                }
              }}
              className="flex-1 bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600 transition-all font-semibold text-lg"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  };

  const stepComponents = [
    BookingDetailsStep,
    ChooseWorkerStep,
    PaymentStep,
    ConfirmationStep
  ];

  const CurrentStep = stepComponents[step - 1];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {step < 4 && (
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {step === 4 ? 'Booking Confirmed' : `Book ${selectedService?.label || 'Service'}`}
                </h1>
                <p className="text-sm text-gray-600">
                  {step === 1 && 'Step 1 of 3: Service Details'}
                  {step === 2 && 'Step 2 of 3: Choose Worker'}
                  {step === 3 && 'Step 3 of 3: Payment'}
                  {step === 4 && 'Your booking is complete'}
                </p>
              </div>
            </div>
            {step < 4 && (
              <button
                onClick={() => {
                  if (onClose && typeof onClose === 'function') {
                    onClose();
                  } else {
                    window.history.back();
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {step < 4 && (
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s, idx) => (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step > s 
                        ? 'bg-blue-500 text-white' 
                        : step === s 
                        ? 'bg-blue-500 text-white ring-4 ring-blue-100' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > s ? <Check className="w-5 h-5" /> : s}
                    </div>
                    <span className={`text-sm font-medium hidden sm:block ${
                      step >= s ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {s === 1 && 'Details'}
                      {s === 2 && 'Worker'}
                      {s === 3 && 'Payment'}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className={`flex-1 h-2 rounded-full transition-all ${
                      step > s ? 'bg-blue-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <CurrentStep />

      {/* Footer */}
      {step < 4 && (
        <div className="border-t-2 border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
              >
                Back
              </button>
              <button
                onClick={step === 3 ? handleSubmitBooking : handleNext}
                disabled={loading || (step === 1 && !selectedAddress) || (step === 1 && !bookingDetails.scheduledDate) || (step === 1 && !bookingDetails.scheduledTime)}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {step === 3 ? 'Confirm & Pay' : 'Continue'}
                    {step < 3 && <ChevronRight className="w-5 h-5" />}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormalBookingFlow;
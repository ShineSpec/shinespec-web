import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Calendar, 
  CheckCircle,
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
  X,
  AlertTriangle,
  Lock
} from 'lucide-react';
import PaymentModal from './PaymentModal';
import AIServiceMatcher from './AIServiceMatcher';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { getAuthToken } from '../lib/auth';

const FormalBookingFlow = ({ selectedService, onClose }) => {
  const [step, setStep] = useState(1);
  const { user: clerkUser } = useUser();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showWorkerProfile, setShowWorkerProfile] = useState(null);
  const [aiSelectedWorker, setAiSelectedWorker] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [typedExplanation, setTypedExplanation] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [multipleBookings, setMultipleBookings] = useState([]); // Store multiple bookings
  const [showBookAnother, setShowBookAnother] = useState(false); // Show option to book another
  const [bookingDetails, setBookingDetails] = useState({
    serviceType: selectedService?.label || 'Indoor Services',
    homeSize: 'medium',
    extraTasks: [],
    hoursNeeded: 5,
    frequency: 'one-time',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow's date
    scheduledTime: '',
    notes: '',
    paymentMethod: 'credit-card',
  });
  const [loading, setLoading] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ query: '', apartment: '', selectedLocation: null, suggestions: [] });
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const contentRef = useRef(null);
  const hoursRef = useRef(null);
  const addressInputRef = useRef(null);
  const notesRef = useRef("");
  const customRequestRef = useRef("");
  const { isLoaded, isSignedIn } = useAuth();
const { openSignIn } = useClerk();
const isGuest = !isSignedIn;
const [token, setToken] = useState(null);
const [showServiceVideo, setShowServiceVideo] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Check for payment success on mount (when returning from payment gateway)
  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get("reference");
  
    if (reference) {
      verifyPayment(reference);
    }
  }, []);

useEffect(() => {
  let cancelled = false;
  (async () => {
    const t = isLoaded && isSignedIn ? await getAuthToken() : null;
    if (!cancelled) setToken(t);
    if (t) sessionStorage.removeItem('bookingDraft');
  })();
  return () => { cancelled = true; };
}, [isLoaded, isSignedIn]);

const promptSignIn = () => {
  sessionStorage.setItem(
    'bookingDraft',
    JSON.stringify({ bookingDetails, selectedAddress, savedAt: Date.now() })
  );
  openSignIn({
    fallbackRedirectUrl: window.location.href,
    signUpFallbackRedirectUrl: window.location.href
  });
};

// restore the draft after a reload (only if recent and for the same service)
useEffect(() => {
  const raw = sessionStorage.getItem('bookingDraft');
  if (!raw) return;
  sessionStorage.removeItem('bookingDraft');
  try {
    const d = JSON.parse(raw);
    const recent = Date.now() - (d.savedAt || 0) < 15 * 60 * 1000;
    const sameService =
      !selectedService?.label || d.bookingDetails?.serviceType === selectedService.label;
    if (!recent || !sameService) return;
    if (d.bookingDetails) setBookingDetails((p) => ({ ...p, ...d.bookingDetails }));
    if (d.selectedAddress) setSelectedAddress(d.selectedAddress);
  } catch {}
}, []);



  const PRICING_STRUCTURE = {
    'Indoor Services': {
      3: 5,
      4: 305,
      5: 320,
      6: 335,
      7: 350,
      8: 365
    },
    'Outdoor Services': {
      3.5: 350,
      4: 400,
      4.5: 450,
      5: 500,
      5.5: 550,
      6: 600,
      6.5: 650,
      7: 700,
      7.5: 750,
      8: 800
    },
    // Add other services with their default pricing if needed
    'Office Cleaning': {
      3: 350,
      3.5: 400,
      4: 450,
      4.5: 500,
      5: 550,
      5.5: 600,
      6: 650,
      6.5: 700,
      7: 750,
      7.5: 800,
      8: 850
    },
    'Moving Cleaning': {
      3: 300,
      3.5: 350,
      4: 400,
      4.5: 450,
      5: 500,
      5.5: 550,
      6: 600,
      6.5: 650,
      7: 700,
      7.5: 750,
      8: 800
    },
    'Laundry & Ironing': {
    small: { hours: 3, price: 350, loads: '1–2 wash loads + 1 ironing', items: '10–15' },
    family: { hours: 4, price: 420, loads: '3–4 wash loads + 2 ironing', items: '16–30' },
    busyWeek: { hours: 5, price: 490, loads: '5–6 wash loads + 3 ironing', items: '31–45' },
    bigWash: { hours: 6, price: 560, loads: '7–8 wash loads + 4 ironing', items: '46–60' },
    mega: { hours: 7, price: 630, loads: '9–10 wash loads + 5 ironing', items: '61–75' },
    unlimited: { hours: 8, price: 700, loads: '10+ wash loads + 6 ironing', items: '75+' }
  },
    'Mom\'s Helper': {
      3: 360,
      3.5: 450,
      4: 500,
      4.5: 550,
      5: 600,
      5.5: 650,
      6: 700,
      6.5: 750,
      7: 800,
      7.5: 850,
      8: 900
    },
    'Elder Care': {
      3: 400,
      3.5: 435,
      4: 470,
      4.5: 505,
      5: 540,
      5.5: 575,
      6: 610,
      6.5: 645,
      7: 680,
      7.5: 715,
      8: 750
    },
    'Event Cleaning': {
    small: {
      base: 1500,
      preSetup: 400,
      duringSupport: 600,
      postDeepClean: 800,
      fullPackage: 3300,
      crewSize: '3–4 cleaners'
    },
    medium: {
      base: 3500,
      preSetup: 1000,
      duringSupport: 1500,
      postDeepClean: 2000,
      fullPackage: 8000,
      crewSize: '6–8 cleaners'
    },
    large: {
      base: 8000,
      preSetup: 2000,
      duringSupport: 3000,
      postDeepClean: 4000,
      fullPackage: 17000,
      crewSize: '10–12 cleaners'
    },
    extraLarge: {
      base: 15000,
      preSetup: 3500,
      duringSupport: 5000,
      postDeepClean: 7000,
      fullPackage: 30500,
      crewSize: '15–20+ cleaners'
    }
  }
  };

  const verifyPayment = async (reference) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/payments/payfast/verify?reference=${encodeURIComponent(reference)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${await getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      const data = await res.json();
  
      if (res.ok && data.success) {
        // Payment verified successfully
        setStep(4);
        // Clean URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // Payment verification failed
        console.error('Payment verification failed:', data.message);
        alert(`Payment verification failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Failed to verify payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (selectedService?.label) {
      setBookingDetails(prev => ({
        ...prev,
        serviceType: selectedService.label
      }));
    }
  }, [selectedService]);

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]);

  // REPLACE the existing useEffect around line 240 with this:

useEffect(() => {
  if (!isGuest && token && bookingDetails.serviceType && selectedAddress) {
    console.log('🔄 Fetching workers for address:', selectedAddress?.formattedAddress);
    fetchWorkers();
  }
}, [isGuest, token, bookingDetails.serviceType, selectedAddress?.formattedAddress]); // ADD selectedAddress dependency

// Also add this additional useEffect to handle Step 2 specifically
useEffect(() => {
  // If user just logged in (token changed) and on Step 2, fetch workers
  if (token && !isGuest && step === 2 && workers.length === 0 && selectedAddress) {
    console.log('🔄 Step 2: Fetching workers after login');
    fetchWorkers();
  }
}, [token, isGuest, step, selectedAddress?.formattedAddress]);

useEffect(() => {
  if (selectedAddress) {
    console.log('📍 Selected address changed to:', selectedAddress.formattedAddress);
    console.log('   Full address object:', selectedAddress);
  }
}, [selectedAddress]);
  
// Maintain scroll position when bookingDetails changes
useEffect(() => {
  if (contentRef.current && step === 1) {
    const savedScroll = sessionStorage.getItem('bookingScrollPos');
    if (savedScroll) {
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = parseInt(savedScroll, 10);
          sessionStorage.removeItem('bookingScrollPos');
        }
      });
    }
  }
}, [bookingDetails, step]); // Watch entire bookingDetails object

useEffect(() => {
  // If user just logged in (token changed) and on Step 2, fetch workers
  if (token && !isGuest && step === 2 && workers.length === 0) {
    fetchWorkers();
  }
}, [token, isGuest, step]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/addresses`, {
        headers: { Authorization: `Bearer ${await getAuthToken()}` },
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

  const restoreScroll = () => {
    if (!contentRef.current) return;
    const saved = sessionStorage.getItem("bookingScroll");
    if (!saved) return;
    
    
    requestAnimationFrame(() => {
    contentRef.current.scrollTop = Number(saved);
    sessionStorage.removeItem("bookingScroll");
    });
    };
  // Restore scroll only when step changes
useEffect(() => {
  restoreScroll();
  }, [step]);
  
  
  // ====== COMMITTERS ======
  const commitBookingText = () => {
  setBookingDetails(prev => ({
  ...prev,
  notes: notesRef.current,
  customRequest: customRequestRef.current,
  }));
  };

  useEffect(() => {
    if (!aiExplanation) return;
  
    let index = 0;
    setTypedExplanation("");
  
    const interval = setInterval(() => {
      setTypedExplanation(aiExplanation.slice(0, index));
      index++;
      if (index > aiExplanation.length) clearInterval(interval);
    }, 18); // typing speed ms
  
    return () => clearInterval(interval);
  }, [aiExplanation]);

  // Update SEO meta tags based on selected service
useEffect(() => {
  if (bookingDetails.serviceType && SERVICE_SEO[bookingDetails.serviceType]) {
    const seo = SERVICE_SEO[bookingDetails.serviceType];
    
    // Update title
    document.title = seo.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = seo.description;
    
    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = seo.title;
    
    // Update Open Graph description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.content = seo.description;
    
    // Update Twitter title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.name = 'twitter:title';
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.content = seo.title;
    
    // Update Twitter description
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.name = 'twitter:description';
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.content = seo.description;
  }
  
  // Cleanup function to restore default meta tags when component unmounts
  return () => {
    document.title = 'ShineSpec | Book Trusted Service Professionals Online';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = 'Book reliable service professionals for home, office, and personal services with ShineSpec. Simple, trusted, and stress-free.';
    }
  };
}, [bookingDetails.serviceType]);

  // Fetch address suggestions from Mapbox
  useEffect(() => {
    if (!newAddress.query || newAddress.query.length < 3) {
      setNewAddress(prev => ({ ...prev, suggestions: [] }));
      return;
    }
  
    // Don't fetch if a location is already selected
    if (newAddress.selectedLocation) {
      setNewAddress(prev => ({ ...prev, suggestions: [] }));
      return;
    }
    
  
    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!MAPBOX_TOKEN) return;
  
    const fetchSuggestions = async () => {
      try {
        setLoadingAddress(true);
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            newAddress.query
          )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=za&limit=5`
        );
        const data = await res.json();
        const result = data.features?.map((item) => ({
          id: item.id,
          label: item.place_name,
        })) || [];
        setNewAddress(prev => ({ ...prev, suggestions: result }));
      } catch (err) {
        console.error("Mapbox Error:", err);
      } finally {
        setLoadingAddress(false);
      }
    };
  
    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [newAddress.query, newAddress.selectedLocation]); // Added selectedLocation dependency
  

  const handleSaveAddress = async () => {
    if (!newAddress.selectedLocation) {
      alert("Please select a valid address from the suggestions first.");
      return;
    }
  
    // For guests, create address object without addressId
    if (isGuest) {
      const guestAddress = {
        formattedAddress: newAddress.selectedLocation.label,
        unitNumber: newAddress.apartment || '',
        isGuest: true,
      };
      
      console.log('🏠 Guest address set:', guestAddress.formattedAddress);
      setSelectedAddress(guestAddress);
      
      // CLOSE MODAL AND RESET IMMEDIATELY
      setShowAddAddress(false);
      setNewAddress({ query: '', apartment: '', selectedLocation: null, suggestions: [] });
      return;
    }
  
    // For logged-in users, save to backend
    setSavingAddress(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/save-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({
          formattedAddress: newAddress.selectedLocation.label,
          unitNumber: newAddress.apartment || '',
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save address');
      }
  
      const data = await res.json();
      
      // CLOSE MODAL AND RESET FIRST (before state updates)
      setShowAddAddress(false);
      setNewAddress({ query: '', apartment: '', selectedLocation: null, suggestions: [] });
      
      // THEN update addresses and selection
      setAddresses(data.addresses || []);
      const newAddr = data.addresses[data.addresses.length - 1];
      
      console.log('🏠 New address saved and selected:', newAddr.formattedAddress);
      setSelectedAddress(newAddr);
      
      // IMPORTANT: Trigger worker refetch if on step 2
      if (step === 2 && !isGuest && token) {
        console.log('🔄 Refetching workers for newly saved address');
        setTimeout(() => fetchWorkers(), 200); // Small delay to ensure state updates
      }
      
    } catch (error) {
      console.error('Save address error:', error);
      alert('Failed to save address: ' + error.message);
      setSavingAddress(false);
    } finally {
      setSavingAddress(false);
    }
  };

  // Map booking service types to worker service types
  const serviceTypeMapping = {
    'Indoor Services': ['Indoor Cleaning'],
    'Outdoor Services': ['Outdoor Cleaning', 'Gardening'],
    'Office Cleaning': ['Office Cleaning'],
    'Moving Cleaning': ['Indoor Cleaning'],
    'Laundry & Ironing': ['Laundry & Ironing'],
    'Mom\'s Helper': ['Child Care', 'Cooking'],
    'Elder Care': ['Elder Care'],
    'Event Cleaning': ['Indoor Cleaning', 'Outdoor Cleaning']
  };

  const SERVICE_DESCRIPTIONS = {
  'Indoor Services': 'We clean all common areas in your home, including bedrooms, bathrooms, living rooms, and the kitchen. Shine Spec makes sure your space is fresh, tidy, and comfortable.',
  'Outdoor Services': 'It includes garden maintenance, pool cleaning, patio cleaning, exterior window washing, gutter cleaning, driveway cleaning, fence cleaning, and even dog walking. Shine Spec keeps your outdoor spaces fresh, tidy, and enjoyable.',
  'Office Cleaning': 'It includes thorough cleaning of office spaces such as desks, meeting rooms, common areas, kitchens, and bathrooms. Shine Spec keeps your workplace spotless, organized, and professional for both staff and visitors.',
  'Moving Cleaning': 'It includes a full clean of your home when moving in or out, covering bedrooms, bathrooms, kitchen, and living areas. Shine Spec makes sure your space is spotless and ready for a fresh start.',
  'Laundry & Ironing': 'It includes washing, drying, folding, and ironing of your clothes and linens. Shine Spec makes sure your laundry is fresh, neat, and ready to wear.',
  'Mom\'s Helper': 'It includes support with everyday household tasks such as tidying, laundry, meal prep, and childcare assistance. Shine Spec helps busy moms manage their homes with ease and peace of mind.',
  'Elder Care': 'It includes assistance with daily tasks such as light cleaning, meal preparation, companionship, and errands. Shine Spec provides caring support to help elders feel comfortable, safe, and independent at home.',
  'Event Cleaning': 'It includes cleaning before, during, and after events, covering venues, kitchens, bathrooms, and common areas. Shine Spec ensures your event space stays spotless and welcoming from start to finish.'
};

const SERVICE_VIDEOS = {
  'Indoor Services': 'EmkJJVpj4Js',
  'Outdoor Services': '1oFXbN3Ni2o',
  'Office Cleaning': 'UpB-CoBo3BU',
  'Moving Cleaning': 'kd8vbDC1Bbk',
  'Laundry & Ironing': 'QQsQuQuBNKU',
  'Mom\'s Helper': 'wY3ImwkM8Pw',
  'Elder Care': 'Bqiq0QfQ_wM',
  'Event Cleaning': 'EIwrseHY5pg'
};

const SERVICE_SEO = {
  'Indoor Services': {
    title: 'Indoor Cleaning Services | Trusted Home Cleaners – ShineSpec',
    description: 'Book reliable indoor cleaning services with trusted professionals. Easy online booking, flexible scheduling, and quality service with ShineSpec.'
  },
  'Outdoor Services': {
    title: 'Outdoor Cleaning & Yard Services | Trusted Professionals – ShineSpec',
    description: 'Find trusted outdoor service professionals for gardens, yards, and exterior spaces. Book reliable outdoor services easily with ShineSpec.'
  },
  'Office Cleaning': {
    title: 'Office Cleaning Services | Professional Workplace Cleaning – ShineSpec',
    description: 'Keep your workplace clean and professional. Book trusted office cleaning services with flexible scheduling through ShineSpec.'
  },
  'Moving Cleaning': {
    title: 'Move-In & Move-Out Cleaning Services | ShineSpec',
    description: 'Moving made easy with professional move-in and move-out cleaning services. Book trusted cleaners online with ShineSpec.'
  },
  'Laundry & Ironing': {
    title: 'Laundry & Ironing Services | Convenient Home Services – ShineSpec',
    description: 'Save time with professional laundry and ironing services. Book trusted service providers easily and stress-free with ShineSpec.'
  },
  'Mom\'s Helper': {
    title: 'Mom\'s Helper Services | Trusted Home Assistance – ShineSpec',
    description: 'Get reliable help at home with trusted mom\'s helper services. Flexible, caring assistance booked easily through ShineSpec.'
  },
  'Elder Care': {
    title: 'Elder Care Services | Trusted In-Home Care Providers – ShineSpec',
    description: 'Find compassionate and trusted elder care professionals for in-home assistance. Book reliable elder care services with ShineSpec.'
  },
  'Event Cleaning': {
    title: 'Event Cleaning Services | Before & After Event Cleaning – ShineSpec',
    description: 'Hosting an event? Book reliable event cleaning services before or after your event. Trusted professionals available through ShineSpec.'
  }
};

const fetchWorkers = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/approved`,
      {
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch workers");
      return;
    }

    const data = await response.json();
    
    // Filter workers by service type
    const requiredServiceTypes = serviceTypeMapping[bookingDetails.serviceType] || [];
    const filteredWorkers = requiredServiceTypes.length > 0
      ? data.filter(worker => {
          const workerServices = worker.serviceTypes || [];
          return requiredServiceTypes.some(service => 
            workerServices.includes(service)
          );
        })
      : data;
    
    // Extract location from user's address
    const userAddress = selectedAddress?.formattedAddress || '';
    console.log('🏠 User address:', userAddress);
    
    if (!userAddress) {
      console.log('❌ No user address available');
      setWorkers(filteredWorkers.slice(0, 5));
      return;
    }
    
    // Parse user address - MORE ROBUST PARSING
    const parseLocation = (address) => {
      // Common format: "Street, Suburb, City, Province PostalCode, Country"
      // Example: "1b Bevan Road, Sandton, Johannesburg, Gauteng 2191, South Africa"
      
      const parts = address.split(',').map(p => p.trim());
      
      let suburb = '';
      let city = '';
      let province = '';
      
      // Handle different address formats
      if (parts.length >= 5) {
        // Full format: Street, Suburb, City, Province+Postal, Country
        suburb = parts[1]?.toLowerCase() || '';
        city = parts[2]?.toLowerCase() || '';
        // Extract province from "Province PostalCode" format
        const provinceWithPostal = parts[3] || '';
        province = provinceWithPostal.split(/\s+\d/)[0]?.toLowerCase().trim() || '';
      } else if (parts.length === 4) {
        // Format: Street, Suburb, City, Province
        // OR: Street, City, Province+Postal, Country
        suburb = parts[1]?.toLowerCase() || '';
        city = parts[2]?.toLowerCase() || '';
        
        const lastPart = parts[3] || '';
        // Check if last part looks like province+postal or just province
        if (/\d{4}/.test(lastPart)) {
          province = lastPart.split(/\s+\d/)[0]?.toLowerCase().trim() || '';
        } else {
          province = lastPart.toLowerCase().trim();
        }
      } else if (parts.length === 3) {
        // Format: Street, Suburb, City
        // OR: Street, City, Province
        suburb = parts[1]?.toLowerCase() || '';
        city = parts[2]?.toLowerCase() || '';
      }
      
      // Clean up - remove numbers, extra spaces
      suburb = suburb.replace(/\d+/g, '').trim();
      city = city.replace(/\d+/g, '').trim();
      province = province.replace(/\d+/g, '').trim();
      
      return { suburb, city, province };
    };
    
    const userLocation = parseLocation(userAddress);
    console.log('📍 Parsed user location:', userLocation);
    
    // Fallback: try to find city/province in the full address string if parsing failed
    if (!userLocation.city || !userLocation.province) {
      const addressLower = userAddress.toLowerCase();
      
      // Common South African cities
      const cities = ['johannesburg', 'pretoria', 'cape town', 'durban', 'sandton', 
                      'centurion', 'midrand', 'randburg', 'roodepoort', 'soweto'];
      const provinces = ['gauteng', 'western cape', 'kwazulu-natal', 'eastern cape', 
                        'limpopo', 'mpumalanga', 'north west', 'northern cape', 'free state'];
      
      if (!userLocation.city) {
        for (const city of cities) {
          if (addressLower.includes(city)) {
            userLocation.city = city;
            console.log(`✅ Found city in address: ${city}`);
            break;
          }
        }
      }
      
      if (!userLocation.province) {
        for (const province of provinces) {
          if (addressLower.includes(province)) {
            userLocation.province = province;
            console.log(`✅ Found province in address: ${province}`);
            break;
          }
        }
      }
    }
    
    // Calculate location match score for each worker
    const workersWithScore = filteredWorkers.map(worker => {
      let locationScore = 0;
      
      // Get worker location data (handle null/undefined)
      const workerSuburb = (worker.suburb || '').toLowerCase().trim();
      const workerCity = (worker.city || '').toLowerCase().trim();
      const workerProvince = (worker.province || '').toLowerCase().trim();
      
      console.log(`\n👤 Worker: ${worker.fullName}`);
      console.log(`   Worker Location: Suburb="${workerSuburb}", City="${workerCity}", Province="${workerProvince}"`);
      console.log(`   User Location: Suburb="${userLocation.suburb}", City="${userLocation.city}", Province="${userLocation.province}"`);
      
      // Helper function for flexible string matching
      const matches = (str1, str2) => {
        if (!str1 || !str2) return false;
        
        // Normalize for comparison
        const normalize = (s) => s.toLowerCase().trim().replace(/\s+/g, ' ');
        const s1 = normalize(str1);
        const s2 = normalize(str2);
        
        // Exact match
        if (s1 === s2) return true;
        
        // One contains the other (handle cases like "sandton" vs "sandton city")
        if (s1.includes(s2) || s2.includes(s1)) return true;
        
        // Check if words match (handle cases like "cape town" vs "capetown")
        const words1 = s1.split(/\s+/);
        const words2 = s2.split(/\s+/);
        
        // Check if all words from shorter string are in longer string
        const shorter = words1.length < words2.length ? words1 : words2;
        const longer = words1.length < words2.length ? words2 : words1;
        
        return shorter.every(word => longer.some(w => w.includes(word) || word.includes(w)));
      };
      
      // Priority 1: Same suburb = highest score (500 points)
      if (workerSuburb && userLocation.suburb && matches(workerSuburb, userLocation.suburb)) {
        locationScore += 500;
        console.log(`   ✅ SAME SUBURB! Score +500 (${workerSuburb} matches ${userLocation.suburb})`);
      }
      
      // Priority 2: Same city (300 points)
      if (workerCity && userLocation.city && matches(workerCity, userLocation.city)) {
        locationScore += 300;
        console.log(`   ✅ SAME CITY! Score +300 (${workerCity} matches ${userLocation.city})`);
      }
      
      // Priority 3: Same province (100 points)
      if (workerProvince && userLocation.province && matches(workerProvince, userLocation.province)) {
        locationScore += 100;
        console.log(`   ✅ SAME PROVINCE! Score +100 (${workerProvince} matches ${userLocation.province})`);
      }
      
      console.log(`   📊 Total Score: ${locationScore}`);
      
      // Format display location with proper capitalization
      const capitalize = (str) => {
        if (!str) return '';
        return str.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };
      
      const locationParts = [
        worker.suburb,
        worker.city,
        worker.province
      ].filter(part => part && part.trim().length > 0);
      
      const displayLocation = locationParts.length > 0
        ? locationParts.map(part => capitalize(part)).join(', ')
        : 'Location not specified';
      
      return {
        ...worker,
        locationScore,
        displayLocation
      };
    });
    
    // Filter: Only show workers with at least province match (locationScore >= 100)
    // Featured workers still need to meet location requirements
    const locationMatchedWorkers = workersWithScore.filter(w => w.locationScore >= 100);
    
    if (locationMatchedWorkers.length === 0) {
      console.log(`\n⚠️ No location matches found (no workers in same province or closer)`);
      setWorkers([]);
      return;
    }
    
    // Sort by featured status first (featured workers always appear first)
    // Then by location match, then rating
    const sortedWorkers = locationMatchedWorkers.sort((a, b) => {
      // Primary sort: featured status (featured workers ALWAYS first, regardless of location)
      // Convert to boolean explicitly to handle undefined/null values
      const aFeatured = Boolean(a.featured);
      const bFeatured = Boolean(b.featured);
      
      if (aFeatured !== bFeatured) {
        // If a is featured and b is not, a comes first (return negative)
        // If b is featured and a is not, b comes first (return positive)
        return aFeatured ? -1 : 1;
      }
      // Secondary sort: location score (descending) - only used as tiebreaker
      // This only matters when comparing workers with the same featured status
      if (b.locationScore !== a.locationScore) {
        return b.locationScore - a.locationScore;
      }
      // Tertiary sort: rating (descending)
      return b.rating - a.rating;
    });
    
    console.log('\n📋 Final sorted workers (with location match):');
    sortedWorkers.forEach((w, idx) => {
      console.log(`${idx + 1}. ${w.fullName} - Location: ${w.displayLocation} - Score: ${w.locationScore} - Featured: ${w.featured} - Rating: ${w.rating}%`);
    });
    
    // Show up to 5 workers (featured workers will appear first if they meet location requirements)
    console.log(`\n✨ Showing ${Math.min(sortedWorkers.length, 5)} workers with location matches`);
    setWorkers(sortedWorkers.slice(0, 5));
    
  } catch (error) {
    console.error("Error fetching workers:", error);
  }
};

  // Select the best worker based on rating, jobs completed, and availability
  const selectBestWorker = () => {
    if (workers.length === 0) {
      return null;
    }

    // Filter workers who provide the required service
    const requiredServiceTypes = serviceTypeMapping[bookingDetails.serviceType] || [];
    const eligibleWorkers = requiredServiceTypes.length > 0
      ? workers.filter(worker => {
          const workerServices = worker.serviceTypes || [];
          return requiredServiceTypes.some(service => 
            workerServices.includes(service)
          );
        })
      : workers;

    if (eligibleWorkers.length === 0) {
      return null;
    }

    // Sort by: rating (highest first), then jobs completed (most first)
    const sorted = [...eligibleWorkers].sort((a, b) => {
      // Primary sort: rating
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      // Secondary sort: jobs completed
      return (b.jobsCompleted || 0) - (a.jobsCompleted || 0);
    });

    return sorted[0]; // Return the best worker
  };

  // Generate AI explanation for why this worker was selected
  const generateAIExplanation = async (worker) => {
    try {
      setLoadingAI(true);
      const response = await fetch(`${API_BASE_URL}/api/workers/ai-explanation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({
          workerData: {
            fullName: worker.fullName,
            rating: worker.rating,
            jobsCompleted: worker.jobsCompleted || 0,
            serviceTypes: worker.serviceTypes || [],
            city: worker.city || '',
            province: worker.province || '',
            skills: worker.skills || '',
            reviews: worker.reviews || []
          },
          bookingDetails: {
            serviceType: bookingDetails.serviceType,
            hoursNeeded: bookingDetails.hoursNeeded,
            scheduledDate: bookingDetails.scheduledDate,
            scheduledTime: bookingDetails.scheduledTime,
            address: selectedAddress?.formattedAddress || '',
            city: selectedAddress?.city || '',
            province: selectedAddress?.province || ''
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate explanation');
      }

      const data = await response.json();
      // Ensure we have a valid explanation
      if (data.explanation && data.explanation.trim().length > 0) {
        return data.explanation.trim();
      }
      // Fallback if explanation is empty
      return generateFallbackExplanation(worker);
    } catch (error) {
      console.error('AI explanation error:', error);
      // Fallback to rule-based explanation if AI fails
      return generateFallbackExplanation(worker);
    } finally {
      setLoadingAI(false);
    }
  };

  // Fallback explanation if AI is unavailable
  const generateFallbackExplanation = (worker) => {
    const reasons = [];
    const locationInfo = [];
    
    // Rating-based reasons
    if (worker.rating >= 95) {
      reasons.push(`an exceptional ${worker.rating}% rating`);
    } else if (worker.rating >= 90) {
      reasons.push(`a strong ${worker.rating}% rating`);
    } else if (worker.rating >= 85) {
      reasons.push(`a good ${worker.rating}% rating`);
    } else if (worker.rating >= 80) {
      reasons.push(`a solid ${worker.rating}% rating`);
    }
    
    // Experience-based reasons
    if (worker.jobsCompleted > 100) {
      reasons.push(`extensive experience with over ${worker.jobsCompleted} successfully completed jobs`);
    } else if (worker.jobsCompleted > 50) {
      reasons.push(`a solid track record with ${worker.jobsCompleted} completed jobs`);
    } else if (worker.jobsCompleted > 20) {
      reasons.push(`proven experience with ${worker.jobsCompleted} completed jobs`);
    } else if (worker.jobsCompleted > 0) {
      reasons.push(`experience with ${worker.jobsCompleted} completed ${worker.jobsCompleted === 1 ? 'job' : 'jobs'}`);
    }
    
    // Service match reasons
    const workerServices = worker.serviceTypes || [];
    const requiredServices = serviceTypeMapping[bookingDetails.serviceType] || [];
    const matchingServices = workerServices.filter(s => requiredServices.includes(s));
    if (matchingServices.length > 0) {
      reasons.push(`specialized expertise in ${matchingServices.join(' and ')}`);
    } else if (workerServices.length > 0) {
      reasons.push(`expertise in ${workerServices.slice(0, 2).join(' and ')}`);
    }
    
    // Skills-based reasons
    if (worker.skills && worker.skills.length > 20) {
      const skillsList = worker.skills.split(',').slice(0, 3).join(', ');
      reasons.push(`relevant skills including ${skillsList}`);
    }
    
    // Location-based reasons
    if (worker.city && worker.province) {
      if (selectedAddress?.city && selectedAddress.city.toLowerCase() === worker.city.toLowerCase()) {
        locationInfo.push(`conveniently located in the same city (${worker.city})`);
      } else if (selectedAddress?.province && selectedAddress.province.toLowerCase() === worker.province.toLowerCase()) {
        locationInfo.push(`located in the same province (${worker.province})`);
      } else {
        locationInfo.push(`serving the ${worker.city}, ${worker.province} area`);
      }
    }
    
    // Review-based reasons
    if (worker.reviews && worker.reviews.length > 10) {
      reasons.push(`consistently positive feedback from ${worker.reviews.length} satisfied clients`);
    } else if (worker.reviews && worker.reviews.length > 0) {
      reasons.push(`positive reviews from ${worker.reviews.length} ${worker.reviews.length === 1 ? 'client' : 'clients'}`);
    }
    
    // Build comprehensive explanation with better structure
    let explanation = `We've selected ${worker.fullName} as your perfect service provider for this ${bookingDetails.serviceType} booking. `;
    
    if (reasons.length > 0) {
      explanation += `They have `;
      if (reasons.length === 1) {
        explanation += reasons[0];
      } else if (reasons.length === 2) {
        explanation += `${reasons[0]} and ${reasons[1]}`;
      } else {
        explanation += `${reasons.slice(0, -1).join(', ')}, and ${reasons[reasons.length - 1]}`;
      }
      explanation += '. ';
    }
    
    if (locationInfo.length > 0) {
      explanation += locationInfo[0] + '. ';
    }
    
    if (bookingDetails.hoursNeeded) {
      explanation += `They're perfectly matched for your ${bookingDetails.hoursNeeded}-hour ${bookingDetails.serviceType} booking and have a proven track record of delivering quality service.`;
    } else {
      explanation += `They're perfectly matched for your ${bookingDetails.serviceType} booking and have a proven track record of delivering quality service.`;
    }
    
    if (reasons.length === 0 && locationInfo.length === 0) {
      explanation = `We've selected ${worker.fullName} as your service provider because they are a qualified professional ready to provide excellent service for your ${bookingDetails.serviceType} needs. With their experience and dedication, they'll ensure your booking is completed to the highest standards.`;
    }
    
    return explanation;
  };
  

  // Handle "Choose for me" button click
  const handleChooseForMe = async () => {
    const bestWorker = selectBestWorker();
    if (!bestWorker) {
      alert('No workers available for this service type. Please try selecting a worker manually or contact support.');
      return;
    }

    setAiSelectedWorker(bestWorker);
    setAiExplanation(''); // Clear previous explanation
    setTypedExplanation(''); // Clear typed explanation
    const explanation = await generateAIExplanation(bestWorker);
    if (explanation && explanation.trim().length > 0) {
      setAiExplanation(explanation);
    } else {
      // If explanation is empty, use fallback
      const fallback = generateFallbackExplanation(bestWorker);
      setAiExplanation(fallback);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!selectedAddress) {
        alert('Please select an address to continue');
        return;
      }
      if (!bookingDetails.scheduledDate) {
        alert('Please select a date for your service booking');
        return;
      }
      if (!bookingDetails.scheduledTime) {
        alert('Please select a time for your service booking');
        return;
      }
      if (bookingDetails.serviceType === 'Event Cleaning' &&
    (!bookingDetails.eventSize || !bookingDetails.eventCleaningScope)) {
  alert('Please select an event size and a cleaning scope');
  return;
}
if (bookingDetails.serviceType === 'Laundry & Ironing' && !bookingDetails.laundryBundle) {
  alert('Please choose a laundry bundle');
  return;
}
    }
    
    if (step === 2) {
      // Allow proceeding even without worker selection - we'll assign one later
      // No validation needed - users can proceed without selecting a worker
    }
    
    if (step < 4) {
      setStep(step + 1);
      // Scroll to top of content
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    } else if (onClose && typeof onClose === 'function') {
      onClose();
    } else {
      window.history.back();
    }
  };

  const handleSubmitBooking = async () => {
  commitBookingText();
  if (isGuest) {
    promptSignIn();
    return;
  }
  await handlePaymentFlow(); // this is the only place the booking is created
};

  const handlePaymentFlow = async () => {
    try {
      setLoading(true);
      commitBookingText();
  
      if (!selectedAddress || !bookingDetails.scheduledDate || !bookingDetails.scheduledTime) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }
  
      const totalCost = calculateTotal();
  
      if (!totalCost || totalCost <= 0) {
        alert('Invalid booking amount. Please check your booking details.');
        setLoading(false);
        return;
      }
  
      // Build address object
      const addressData = {
        formattedAddress: selectedAddress.formattedAddress,
        unitNumber: selectedAddress.unitNumber || '',
      };
  
      if (selectedAddress._id && selectedAddress._id.length === 24) {
        addressData.addressId = selectedAddress._id;
      }
  
      // BUILD BOOKING DATA
      const bookingData = {
        serviceType: bookingDetails.serviceType,
        address: addressData,
        customTasks: bookingDetails.extraTasks || [],
        hoursNeeded: parseFloat(bookingDetails.hoursNeeded),
        frequency: bookingDetails.frequency,
        scheduledDate: bookingDetails.scheduledDate,
        scheduledTime: bookingDetails.scheduledTime,
        notes: notesRef.current || '',
        preferredProvider: selectedWorker?._id ? selectedWorker._id : null,
        totalCost: totalCost,
        payment: {
          method: 'payfast',
          status: 'pending'
        }
      };

      if (bookingDetails.serviceType === 'Office Cleaning') {
       bookingData.officeSpecialRequests = {
        extraProviders: bookingDetails.officeSpecialRequests?.extraProviders || false,
        highRiskAreas: bookingDetails.officeSpecialRequests?.highRiskAreas || false,
        earlyMorning: bookingDetails.officeSpecialRequests?.earlyMorning || false,
        afterHours: bookingDetails.officeSpecialRequests?.afterHours || false,
        biohazard: bookingDetails.officeSpecialRequests?.biohazard || false,
        customRequest: customRequestRef.current || ''
      };
    }
  
      // Add service-specific fields if needed
      if (bookingDetails.serviceType === 'Event Cleaning') {
        bookingData.eventSize = bookingDetails.eventSize;
        bookingData.eventGuestCount = bookingDetails.eventGuestCount;
        bookingData.eventCleaningScope = bookingDetails.eventCleaningScope;
        bookingData.eventPackage = bookingDetails.eventPackage;
      }
  
      if (bookingDetails.serviceType === 'Laundry & Ironing') {
        bookingData.laundryBundle = bookingDetails.laundryBundle;
      }
  
      const res = await fetch(`${API_BASE_URL}/api/auth/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAuthToken()}`
        },
        body: JSON.stringify(bookingData)
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }
  
      const booking = await res.json();
      const bookingId = booking.booking._id || booking.booking.id;
  
      // Store booking in multiple bookings array
      setMultipleBookings(prev => [...prev, {
        bookingId,
        totalCost,
        scheduledDate: bookingDetails.scheduledDate,
        scheduledTime: bookingDetails.scheduledTime,
        serviceType: bookingDetails.serviceType
      }]);
  
      // Open payment modal
      setCurrentBookingId(bookingId);
      setCurrentAmount(totalCost);
      setShowPaymentModal(true);
  
    } catch (error) {
      console.error('Booking error:', error);
      alert('❌ Failed to create booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const h = parseFloat(bookingDetails.hoursNeeded);
    const serviceType = bookingDetails.serviceType;
    
    const servicePricing = PRICING_STRUCTURE[serviceType];
    
    // Event Cleaning - Calculate base + scope
    if (serviceType === 'Event Cleaning') {
      if (!servicePricing || !servicePricing[bookingDetails.eventSize]) {
        return 3300;
      }
      
      const sizePackage = servicePricing[bookingDetails.eventSize];
      const scope = bookingDetails.eventCleaningScope;
      
      switch(scope) {
        case 'preSetup':
          return sizePackage.base + sizePackage.preSetup;
        case 'duringSupport':
          return sizePackage.base + sizePackage.duringSupport;
        case 'postDeepClean':
          return sizePackage.base + sizePackage.postDeepClean;
        case 'fullPackage':
          return sizePackage.fullPackage;
        case 'base':
        default:
          return sizePackage.base;
      }
    }
    
    // Laundry & Ironing
    if (serviceType === 'Laundry & Ironing') {
      if (!servicePricing || !servicePricing[bookingDetails.laundryBundle]) {
        return 350;
      }
      return servicePricing[bookingDetails.laundryBundle].price;
    }
    
    // Hours-based services
    if (!servicePricing) {
      return 290;
    }
    
    // Exact match
    if (servicePricing[h]) {
      return servicePricing[h];
    }
    
    // Indoor Services - round to nearest hour
    if (serviceType === 'Indoor Services') {
      const rounded = Math.round(h);
      const validHour = Math.min(Math.max(rounded, 3), 8);
      return servicePricing[validHour] || 290;
    }
    
    // Outdoor, Office, Moving - find closest
    if (['Outdoor Services', 'Office Cleaning', 'Moving Cleaning'].includes(serviceType)) {
      const availableHours = Object.keys(servicePricing).map(Number).sort((a, b) => a - b);
      if (availableHours.length === 0) return 290;
      
      const closest = availableHours.reduce((prev, curr) => 
        Math.abs(curr - h) < Math.abs(prev - h) ? curr : prev
      );
      return servicePricing[closest] || 290;
    }
    
    return 290;
  };
  
  

  const homeSizes = [
    { value: 'small', label: 'Small Home: 1-2 Bedrooms' },
    { value: 'medium', label: 'Medium Home: 3-4 Bedrooms' },
    { value: 'large', label: 'Large Home: 5+ Bedrooms' }
  ];

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
      { id: 'pool-cleaning', label: 'Pool Cleaning', icon: '/pool.png' },
      { id: 'patio-cleaning', label: 'Patio Cleaning', icon: '/patio.png' },
      { id: 'windows-exterior', label: 'Exterior Windows', icon: '/window.png' },
      { id: 'gutter-cleaning', label: 'Gutter Cleaning', icon: '/gutter.png' },
      { id: 'driveway', label: 'Driveway Cleaning', icon: '/car.png' },
      { id: 'fence-cleaning', label: 'Fence Cleaning', icon: '/fence.png' },
      { id: 'Dog walking', label: 'Dog walking', icon: '/walking.png' }
    ],
    'Office Cleaning': [
      { id: 'desk-sanitization', label: 'Desk Sanitization', icon: '/desk.png' },
      { id: 'kitchen-area', label: 'Kitchen Area', icon: '/kitchen.png' },
      { id: 'bathroom-deep', label: 'Bathroom Deep Clean', icon: '/bathroom.png' },
      { id: 'windows-office', label: 'Office Windows', icon: '/window.png' },
      { id: 'carpet-vacuum', label: 'Carpet Vacuuming', icon: '/vacuum-cleaner.png' },
      { id: 'trash-removal', label: 'Trash Removal', icon: '/trash-bin.png' },
      { id: 'conference-room', label: 'Conference Room', icon: '/board-meeting.png' },
      { id: 'electronics', label: 'Electronics Dusting', icon: '/electronics.png' }
    ],
    'Moving Cleaning': [
      { id: 'deep-clean-all', label: 'Deep Clean All Rooms', icon: '/time.png' },
      { id: 'fridge-freezer', label: 'Fridge & Freezer', icon: '/fridge.png' },
      { id: 'oven-stove', label: 'Oven & Stove', icon: '/oven.png' },
      { id: 'all-cabinets', label: 'All Cabinets', icon: '/cabinets.png' },
      { id: 'all-windows', label: 'All Windows', icon: '/window.png' },
      { id: 'wall-marks', label: 'Remove Wall Marks', icon: '/wall.png' },
      { id: 'carpet-steam', label: 'Carpet Steam Clean', icon: '/cabinets.png' },
      { id: 'balcony-patio', label: 'Balcony/Patio', icon: '/building.png' }
    ],
    'Laundry & Ironing': [
      { id: 'wash-fold', label: 'Wash & Fold', icon: '/laundry.png' },
      { id: 'ironing-service', label: 'Ironing Service', icon: '/ironing.png' },
      { id: 'delicate-items', label: 'Delicate Items', icon: '/delicate.png' },
      { id: 'bed-linen', label: 'Bed Linen', icon: '/blanket.png' },
      { id: 'towels', label: 'Towels', icon: '/towel.png' },
      { id: 'curtains', label: 'Curtains', icon: '/curtains.png' },
      { id: 'steam-press', label: 'Steam Pressing', icon: '/ironing.png' },
      { id: 'hang-fold', label: 'Hang & Fold', icon: '/hang.png' }
    ],
    'Mom\'s Helper': [
      { id: 'meal-prep', label: 'Meal Prep', icon: '/food.png' },
      { id: 'children-pickup', label: 'Children Pickup', icon: '/boy.png' },
      { id: 'light-cleaning', label: 'Light Cleaning', icon: '/wall.png' },
      { id: 'laundry-kids', label: 'Kids Laundry', icon: '/laundry.png' },
      { id: 'organize', label: 'Organizing', icon: '/cabinets.png' },
      { id: 'grocery-help', label: 'Grocery Help', icon: '/fridge.png' },
      { id: 'play-supervision', label: 'Play Supervision', icon: '/plants.png' },
      { id: 'homework-help', label: 'Homework Help', icon: '/homework.png' }
    ],
    'Elder Care': [
      { id: 'companion', label: 'Companionship', icon: '/relationships.png' },
      { id: 'medication-remind', label: 'Medication Reminders', icon: '/medicine.png' },
      { id: 'meal-prep-elder', label: 'Meal Preparation', icon: '/food.png' },
      { id: 'light-exercise', label: 'Light Exercise', icon: '/exercising.png' },
    ],
    'Event Cleaning': [
  { id: 'setup-cleanup', label: 'Setup & Cleanup', icon: '/clean-up.png' },
  { id: 'post-party-deep', label: 'Deep Clean Post-Event', icon: '/mop.png' },
  { id: 'waste-removal', label: 'Waste & Trash Removal', icon: '/trash-bin.png' },
  { id: 'floor-restoration', label: 'Floor Restoration', icon: '/floor.png' },
  { id: 'furniture-sanitize', label: 'Furniture Sanitization', icon: '/spray.png' },
  { id: 'window-clean', label: 'Window & Glass Cleaning', icon: '/window.png' },
  { id: 'kitchen-deep', label: 'Kitchen Deep Clean', icon: '/kitchen.png' },
  { id: 'bathroom-restore', label: 'Bathroom Restoration', icon: '/bathroom.png' },
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
    <div className="flex-1 overflow-y-auto" ref={contentRef}>
      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-6">
        <div className="relative">
          {/* AI Service Matcher - Positioned on left side (Desktop only) */}
          <div className="hidden lg:block absolute left-0 top-0 w-64 xl:w-72 z-20">
            <AIServiceMatcher
              onMatch={(matchResult) => {
                console.log('AI Match Result:', matchResult);
              }}
              bookingDetails={bookingDetails}
              setBookingDetails={setBookingDetails}
            />
            {/* Service Tutorial Video - desktop sidebar, already lg+ only */}
            {SERVICE_VIDEOS[bookingDetails.serviceType] && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-purple-200 bg-white/50">
                    <div className="flex items-center gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">How to Book {bookingDetails.serviceType}</h4>
                        <p className="text-xs text-gray-600">Watch our quick tutorial</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowServiceVideo(!showServiceVideo)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      {showServiceVideo ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {showServiceVideo && (
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${SERVICE_VIDEOS[bookingDetails.serviceType]}?rel=0&modestbranding=1`}
                        title={`How to book ${bookingDetails.serviceType}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content wrapper with left margin for AI matcher */}
          <div className="lg:pl-72 xl:pl-80">
            {isGuest && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 font-semibold">Guest Checkout</p>
                  <p className="text-sm text-blue-800">
                    You're booking as a guest. You'll create your account or log in before payment.
                  </p>
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Column - Form */}
              <div className="space-y-6">

                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Add details about your booking</h2>

                  {/* Service Description */}
                  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">{bookingDetails.serviceType}</h3>
                        <p className="text-sm text-blue-800">
                          {SERVICE_DESCRIPTIONS[bookingDetails.serviceType] || 'Professional service tailored to your needs.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Service Matcher (Mobile/Tablet - visible below lg, below service description) */}
                  <div className="lg:hidden mb-6">
                    <AIServiceMatcher
                      onMatch={(matchResult) => {
                        console.log('AI Match Result:', matchResult);
                      }}
                      bookingDetails={bookingDetails}
                      setBookingDetails={setBookingDetails}
                    />
                    {/* Service Tutorial Video - hidden on small phone screens, shown from sm: (≥640px) up to lg */}
                    {SERVICE_VIDEOS[bookingDetails.serviceType] && (
                      <div className="hidden sm:block mb-6">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl overflow-hidden">
                          <div className="flex items-center justify-between p-4 border-b border-purple-200 bg-white/50">
                            <div className="flex items-center gap-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">How to Book {bookingDetails.serviceType}</h4>
                                <p className="text-xs text-gray-600">Watch our quick tutorial</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowServiceVideo(!showServiceVideo)}
                              className="p-2 hover:bg-white rounded-lg transition-colors"
                            >
                              {showServiceVideo ? (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                          </div>

                          {showServiceVideo && (
                            <div className="relative" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${SERVICE_VIDEOS[bookingDetails.serviceType]}?rel=0&modestbranding=1`}
                                title={`How to book ${bookingDetails.serviceType}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Address Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Service Address</label>
                    <div className="space-y-2">
                      {isGuest ? (
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(true)}
                          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600"
                        >
                          <Plus className="w-5 h-5" />
                          Add Address
                        </button>
                      ) : (
                        <>
                          {addresses.length > 0 ? (
                            addresses.map((addr) => (
                              <button
                                key={addr._id}
                                type="button"
                                onClick={() => {
                                  console.log('🏠 User selected address:', addr.formattedAddress);
                                  setSelectedAddress(addr);
                                  if (step === 2 && !isGuest && token) {
                                    console.log('🔄 Refetching workers for new address');
                                    setTimeout(() => fetchWorkers(), 100);
                                  }
                                }}
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
                            ))
                          ) : (
                            <p className="text-sm text-gray-600 mb-2">No saved addresses yet</p>
                          )}

                          <button
                            type="button"
                            onClick={() => setShowAddAddress(true)}
                            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600"
                          >
                            <Plus className="w-5 h-5" />
                            Add New Address
                          </button>
                        </>
                      )}
                    </div>
                  </div>


                  {/* Home Size */}
                  {bookingDetails.serviceType === 'Indoor Services' && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">How big is your home?</label>
                      <div className="relative">
                        <select
                          value={bookingDetails.homeSize}
                          onChange={(e) => {
                            if (contentRef.current) {
                              const scrollPos = contentRef.current.scrollTop;
                              sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                            }
                            setBookingDetails({...bookingDetails, homeSize: e.target.value});
                          }}
                          onBlur={(e) => {
                            if (contentRef.current) {
                              const scrollPos = contentRef.current.scrollTop;
                              sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                              requestAnimationFrame(() => {
                                if (contentRef.current) {
                                  contentRef.current.scrollTop = scrollPos;
                                }
                              });
                            }
                          }}
                          className="w-full p-3 lg:p-4 pr-10 border-2 border-gray-200 rounded-lg appearance-none focus:border-blue-500 focus:outline-none bg-white"
                        >
                          {homeSizes.map(size => (
                            <option key={size.value} value={size.value}>{size.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Extra Tasks */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Extra Tasks</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                      {extraTasksOptions.map(task => (
                        <button
                          key={task.id}
                          onClick={() => {
                            if (contentRef.current) {
                              const scrollPos = contentRef.current.scrollTop;
                              sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                            }
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

                  {/* Hours - With Service-Specific Constraints */}
                  {bookingDetails.serviceType !== 'Laundry & Ironing' && bookingDetails.serviceType !== 'Event Cleaning' && (
                    <div className="mb-6" ref={hoursRef}>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">How Long?</label>
                      <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <span className="font-medium">Hours</span>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (contentRef.current) {
                                const scrollPos = contentRef.current.scrollTop;
                                sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                              }
                              const minHours = bookingDetails.serviceType === 'Outdoor Services' ? 3.5 : 2;
                              const newHours = Math.max(minHours, bookingDetails.hoursNeeded - 0.5);
                              setBookingDetails({...bookingDetails, hoursNeeded: parseFloat(newHours.toFixed(1))});
                            }}
                            className="w-10 h-10 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-all font-bold text-xl"
                          >
                            -
                          </button>
                          <span className="text-2xl font-bold text-gray-900 w-16 text-center">
                            {bookingDetails.hoursNeeded}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (contentRef.current) {
                                const scrollPos = contentRef.current.scrollTop;
                                sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                              }
                              const newHours = Math.min(8, bookingDetails.hoursNeeded + 0.5);
                              setBookingDetails({...bookingDetails, hoursNeeded: parseFloat(newHours.toFixed(1))});
                            }}
                            className="w-10 h-10 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-all font-bold text-xl"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Event Cleaning Configuration */}
                  {bookingDetails.serviceType === 'Event Cleaning' && (
                    <div className="mb-6 space-y-6">

                      {/* Event Size Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">Select Event Size</label>
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                          {[
                            { value: 'small', label: 'Small', guests: '≤50 guests', color: 'blue' },
                            { value: 'medium', label: 'Medium', guests: '51–150 guests', color: 'purple' },
                            { value: 'large', label: 'Large', guests: '151–300 guests', color: 'pink' },
                            { value: 'extraLarge', label: 'Extra Large', guests: '300+ guests', color: 'red' }
                          ].map(size => (
                            <button
                              key={size.value}
                              type="button"
                              onClick={() => {
                                if (contentRef.current) {
                                  const scrollPos = contentRef.current.scrollTop;
                                  sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                                }
                                setBookingDetails({
                                  ...bookingDetails,
                                  eventSize: size.value,
                                  eventPackage: size.value,
                                  eventGuestCount: size.guests
                                });
                              }}
                              className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                                bookingDetails.eventSize === size.value
                                  ? `border-${size.color}-500 bg-${size.color}-50 shadow-lg`
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <p className="font-bold text-gray-900">{size.label}</p>
                              <p className="text-xs text-gray-600 mt-1">{size.guests}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Guest Count Display */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Expected Guest Count</label>
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                              👥
                            </div>
                            <div>
                              <p className="text-sm text-blue-600 font-medium">Expected Guests:</p>
                              <p className="text-2xl font-bold text-blue-900">
                                {bookingDetails.eventSize === 'small' && '≤50 guests'}
                                {bookingDetails.eventSize === 'medium' && '51–150 guests'}
                                {bookingDetails.eventSize === 'large' && '151–300 guests'}
                                {bookingDetails.eventSize === 'extraLarge' && '300+ guests'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cleaning Scope Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">Cleaning Scope</label>
                        <p className="text-xs text-gray-600 mb-4">Choose the level of cleaning service you need</p>
                        <div className="space-y-3">
                          {[
                            {
                              value: 'base',
                              label: 'Base Service',
                              desc: 'Venue cleaning & basic setup',
                              color: 'blue'
                            },
                            {
                              value: 'preSetup',
                              label: 'Pre-Event Setup',
                              desc: 'Base + Pre-event preparation & decoration cleaning',
                              color: 'purple'
                            },
                            {
                              value: 'duringSupport',
                              label: 'During Event Support',
                              desc: 'Base + Ongoing cleaning & tidying during the event',
                              color: 'pink'
                            },
                            {
                              value: 'postDeepClean',
                              label: 'Post-Event Deep Clean',
                              desc: 'Base + Complete post-event cleanup & restoration',
                              color: 'green'
                            },
                            {
                              value: 'fullPackage',
                              label: 'Full Package (Recommended)',
                              desc: 'Everything - Pre, During, and Post event services',
                              color: 'yellow'
                            }
                          ].map(scope => (
                            <button
                              key={scope.value}
                              type="button"
                              onClick={() => {
                                if (contentRef.current) {
                                  const scrollPos = contentRef.current.scrollTop;
                                  sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                                }
                                setBookingDetails({
                                  ...bookingDetails,
                                  eventCleaningScope: scope.value
                                });
                              }}
                              className={`w-full p-4 rounded-xl border-2 transition-all text-left transform hover:scale-102 ${
                                bookingDetails.eventCleaningScope === scope.value
                                  ? `border-${scope.color}-500 bg-${scope.color}-50 shadow-md`
                                  : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-900">{scope.label}</p>
                                    {scope.value === 'fullPackage' && (
                                      <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{scope.desc}</p>
                                </div>
                                {bookingDetails.eventCleaningScope === scope.value && (
                                  <div className="text-blue-500 mt-1">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Laundry & Ironing Bundle Selection */}
                  {bookingDetails.serviceType === 'Laundry & Ironing' && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Your Bundle</label>
                      <div className="space-y-2">
                        {[
                          { key: 'small', label: 'Small Bundle', desc: '1–2 wash loads + 1 ironing load (10–15 items)', time: '3 hrs', price: 350 },
                          { key: 'family', label: 'Family Bundle', desc: '3–4 wash loads + 2 ironing loads (16–30 items)', time: '4 hrs', price: 420 },
                          { key: 'busyWeek', label: 'Busy Week Bundle', desc: '5–6 wash loads + 3 ironing loads (31–45 items)', time: '5 hrs', price: 490 },
                          { key: 'bigWash', label: 'Big Wash Bundle', desc: '7–8 wash loads + 4 ironing loads (46–60 items)', time: '6 hrs', price: 560 },
                          { key: 'mega', label: 'Mega Wash Bundle', desc: '9–10 wash loads + 5 ironing loads (61–75 items)', time: '7 hrs', price: 630 },
                          { key: 'unlimited', label: 'Unlimited Bundle', desc: '10+ wash loads + 6 ironing loads (75+ items)', time: '8 hrs', price: 700 }
                        ].map(bundle => (
                          <button
                            key={bundle.key}
                            type="button"
                            onClick={() => {
                              if (contentRef.current) {
                                const scrollPos = contentRef.current.scrollTop;
                                sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                              }
                              setBookingDetails({
                                ...bookingDetails,
                                laundryBundle: bundle.key,
                                hoursNeeded: PRICING_STRUCTURE['Laundry & Ironing'][bundle.key].hours
                              });
                            }}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              bookingDetails.laundryBundle === bundle.key
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-semibold text-gray-900">{bundle.label}</h4>
                              <span className="text-lg font-bold text-blue-600">R{bundle.price}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{bundle.desc}</p>
                            <p className="text-xs text-gray-500">⏱ {bundle.time}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Select start date:
                      </label>
                      <input
                        type="date"
                        placeholder="Select date"
                        value={bookingDetails.scheduledDate}
                        onChange={(e) => {
                          if (!contentRef.current) return;
                          const scrollPos = contentRef.current.scrollTop;
                          sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                          setBookingDetails({ ...bookingDetails, scheduledDate: e.target.value });
                        }}
                        onBlur={(e) => {
                          if (contentRef.current) {
                            const scrollPos = contentRef.current.scrollTop;
                            sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                            requestAnimationFrame(() => {
                              if (contentRef.current) {
                                contentRef.current.scrollTop = scrollPos;
                              }
                            });
                          }
                        }}
                        className="w-full p-3 lg:p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Select start time:</label>
                      <div className="relative">
                        <select
                          value={bookingDetails.scheduledTime}
                          onChange={(e) => {
                            if (!contentRef.current) return;
                            const scrollPos = contentRef.current.scrollTop;
                            sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                            setBookingDetails({...bookingDetails, scheduledTime: e.target.value});
                          }}
                          onBlur={(e) => {
                            if (contentRef.current) {
                              const scrollPos = contentRef.current.scrollTop;
                              sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                              requestAnimationFrame(() => {
                                if (contentRef.current) {
                                  contentRef.current.scrollTop = scrollPos;
                                }
                              });
                            }
                          }}
                          className="w-full p-3 lg:p-4 pr-10 border-2 border-gray-200 rounded-lg appearance-none focus:border-blue-500 focus:outline-none bg-white"
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

                  {bookingDetails.serviceType === 'Office Cleaning' && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Special Requests</label>
                      <p className="text-xs text-gray-600 mb-3">Select any additional services you need for your office cleaning</p>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">Additional Charges Apply</p>
                          <p className="text-xs text-blue-800">
                            Special requests may incur additional charges. Our team will review your booking and provide you with a final quote before any work begins. You'll be contacted to confirm the additional cost.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-all">
                          <input
                            type="checkbox"
                            checked={bookingDetails.officeSpecialRequests?.extraProviders || false}
                            onChange={(e) => {
                              if (contentRef.current) {
                                const scrollPos = contentRef.current.scrollTop;
                                sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                              }
                              setBookingDetails({
                                ...bookingDetails,
                                officeSpecialRequests: {
                                  ...bookingDetails.officeSpecialRequests,
                                  extraProviders: e.target.checked
                                }
                              });
                            }}
                            className="w-5 h-5 text-blue-500 rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">Additional Service Providers</p>
                            <p className="text-xs text-gray-600">Send extra staff members to complete the job faster</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-all">
                          <input
                            type="checkbox"
                            checked={bookingDetails.officeSpecialRequests?.highRiskAreas || false}
                            onChange={(e) => {
                              if (contentRef.current) {
                                const scrollPos = contentRef.current.scrollTop;
                                sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                              }
                              setBookingDetails({
                                ...bookingDetails,
                                officeSpecialRequests: {
                                  ...bookingDetails.officeSpecialRequests,
                                  highRiskAreas: e.target.checked
                                }
                              });
                            }}
                            className="w-5 h-5 text-blue-500 rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">High-Risk Areas</p>
                            <p className="text-xs text-gray-600">Special attention to sensitive electronics and valuable items</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-all">
                          <input
                            type="checkbox"
                            checked={bookingDetails.officeSpecialRequests?.earlyMorning || false}
                            onChange={(e) => {
                              if (contentRef.current) {
                                const scrollPos = contentRef.current.scrollTop;
                                sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                              }
                              setBookingDetails({
                                ...bookingDetails,
                                officeSpecialRequests: {
                                  ...bookingDetails.officeSpecialRequests,
                                  earlyMorning: e.target.checked
                                }
                              });
                            }}
                            className="w-5 h-5 text-blue-500 rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">Early Morning Service</p>
                            <p className="text-xs text-gray-600">Before office hours (before 08:00 AM)</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-all">
                          <input
                            type="checkbox"
                            checked={bookingDetails.officeSpecialRequests?.afterHours || false}
                            onChange={(e) => {
                              if (contentRef.current) {
                                const scrollPos = contentRef.current.scrollTop;
                                sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                              }
                              setBookingDetails({
                                ...bookingDetails,
                                officeSpecialRequests: {
                                  ...bookingDetails.officeSpecialRequests,
                                  afterHours: e.target.checked
                                }
                              });
                            }}
                            className="w-5 h-5 text-blue-500 rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">After Hours Service</p>
                            <p className="text-xs text-gray-600">After office hours (after 18:00 PM)</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-all">
                          <input
                            type="checkbox"
                            checked={bookingDetails.officeSpecialRequests?.biohazard || false}
                            onChange={(e) => {
                              if (contentRef.current) {
                                const scrollPos = contentRef.current.scrollTop;
                                sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
                              }
                              setBookingDetails({
                                ...bookingDetails,
                                officeSpecialRequests: {
                                  ...bookingDetails.officeSpecialRequests,
                                  biohazard: e.target.checked
                                }
                              });
                            }}
                            className="w-5 h-5 text-blue-500 rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">Biohazard Cleaning</p>
                            <p className="text-xs text-gray-600">Specialized cleaning for contaminated areas</p>
                          </div>
                        </label>
                      </div>

                      {/* Custom Request Text Area */}
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Request</label>
                        <textarea
                          key="custom-request"
                          defaultValue={bookingDetails.customRequest}
                          placeholder="Custom request"
                          className="w-full min-h-[120px] rounded-lg bg-white p-4 outline-none border-2 border-gray-300 hover:border-blue-500"
                          onChange={e => (customRequestRef.current = e.target.value)}
                          onBlur={commitBookingText}
                          onFocus={() => (document.body.style.overflow = "hidden")}
                          onBlurCapture={() => (document.body.style.overflow = "")}
                        />
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Add specific instructions</label>
                    <textarea
                      key="notes"
                      defaultValue={bookingDetails.notes}
                      placeholder="Additional notes"
                      className="w-full min-h-[120px] rounded-lg bg-white p-4 outline-none border-2 border-gray-300 hover:border-blue-500"
                      onChange={e => (notesRef.current = e.target.value)}
                      onBlur={commitBookingText}
                      onFocus={() => (document.body.style.overflow = "hidden")}
                      onBlurCapture={() => (document.body.style.overflow = "")}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Summary */}
              <div>
                <div className="sticky top-8 max-w-md xl:max-w-sm mx-auto lg:mx-0">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-5 lg:p-6 mb-4">
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
                        <p className="text-2xl font-bold">R{calculateTotal()}</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Choose Worker
  const ChooseWorkerStep = () => {
    if (isGuest) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Worker</h3>
            <p className="text-gray-600 mb-6">
              To view available workers for {bookingDetails.serviceType}, you'll need to create an account or log in. This helps us match you with the perfect service provider for your needs.
            </p>
            <button
              onClick={promptSignIn}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all font-semibold mb-3"
            >
              Continue & Login/Signup
            </button>
            <p className="text-sm text-gray-600">
              Or skip this and we'll auto-assign the best available worker
            </p>
          </div>
        </div>
      );
    }
  
    // Logged-in user view
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left - Summary */}
            <div>
              <div className="sticky top-8 max-w-md xl:max-w-sm mx-auto lg:mx-0">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5 lg:p-6 mb-4">
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
                      <span className="font-bold">R{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
  
                <button
                  onClick={handleChooseForMe}
                  disabled={loadingAI}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white p-4 rounded-lg transition-all"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {loadingAI ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="font-bold">Finding best match...</span>
                      </>
                    ) : (
                      <>
                        <User className="w-5 h-5" />
                        <span className="font-bold">Choose for me</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs opacity-90">
                    {loadingAI ? 'Analyzing workers...' : 'We\'ll select the best worker for your service'}
                  </p>
                </button>
                
              </div>
            </div>
  
            {/* Right - Workers List */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Choose your worker
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({workers.length} {workers.length === 1 ? 'worker' : 'workers'} available)
                </span>
              </h2>
              <div className="space-y-4">
                {workers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                      <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Service Providers Available Right Now</h3>
                      <p className="text-gray-700 mb-4">
                        Don't worry! You can still book your service. We'll assign a service provider as soon as possible and notify you.
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-left text-sm text-gray-700">
                            <p className="font-semibold mb-1">What happens next?</p>
                            <ul className="space-y-1 list-disc list-inside">
                              <li>Your booking will be confirmed after payment</li>
                              <li>We'll match you with an available service provider</li>
                              <li>You'll receive a notification once assigned</li>
                              <li>You can proceed to payment and complete your booking</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 italic">
                      You can continue to the next step to complete your booking.
                    </p>
                  </div>
                ) : (
                  workers.map((worker) => {
                    const workerImage =
                      worker?.photoDocument?.url ||
                      worker?.photoDocument ||
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAQAAABi6S8PAAAAHklEQVR42u3BMQEAAADCoPdPbQ43oAAAAAAAAAAA4B8GEQAAAVmOGS0AAAAASUVORK5CYII=";
                  
                    // Format worker location
                    const workerLocation = worker.displayLocation || [
                      worker.suburb,
                      worker.city,
                      worker.province
                    ].filter(Boolean).join(', ') || 'Location not specified';
                  
                    // Determine location badge
                    const getLocationBadge = () => {
                      if (worker.locationScore >= 500) {
                        return { text: 'Same Area', color: 'bg-green-100 text-green-700 border-green-200' };
                      } else if (worker.locationScore >= 300) {
                        return { text: 'Same City', color: 'bg-blue-100 text-blue-700 border-blue-200' };
                      } else if (worker.locationScore >= 100) {
                        return { text: 'Same Province', color: 'bg-purple-100 text-purple-700 border-purple-200' };
                      }
                      return null;
                    };
                  
                    const locationBadge = getLocationBadge();
                  
                    return (
                      <div
                        key={worker._id}
                        onClick={() => setSelectedWorker(worker)}
                        className={`border rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-all ${
                          selectedWorker?._id === worker._id ? "border-blue-500 border-2 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={workerImage}
                            alt={worker.fullName}
                            className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm flex-shrink-0"
                            onError={(e) => {
                              e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAQAAABi6S8PAAAAHklEQVR42u3BMQEAAADCoPdPbQ43oAAAAAAAAAAA4B8GEQAAAVmOGS0AAAAASUVORK5CYII=";
                            }}
                          />
                  
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg">{worker.fullName}</h3>
                                {worker.featured && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold border border-yellow-300">
                                    ⭐ Featured
                                  </span>
                                )}
                              </div>
                              <span className="text-sm bg-blue-100 px-2 py-1 rounded font-medium whitespace-nowrap">
                                ⭐ {worker.rating}%
                              </span>
                            </div>
                  
                            {/* Location with badge */}
                            <div className="flex items-start gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm text-gray-600">{workerLocation}</p>
                                {locationBadge && (
                                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${locationBadge.color}`}>
                                    {locationBadge.text}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                  
                        <button
                          className="text-blue-500 mt-3 text-sm flex items-center hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowWorkerProfile(worker);
                          }}
                        >
                          View Profile <ChevronRight size={16} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
  
        {/* AI Selected Worker Modal */}
        {aiSelectedWorker && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  <h3 className="text-xl font-bold">Our Recommended Worker</h3>
                </div>
                <button
                  onClick={() => {
                    setAiSelectedWorker(null);
                    setAiExplanation('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {loadingAI ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Analyzing workers...</p>
                  </div>
                ) : (
                  <>
                    {(aiExplanation || typedExplanation) && (
                      <div className="mb-6 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] bg-white border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Info className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                              Why we selected this worker
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                              {typedExplanation || aiExplanation || 'This worker has been selected based on their qualifications and experience.'}
                              {aiExplanation && typedExplanation.length < aiExplanation.length && (
                                <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1"></span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
  
                    <div className="flex items-start gap-4 mb-6">
                      <img
                        src={aiSelectedWorker?.photoDocument?.url || aiSelectedWorker?.photoDocument || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAQAAABi6S8PAAAAHklEQVR42u3BMQEAAADCoPdPbQ43oAAAAAAAAAAA4B8GEQAAAVmOGS0AAAAASUVORK5CYII="}
                        alt={aiSelectedWorker.fullName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAQAAABi6S8PAAAAHklEQVR42u3BMQEAAADCoPdPbQ43oAAAAAAAAAAA4B8GEQAAAVmOGS0AAAAASUVORK5CYII=";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{aiSelectedWorker.fullName}</h3>
                        <div className="flex gap-6 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Rating</p>
                            <p className="text-xl font-bold">{aiSelectedWorker.rating}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
  
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setSelectedWorker(aiSelectedWorker);
                          setAiSelectedWorker(null);
                          setAiExplanation('');
                          handleNext();
                        }}
                        className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all font-semibold"
                      >
                        Accept & Continue
                      </button>
                      <button
                        onClick={() => {
                          setAiSelectedWorker(null);
                          setAiExplanation('');
                        }}
                        className="flex-1 border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                      >
                        Choose Different
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
  
        {/* Worker Profile Modal */}
        {showWorkerProfile && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
  
  {/* Header */}
  <div className="px-6 py-5 border-b flex justify-between items-center sticky top-0 bg-white z-10">
    <h3 className="text-lg font-bold">SweepStar Profile</h3>
    <button
      onClick={() => setShowWorkerProfile(null)}
      className="p-2 hover:bg-gray-100 rounded-full transition"
    >
      <X className="w-5 h-5" />
    </button>
  </div>

  <div className="p-6">

    {/* Profile Header */}
    <div className="flex items-center gap-4 mb-6">
      <img
        src={showWorkerProfile?.photoDocument?.url || showWorkerProfile?.photoDocument}
        alt={showWorkerProfile.fullName}
        className="w-24 h-24 rounded-full object-cover border"
      />

      <div className="flex-1">
        <h2 className="text-2xl font-bold">{showWorkerProfile.fullName}</h2>

        <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
          <MapPin className="w-4 h-4" />
          {[showWorkerProfile.suburb, showWorkerProfile.city, showWorkerProfile.province]
            .filter(Boolean)
            .join(", ")}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-4">
          <div>
            <p className="text-sm text-gray-500">Recommend</p>
            <p className="font-bold text-lg flex items-center gap-1">
              👍 {showWorkerProfile.rating || 100}%
            </p>
          </div>

          <div className="h-8 w-px bg-gray-300" />
        </div>
      </div>
    </div>

    {/* Skills / Experience */}
    {showWorkerProfile.skills && (
      <div className="mb-6">
        <h4 className="font-bold mb-3">Experience</h4>
        <div className="space-y-2">
          {showWorkerProfile.skills.split(",").map((skill, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {skill.trim()}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* About */}
    {showWorkerProfile.about && (
      <div className="mb-6">
        <h4 className="font-bold mb-2">About Me</h4>
        <p className="text-gray-700 leading-relaxed">
          {showWorkerProfile.about}
        </p>
      </div>
    )}

  
    {/* Availability */}
{showWorkerProfile.availability?.length > 0 && (
  <div className="mb-6">
    <h4 className="font-bold mb-3">Availability</h4>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => {
        const isAvailable = showWorkerProfile.availability.includes(day);

        return (
          <div
            key={day}
            className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition
              ${
                isAvailable
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-gray-50 text-gray-400"
              }
            `}
          >
            <span>{day}</span>
            {isAvailable ? (
              <CheckCircle className="w-4 h-4 text-blue-600" />
            ) : (
              <X className="w-4 h-4 text-gray-400" />
            )}
          </div>
        );
      })}
    </div>
  </div>
)}


    {/* Actions */}
    <div className="flex gap-4 mt-8">
      <button
        onClick={() => {
          setSelectedWorker(showWorkerProfile);
          setShowWorkerProfile(null);
          handleNext();
        }}
        className="flex-1 bg-blue-700 text-white py-3 rounded-full font-semibold hover:bg-green-800 transition"
      >
        Choose me
      </button>

      <button
        onClick={() => setShowWorkerProfile(null)}
        className="flex-1 border-2 border-gray-300 py-3 rounded-full font-semibold hover:bg-gray-50 transition"
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
  };
  

  // Step 3: Review
  const ReviewStep = () => {
    const total = calculateTotal();
  
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-6">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Left - Summary */}
            <div className="md:col-span-2">
              <div className="sticky top-8 max-w-md xl:max-w-sm mx-auto lg:mx-0">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5 lg:p-6 mb-4">
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
  
                    <div className="pb-3 border-b">
  <p className="text-xs text-gray-600 mb-3">Service Provider:</p>
  {selectedWorker ? (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start gap-3">
        <img
          src={selectedWorker?.photoDocument?.url || selectedWorker?.photoDocument || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAQAAABi6S8PAAAAHklEQVR42u3BMQEAAADCoPdPbQ43oAAAAAAAAAAA4B8GEQAAAVmOGS0AAAAASUVORK5CYII="}
          alt={selectedWorker.fullName}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 flex-shrink-0"
          onError={(e) => {
            e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAQAAABi6S8PAAAAHklEQVR42u3BMQEAAADCoPdPbQ43oAAAAAAAAAAA4B8GEQAAAVmOGS0AAAAASUVORK5CYII=";
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 mb-1">{selectedWorker.fullName}</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span>{selectedWorker.rating}%</span>
            </div>
            {/* REMOVED: jobs display */}
          </div>
        </div>
      </div>
    </div>
  ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {isGuest ? 'You\'ll select after login' : 'Auto-assigned (best match)'}
                  </p>
                </div>
              </div>
            )}
          </div>
                  </div>
  
                  <div className="border-t-2 border-gray-200 pt-4 space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">
      {bookingDetails.serviceType === 'Event Cleaning' 
        ? 'Event Package' 
        : bookingDetails.serviceType === 'Laundry & Ironing'
        ? 'Laundry Bundle'
        : 'Hours:'}
    </span>
    <span className="font-medium">
      {bookingDetails.serviceType === 'Event Cleaning' 
        ? bookingDetails.eventSize.charAt(0).toUpperCase() + bookingDetails.eventSize.slice(1)
        : bookingDetails.serviceType === 'Laundry & Ironing'
        ? bookingDetails.laundryBundle.charAt(0).toUpperCase() + bookingDetails.laundryBundle.slice(1)
        : bookingDetails.hoursNeeded}
    </span>
  </div>
  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
    <span className="font-bold text-lg">Total:</span>
    <span className="font-bold text-2xl text-blue-500">R{calculateTotal()}</span>
  </div>
</div>
  
                  <div className="mt-4 flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Info className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <p className="text-xs text-gray-600">
                      You will be redirected to Paystack to complete payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Right - Review Info */}
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Booking</h2>
              
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Payment Information</h3>
                <p className="text-gray-600 mb-4">
                  You will pay <span className="font-bold text-xl">R{total}</span> via Payfast (secure payment gateway)
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 mb-2">How Payment Works</p>
                      <ul className="space-y-1 text-blue-800 text-xs">
                        <li>✓ You'll be redirected to a secure Payfast payment page</li>
                        <li>✓ Payment clears immediately</li>
                        <li>✓ Your booking is confirmed once payment succeeds</li>
                        <li>✓ Our team assigns a worker to your booking</li>
                        <li>✓ You receive confirmation via email</li>
                      </ul>
                    </div>
                  </div>
                </div>
  
                {bookingDetails.extraTasks.length > 0 && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <h4 className="font-bold mb-3">Selected Extra Tasks:</h4>
                    <div className="flex flex-wrap gap-2">
                      {bookingDetails.extraTasks.map(task => (
                        <span key={task} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          {extraTasksOptions.find(t => t.id === task)?.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

{bookingDetails.serviceType === 'Office Cleaning' && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 mt-4">
    <h4 className="font-bold text-blue-900 mb-2">Special Requests Included:</h4>
    <ul className="text-xs text-blue-800 space-y-1">
      {bookingDetails.officeSpecialRequests?.extraProviders && (
        <li>✓ Additional Service Providers</li>
      )}
      {bookingDetails.officeSpecialRequests?.highRiskAreas && (
        <li>✓ High-Risk Areas Protection</li>
      )}
      {bookingDetails.officeSpecialRequests?.earlyMorning && (
        <li>✓ Early Morning Service</li>
      )}
      {bookingDetails.officeSpecialRequests?.afterHours && (
        <li>✓ After Hours Service</li>
      )}
      {bookingDetails.officeSpecialRequests?.biohazard && (
        <li>✓ Biohazard Cleaning</li>
      )}
      {bookingDetails.officeSpecialRequests?.customRequest && (
        <li>✓ Custom Request: "{bookingDetails.officeSpecialRequests.customRequest}"</li>
      )}
    </ul>
    <p className="text-xs text-blue-700 mt-2 italic">
      Additional charges will be applied after our team reviews your request.
    </p>
  </div>
)}
              </div>
  
              {/* Service Provider Assignment Notice */}
              {(!selectedWorker && workers.length === 0) && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Service Provider Assignment</p>
                      <p className="mb-2">
                        No service providers are currently available for this service type. Don't worry - you can still complete your booking!
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Your booking will be confirmed after payment</li>
                        <li>We'll assign a service provider as soon as one becomes available</li>
                        <li>You'll receive an email notification once assigned</li>
                        <li>You can check your booking status in your dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {(!selectedWorker && workers.length > 0) && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Auto-Assignment</p>
                      <p>You haven't selected a specific worker. We'll automatically assign the best available service provider for your booking.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Important</p>
                    <p>By clicking "Pay & Confirm Booking", you agree to our terms of service. Your booking will only be confirmed after successful payment.</p>
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
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-6">
        {/* Animated Success Icon */}
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Outer ring animation */}
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            {/* Main circle */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-[bounce_1s_ease-in-out]">
              <Check className="w-14 h-14 text-white animate-[scale_0.5s_ease-out]" strokeWidth={3} />
            </div>
            {/* Sparkles */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-75"></div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-3 animate-[fadeIn_0.5s_ease-out]">
            Payment Successful! 🎉
          </h2>
          <p className="text-xl text-green-600 font-semibold mb-2 animate-[fadeIn_0.7s_ease-out]">
            Your booking has been confirmed
          </p>
          <p className="text-gray-600 animate-[fadeIn_0.9s_ease-out]">
            Thank you for choosing our service
          </p>
        </div>

        {/* Payment Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-2 border-green-200 animate-[slideUp_0.5s_ease-out]">
          <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-bold text-gray-900 capitalize">
                  {bookingDetails.paymentMethod.replace('-', ' ').replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Amount Paid</p>
              <p className="text-3xl font-bold text-green-600">R{total}</p>
            </div>
          </div>

          <h3 className="font-bold text-xl mb-6 text-gray-900">Booking Details</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-blue-600" />  
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">Service Location</p>
                <p className="font-semibold text-gray-900">{selectedAddress?.formattedAddress}</p>
                {selectedAddress?.unitNumber && (
                  <p className="text-sm text-gray-600">Unit: {selectedAddress.unitNumber}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">Service Type</p>
                <p className="font-semibold text-gray-900">{bookingDetails.serviceType}</p>
                <p className="text-sm text-gray-600">{bookingDetails.hoursNeeded} hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">Scheduled Date & Time</p>
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

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">Service Provider</p>
                <p className="font-semibold text-gray-900">
                  {selectedWorker?.fullName || 'Auto-assigned by our team'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 mb-6 animate-[slideUp_0.7s_ease-out]">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-blue-900 mb-3 text-lg">What happens next?</p>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>You'll receive a confirmation email within 5 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Our team will contact you to confirm final details</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Your service provider will arrive at the scheduled time</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Manage your booking anytime from your dashboard</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Service Provider Assignment Notice */}
        {(!selectedWorker || workers.length === 0) && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6 animate-[slideUp_0.8s_ease-out]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2 text-lg">Service Provider Assignment</h3>
                <p className="text-blue-800 mb-3">
                  {workers.length === 0 
                    ? "No service providers were available at the time of booking, but don't worry!"
                    : "A service provider will be assigned to your booking soon."}
                </p>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>We'll match you with an available service provider as soon as possible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>You'll receive an email notification once a provider is assigned</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>You can check your booking status anytime in your dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-[slideUp_0.9s_ease-out]">
          {showBookAnother ? (
            <>
              <button
                onClick={() => {
                  // Reset form for another booking
                  setStep(1);
                  setSelectedWorker(null);
                  setAiSelectedWorker(null);
                  setShowBookAnother(false);
                  setBookingDetails(prev => ({
                    ...prev,
                    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    scheduledTime: '',
                    notes: '',
                    extraTasks: []
                  }));
                  notesRef.current = '';
                  customRequestRef.current = '';
                  // Scroll to top
                  if (contentRef.current) {
                    contentRef.current.scrollTop = 0;
                  }
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Another Date
              </button>
              <button
                onClick={() => {
                  if (onClose && typeof onClose === 'function') {
                    onClose();
                  } else {
                    window.location.href = '/dashboard';
                  }
                }}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  if (onClose && typeof onClose === 'function') {
                    onClose();
                  } else {
                    window.location.href = '/dashboard';
                  }
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go to Dashboard
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
              >
                Print Receipt
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

  const stepComponents = [
    BookingDetailsStep,
    ChooseWorkerStep,
    ReviewStep,        
    ConfirmationStep
  ];

  const CurrentStep = stepComponents[step - 1];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-blue-200/50 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-4">

    {/* Header */}
    <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
        {step < 4 && (
          <button
            onClick={handleBack}
            className="group flex-shrink-0 p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-blue-200/50 hover:border-blue-300 transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700 group-hover:text-blue-900 transition-colors" />
          </button>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-bold text-gray-900 tracking-tight text-balance">
            {step === 4
              ? "Booking Confirmed"
              : `Book ${selectedService?.label || "Service"}`}
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-500 font-medium mt-1 sm:mt-1.5">
            {step === 1 && "Step 1 of 3 • Service Details"}
            {step === 2 && "Step 2 of 3 • Choose Worker"}
            {step === 3 && "Step 3 of 3 • Review & Pay"}
            {step === 4 && "Your booking is complete"}
          </p>
        </div>
      </div>

      {step < 4 && (
        <button
          onClick={() => {
            if (onClose && typeof onClose === "function") {
              onClose();
            } else {
              window.history.back();
            }
          }}
          className="group flex-shrink-0 p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-blue-200/50 hover:border-violet-300 transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700 group-hover:text-blue-900 transition-colors" />
        </button>
      )}
    </div>

    {/* Progress Bar */}
        {/* Progress Bar */}
    {step < 4 && (
      <div className="mt-3 sm:mt-4 lg:mt-3 max-w-md lg:max-w-sm mx-auto">
        <div className="flex items-center">
          {[1, 2, 3].map((s, idx) => (
            <React.Fragment key={s}>
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`
                    w-8 h-8 sm:w-9 sm:h-9 lg:w-8 lg:h-8
                    rounded-xl
                    flex items-center justify-center
                    font-bold text-xs sm:text-sm
                    transition-all duration-500 ease-in-out
                    ${
                      step > s
                        ? "bg-blue-600 text-white"
                        : step === s
                          ? "bg-blue-600 text-white ring-4 ring-blue-100"
                          : "bg-gray-200 text-gray-400"
                    }
                  `}
                >
                  {step > s ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    s
                  )}
                </div>
                <span
                  className={`
                    mt-1.5 text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap
                    ${step >= s ? "text-gray-900" : "text-gray-400"}
                  `}
                >
                  {s === 1 && "Details"}
                  {s === 2 && "Worker"}
                  {s === 3 && "Payment"}
                </span>
              </div>

              {/* Connector line (not after the last step) */}
              {idx < 2 && (
                <div className="flex-1 h-1 sm:h-1.5 mx-1.5 sm:mx-2 -mt-4 sm:-mt-5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full bg-blue-600 rounded-full transition-all duration-500 ease-out ${
                      step > s ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )}

  </div>
</div>

      {/* Content */}
      <CurrentStep />

      {/* Footer */}
      {/* Footer - Step 3 */}
{step < 4 && (
  <div className="border-t-2 border-gray-200 bg-white">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
      <div className="flex gap-4">
        <button
          onClick={handleBack}
          className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
        >
          Back
        </button>

        {step === 3 && isGuest ? (
          // Guest checkout at step 3
          <button
            onClick={handleSubmitBooking}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing..
              </>
            ) : (
              <>
                Continue & Login/Signup
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          // Logged-in user at step 3 OR any step
          <button
            onClick={step === 3 ? handlePaymentFlow : handleNext}
            disabled={
              loading || 
              (step === 1 && !selectedAddress) || 
              (step === 1 && !bookingDetails.scheduledDate) || 
              (step === 1 && !bookingDetails.scheduledTime)
            }
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing Payment..
              </>
            ) : (
              <>
                {step === 3 ? 'Proceed to Payment' : 'Continue'}
                {step < 3 && <ChevronRight className="w-5 h-5" />}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* Payment Modal - Add this after your existing modals */}
<PaymentModal
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  bookingId={currentBookingId}
  userEmail={clerkUser?.primaryEmailAddress?.emailAddress || user?.email}
  totalAmount={currentAmount}
  payfastMerchantId={import.meta.env.VITE_PAYFAST_MERCHANT_ID}
  onPaymentSuccess={() => {
    setStep(4); // Go to confirmation step
    setShowBookAnother(true); // Show option to book another
  }}
/>
      {/* Add Address Modal */}
      {showAddAddress && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold">Add New Address</h3>
              <button 
                onClick={() => {
                  setShowAddAddress(false);
                  setNewAddress({ query: '', apartment: '', selectedLocation: null, suggestions: [] });
                }} 
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                <div className="relative">
                  <div className="flex items-center border-2 border-blue-300 focus-within:border-blue-500 rounded-xl px-4 py-3 bg-white shadow-sm transition-all">
                    <MapPin className="text-blue-600 w-5 h-5 mr-3" />
                    <input
  ref={addressInputRef}
  type="text"
  placeholder="Start typing your address..."
  value={newAddress.query}
  onChange={(e) => {
    setNewAddress(prev => ({
      ...prev,
      query: e.target.value,
      selectedLocation: null,
      suggestions: [] // Clear suggestions when user types
    }));
  }}
  onBlur={() => {
    // Clear suggestions when user leaves the input
    // but only after a short delay to allow selection
    setTimeout(() => {
      if (newAddress.selectedLocation) {
        setNewAddress(prev => ({ ...prev, suggestions: [] }));
      }
    }, 200);
  }}
  className="w-full outline-none text-gray-800"
/>
                    {loadingAddress && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    )}
                    {newAddress.query && !loadingAddress && (
                      <button
                        onClick={() => setNewAddress(prev => ({ ...prev, query: '', selectedLocation: null, suggestions: [] }))}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {newAddress.suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {newAddress.suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => {
                            setNewAddress(prev => ({
                              ...prev,
                              query: suggestion.label,
                              selectedLocation: suggestion,
                              suggestions: []
                            }));
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-700">{suggestion.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit/Apartment Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Unit 5, Apartment 12B"
                  value={newAddress.apartment}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, apartment: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveAddress}
                  disabled={!newAddress.selectedLocation || savingAddress}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  {savingAddress ? 'Saving...' : 'Save Address'}
                </button>
                <button
                  onClick={() => {
                    setShowAddAddress(false);
                    setNewAddress({ query: '', apartment: '', selectedLocation: null, suggestions: [] });
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default FormalBookingFlow;
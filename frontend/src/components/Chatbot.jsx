import React, { useState, useEffect, useRef } from 'react';
import { Send, Minimize2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const Chatbot = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm here to help you with ShineSpec. I can assist with booking services or answer any questions about our platform. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [lastMessageTime, setLastMessageTime] = useState(Date.now());

  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const [availableVoices, setAvailableVoices] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);

  // important refs for auto-send after speaking stops
  const transcriptRef = useRef('');
  const shouldAutoSendRef = useRef(false);
  const isProcessingVoiceRef = useRef(false);

  // Pricing structure
  const PRICING_STRUCTURE = {
    'Indoor Services': { 3: 290, 4: 305, 5: 320, 6: 335, 7: 350, 8: 365 },
    'Outdoor Services': { 3.5: 350, 4: 400, 4.5: 450, 5: 500, 5.5: 550, 6: 600, 6.5: 650, 7: 700, 7.5: 750, 8: 800 },
    'Office Cleaning': { 3: 350, 3.5: 400, 4: 450, 4.5: 500, 5: 550, 5.5: 600, 6: 650, 6.5: 700, 7: 750, 7.5: 800, 8: 850 },
    'Moving Cleaning': { 3: 300, 3.5: 350, 4: 400, 4.5: 450, 5: 500, 5.5: 550, 6: 600, 6.5: 650, 7: 700, 7.5: 750, 8: 800 },
    'Laundry & Ironing': {
      small: { hours: 3, price: 350 },
      family: { hours: 4, price: 420 },
      busyWeek: { hours: 5, price: 490 },
      bigWash: { hours: 6, price: 560 },
      mega: { hours: 7, price: 630 },
      unlimited: { hours: 8, price: 700 }
    },
    "Mom's Helper": { 3: 360, 3.5: 450, 4: 500, 4.5: 550, 5: 600, 5.5: 650, 6: 700, 6.5: 750, 7: 800, 7.5: 850, 8: 900 },
    'Elder Care': { 3: 290, 4: 305, 5: 320, 6: 335, 7: 350, 8: 365 },
    'Event Cleaning': {
      small: { base: 1500, preSetup: 400, duringSupport: 600, postDeepClean: 800, fullPackage: 3300 },
      medium: { base: 3500, preSetup: 1000, duringSupport: 1500, postDeepClean: 2000, fullPackage: 8000 },
      large: { base: 8000, preSetup: 2000, duringSupport: 3000, postDeepClean: 4000, fullPackage: 17000 },
      extraLarge: { base: 15000, preSetup: 3500, duringSupport: 5000, postDeepClean: 7000, fullPackage: 30500 }
    }
  };

  const [bookingData, setBookingData] = useState({
    serviceType: null,
    homeSize: null,
    hoursNeeded: null,
    scheduledDate: null,
    scheduledTime: null,
    address: null,
    extraTasks: [],
    urgency: 'normal',
    frequency: 'one-time',
    laundryBundle: null,
    eventSize: null,
    eventCleaningScope: null,
    officeSpecialRequests: {
      extraProviders: false,
      highRiskAreas: false,
      earlyMorning: false,
      afterHours: false,
      biohazard: false,
      customRequest: ''
    },
    notes: ''
  });

  const [conversationState, setConversationState] = useState({
    step: 'welcome',
    hasAskedServiceType: false,
    hasAskedServiceDetails: false,
    hasAskedAddress: false,
    hasAskedDateTime: false,
    isReadyToBook: false
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    checkAuthStatus();
  }, [isOpen]);

  useEffect(() => {
    initializeSpeechFeatures();

    return () => {
      stopListening();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      speechQueueRef.current = [];
      isSpeakingRef.current = false;
      shouldAutoSendRef.current = false;
      transcriptRef.current = '';
      isProcessingVoiceRef.current = false;
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const cleanTextForSpeech = (text) => {
    return text
      .replace(/[📋⏰👥🧹👕📍📅🕐💰✅🚀⭐🌱]/g, '')
      .replace(/\bR(\d+)/g, 'R $1')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ', ')
      .replace(/\s+/g, ' ')
      .replace(/[:]/g, ', ')
      .trim();
  };

  const splitIntoSpeechChunks = (text, maxLength = 180) => {
    const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      if ((currentChunk + ' ' + trimmed).trim().length <= maxLength) {
        currentChunk = (currentChunk + ' ' + trimmed).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = trimmed;
      }
    }

    if (currentChunk) chunks.push(currentChunk);
    return chunks;
  };

  const speakNextChunk = () => {
    if (!speechQueueRef.current.length) {
      isSpeakingRef.current = false;
      return;
    }

    isSpeakingRef.current = true;
    const chunk = speechQueueRef.current.shift();
    const utterance = new SpeechSynthesisUtterance(chunk);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = selectedVoice?.lang || 'en-GB';
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setTimeout(() => {
        speakNextChunk();
      }, 120);
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
  };

  const speakText = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();
    speechQueueRef.current = [];

    const cleanedText = cleanTextForSpeech(text);
    const chunks = splitIntoSpeechChunks(cleanedText);

    speechQueueRef.current = chunks;

    if (!isSpeakingRef.current) {
      speakNextChunk();
    }
  };

  const initializeSpeechFeatures = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const synthesisSupported = 'speechSynthesis' in window;
    setSpeechSupported(!!SpeechRecognition && synthesisSupported);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-ZA';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        transcriptRef.current = '';
        shouldAutoSendRef.current = true;
      };

      recognition.onresult = (event) => {
        let transcript = '';

        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        transcript = transcript.trim();
        transcriptRef.current = transcript;
        setInputValue(transcript);
      };

      recognition.onend = async () => {
        setIsListening(false);

        const finalTranscript = transcriptRef.current.trim();

        if (
          shouldAutoSendRef.current &&
          finalTranscript &&
          !isProcessingVoiceRef.current
        ) {
          isProcessingVoiceRef.current = true;
          shouldAutoSendRef.current = false;

          try {
            await processUserMessage(finalTranscript);
            transcriptRef.current = '';
          } finally {
            isProcessingVoiceRef.current = false;
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        shouldAutoSendRef.current = false;

        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          addBotMessage("Sorry, I couldn't hear you clearly. Please try again or type your message.");
        }
      };

      recognitionRef.current = recognition;
    }

    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);

        if (voices.length > 0) {
          const preferredVoice =
            voices.find(v =>
              /female|zira|aria|susan|samantha|serena|google uk english female|microsoft aria/i.test(v.name)
            ) ||
            voices.find(v => /en-za/i.test(v.lang)) ||
            voices.find(v => /en-gb/i.test(v.lang)) ||
            voices.find(v => /en-us/i.test(v.lang)) ||
            voices[0];

          setSelectedVoice(preferredVoice);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening || isProcessingVoiceRef.current) return;

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      transcriptRef.current = '';
      setInputValue('');
      shouldAutoSendRef.current = true;

      recognitionRef.current.start();
    } catch (error) {
      console.error('Could not start listening:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      shouldAutoSendRef.current = false; // manual stop should not auto-send
      recognitionRef.current.stop();
    }
  };

  const addBotMessage = (text) => {
    const botMessage = {
      id: Date.now() + Math.random(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    speakText(text);
  };

  const addUserMessage = (text) => {
    const userMessage = {
      id: Date.now() + Math.random(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
  };

  const checkRateLimit = () => {
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;

    if (timeSinceLastMessage > 60000) {
      setMessageCount(0);
      setLastMessageTime(now);
      return true;
    }

    if (messageCount >= 20) {
      return false;
    }

    setMessageCount(prev => prev + 1);
    setLastMessageTime(now);
    return true;
  };

  const sanitizeInput = (input) => {
    if (!input || typeof input !== 'string') return '';

    let sanitized = input.trim();

    if (sanitized.length > 1000) {
      sanitized = sanitized.substring(0, 1000);
    }

    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/<[^>]+>/g, '');

    return sanitized;
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsLoggedIn(true);

        const addrRes = await fetch(`${API_BASE_URL}/api/auth/addresses`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (addrRes.ok) {
          const addresses = await addrRes.json();
          setUserAddresses(addresses || []);

          const defaultAddr = addresses.find(addr => addr.isDefault);
          if (defaultAddr && !bookingData.address) {
            setBookingData(prev => ({
              ...prev,
              address: {
                formattedAddress: defaultAddr.formattedAddress,
                unitNumber: defaultAddr.unitNumber || '',
                addressId: defaultAddr._id
              }
            }));
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  const calculateTotal = () => {
    const { serviceType, hoursNeeded, laundryBundle, eventSize, eventCleaningScope } = bookingData;

    if (!serviceType) return 0;

    const servicePricing = PRICING_STRUCTURE[serviceType];
    if (!servicePricing) return 290;

    if (serviceType === 'Event Cleaning' && eventSize) {
      const sizePackage = servicePricing[eventSize];
      if (!sizePackage) return 1500;

      switch (eventCleaningScope) {
        case 'preSetup': return sizePackage.base + sizePackage.preSetup;
        case 'duringSupport': return sizePackage.base + sizePackage.duringSupport;
        case 'postDeepClean': return sizePackage.base + sizePackage.postDeepClean;
        case 'fullPackage': return sizePackage.fullPackage;
        default: return sizePackage.base;
      }
    }

    if (serviceType === 'Laundry & Ironing' && laundryBundle) {
      const bundle = servicePricing[laundryBundle];
      return bundle ? bundle.price : 350;
    }

    if (!hoursNeeded) return 290;
    const h = parseFloat(hoursNeeded);

    if (servicePricing[h]) {
      return servicePricing[h];
    }

    if (serviceType === 'Indoor Services') {
      const rounded = Math.round(h);
      const validHour = Math.min(Math.max(rounded, 3), 8);
      return servicePricing[validHour] || 290;
    }

    if (['Outdoor Services', 'Office Cleaning', 'Moving Cleaning', "Mom's Helper", 'Elder Care'].includes(serviceType)) {
      const availableHours = Object.keys(servicePricing).map(Number).sort((a, b) => a - b);
      if (availableHours.length === 0) return 290;
      const closest = availableHours.reduce((prev, curr) =>
        Math.abs(curr - h) < Math.abs(prev - h) ? curr : prev
      );
      return servicePricing[closest] || 290;
    }

    return 290;
  };

  const extractBookingInfo = (text) => {
    const lowerText = text.toLowerCase().trim();
    const updated = { ...bookingData };

    if (!updated.serviceType) {
      const servicePatterns = {
        'Indoor Services': ['indoor', 'house cleaning', 'home cleaning', 'residential cleaning', 'housekeeping', 'domestic cleaning'],
        'Outdoor Services': ['outdoor', 'garden', 'gardening', 'yard', 'lawn', 'pool', 'patio', 'exterior'],
        'Office Cleaning': ['office', 'commercial', 'workplace', 'business cleaning', 'corporate'],
        'Moving Cleaning': ['moving', 'move in', 'move out', 'relocation', 'moving clean'],
        'Laundry & Ironing': ['laundry', 'washing', 'ironing', 'dry cleaning', 'clothes'],
        'Event Cleaning': ['event', 'party', 'wedding', 'function', 'celebration', 'gathering'],
        "Mom's Helper": ['mom', 'mother', 'childcare', 'nanny', 'babysitting', 'kids', 'children'],
        'Elder Care': ['elder', 'elderly', 'senior', 'care', 'caregiver', 'aged care']
      };

      for (const [serviceType, patterns] of Object.entries(servicePatterns)) {
        if (patterns.some(pattern => lowerText.includes(pattern))) {
          if (serviceType === 'Indoor Services' && (lowerText.includes('office') || lowerText.includes('outdoor'))) {
            continue;
          }
          updated.serviceType = serviceType;
          break;
        }
      }
    }

    if (updated.serviceType === 'Indoor Services' && !updated.homeSize) {
      const sizePatterns = {
        'small': ['small', '1-2', '1 to 2', 'studio', 'apartment', '1 bedroom', '2 bedroom', 'one bedroom', 'two bedroom'],
        'medium': ['medium', '3-4', '3 to 4', 'house', '3 bedroom', '4 bedroom', 'three bedroom', 'four bedroom'],
        'large': ['large', '5+', '5 or more', 'big', '5 bedroom', 'six bedroom', 'seven bedroom', 'mansion']
      };

      for (const [size, patterns] of Object.entries(sizePatterns)) {
        if (patterns.some(pattern => lowerText.includes(pattern))) {
          updated.homeSize = size;
          break;
        }
      }
    }

    if (!updated.hoursNeeded && updated.serviceType !== 'Event Cleaning' && updated.serviceType !== 'Laundry & Ironing') {
      const hourPatterns = [
        /(\d+(?:\.\d+)?)\s*(?:hour|hr|hrs|h)\b/i,
        /\b(\d+(?:\.\d+)?)\s*(?:hour|hr|hrs|h)/i,
        /for\s+(\d+(?:\.\d+)?)\s*(?:hour|hr|hrs|h)/i
      ];

      for (const pattern of hourPatterns) {
        const match = lowerText.match(pattern);
        if (match) {
          const hours = parseFloat(match[1]);
          if (hours >= 2 && hours <= 8) {
            updated.hoursNeeded = hours;
            break;
          }
        }
      }

      if (!updated.hoursNeeded) {
        const numMatch = lowerText.match(/\b([3-8])\b/);
        if (numMatch && (lowerText.includes('hour') || lowerText.includes('hr') || lowerText.includes('time'))) {
          updated.hoursNeeded = parseFloat(numMatch[1]);
        }
      }
    }

    if (!updated.scheduledDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (lowerText.includes('today')) {
        updated.scheduledDate = today.toISOString().split('T')[0];
      } else if (lowerText.includes('tomorrow')) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        updated.scheduledDate = tomorrow.toISOString().split('T')[0];
      }
    }

    if (!updated.scheduledTime) {
      const timePatterns = {
        '09:00 - 09:30': ['morning', '9am', '9 am', '9:00', 'early morning', 'am'],
        '13:00 - 13:30': ['afternoon', '1pm', '1 pm', '13:00', 'lunch', 'midday'],
        '17:00 - 17:30': ['evening', '5pm', '5 pm', '17:00', 'late afternoon', 'pm']
      };

      for (const [timeSlot, patterns] of Object.entries(timePatterns)) {
        if (patterns.some(pattern => lowerText.includes(pattern))) {
          updated.scheduledTime = timeSlot;
          break;
        }
      }
    }

    if (updated.serviceType === 'Laundry & Ironing' && !updated.laundryBundle) {
      const bundlePatterns = {
        'small': ['small', '1-2', '1 to 2', 'one to two', 'light'],
        'family': ['family', 'medium', '3-4', '3 to 4', 'three to four', 'regular'],
        'busyWeek': ['busy', '5-6', '5 to 6', 'five to six', 'heavy'],
        'bigWash': ['big', '7-8', '7 to 8', 'seven to eight', 'large'],
        'mega': ['mega', '9-10', '9 to 10', 'nine to ten', 'extra large'],
        'unlimited': ['unlimited', '10+', '10 or more', 'ten plus', 'maximum']
      };

      for (const [bundle, patterns] of Object.entries(bundlePatterns)) {
        if (patterns.some(pattern => lowerText.includes(pattern))) {
          updated.laundryBundle = bundle;
          break;
        }
      }
    }

    if (updated.serviceType === 'Event Cleaning' && !updated.eventSize) {
      const eventSizePatterns = {
        'small': ['small', '50 or less', 'under 50', 'up to 50'],
        'medium': ['medium', '51 to 150', 'between 51 and 150'],
        'large': ['large', '151 to 300', 'between 151 and 300'],
        'extraLarge': ['extra large', 'extra-large', '300+', '300 or more', 'over 300', 'more than 300']
      };

      for (const [size, patterns] of Object.entries(eventSizePatterns)) {
        if (patterns.some(pattern => lowerText.includes(pattern))) {
          updated.eventSize = size;
          break;
        }
      }
    }

    if (updated.serviceType === 'Event Cleaning' && !updated.eventCleaningScope) {
      const scopePatterns = {
        'preSetup': ['pre-setup', 'pre setup', 'before', 'setup', 'preparation', 'prep'],
        'duringSupport': ['during', 'support', 'while', 'throughout', 'ongoing'],
        'postDeepClean': ['post', 'after', 'deep clean', 'deep cleaning', 'thorough', 'complete clean'],
        'fullPackage': ['full', 'package', 'all', 'everything', 'complete', 'comprehensive'],
        'base': ['base', 'basic', 'standard', 'regular', 'normal']
      };

      for (const [scope, patterns] of Object.entries(scopePatterns)) {
        if (patterns.some(pattern => lowerText.includes(pattern))) {
          updated.eventCleaningScope = scope;
          break;
        }
      }
    }

    setBookingData(updated);
    return updated;
  };

  const getNextQuestion = (state, booking) => {
    if (!booking.serviceType) {
      return "What type of service would you like to book? I can help with Indoor Services, Outdoor Services, Office Cleaning, Moving Cleaning, Laundry & Ironing, Event Cleaning, Mom's Helper, and Elder Care. Which one interests you?";
    }

    switch (booking.serviceType) {
      case 'Indoor Services':
        if (!booking.homeSize) {
          return "Great! For Indoor Services, what size is your home? Small is 1 to 2 bedrooms, medium is 3 to 4 bedrooms, and large is 5 or more bedrooms.";
        }
        if (!booking.hoursNeeded) {
          return "How many hours of cleaning do you need? We offer 3 to 8 hours.";
        }
        break;
      case 'Office Cleaning':
        if (!booking.hoursNeeded) {
          return "How many hours of office cleaning do you need? We offer 3 to 8 hours.";
        }
        break;
      case 'Event Cleaning':
        if (!booking.eventSize) {
          return "For Event Cleaning, how many guests are you expecting? Small is up to 50 guests, medium is 51 to 150, large is 151 to 300, and extra large is over 300.";
        }
        if (!booking.eventCleaningScope) {
          return "What cleaning scope do you need? You can choose base cleaning, pre-setup, during support, post-deep clean, or the full package.";
        }
        break;
      case 'Laundry & Ironing':
        if (!booking.laundryBundle) {
          return "What laundry bundle do you need? Small is 1 to 2 loads, family is 3 to 4, busy week is 5 to 6, big wash is 7 to 8, mega is 9 to 10, and unlimited is 10 or more.";
        }
        break;
      case 'Outdoor Services':
      case 'Moving Cleaning':
      case "Mom's Helper":
      case 'Elder Care':
        if (!booking.hoursNeeded) {
          return `For ${booking.serviceType}, how many hours do you need? We offer 3 to 8 hours.`;
        }
        break;
    }

    if (!booking.address) {
      if (isLoggedIn && userAddresses.length > 0) {
        const addressList = userAddresses.map((addr, idx) =>
          `${idx + 1}. ${addr.formattedAddress}${addr.unitNumber ? `, Unit ${addr.unitNumber}` : ''}`
        ).join('\n');

        return `I found ${userAddresses.length} saved address(es):\n${addressList}\n\nWhich address should we use? Reply with the number or provide a new address.`;
      }

      return "What's the service address? Please provide the full address including street name, city, and postal code.";
    }

    if (!booking.scheduledDate) {
      return "When would you like the service? You can say today, tomorrow, or give me a specific date.";
    }

    if (!booking.scheduledTime) {
      return "What time would you prefer? You can say morning, afternoon, evening, or tell me a custom time.";
    }

    const validationErrors = validateBooking(booking);
    if (validationErrors.length > 0) {
      return `I still need a bit more information:\n${validationErrors.join('\n')}`;
    }

    const total = calculateTotal();

    return `Perfect! Here's your booking summary:

Service: ${booking.serviceType}
${booking.hoursNeeded ? `Hours: ${booking.hoursNeeded}\n` : ''}${booking.eventSize ? `Event Size: ${booking.eventSize}\n` : ''}${booking.eventCleaningScope ? `Cleaning Scope: ${booking.eventCleaningScope}\n` : ''}${booking.laundryBundle ? `Bundle: ${booking.laundryBundle}\n` : ''}Address: ${booking.address.formattedAddress}${booking.address.unitNumber ? `, Unit ${booking.address.unitNumber}` : ''}
Date: ${booking.scheduledDate}
Time: ${booking.scheduledTime}
Total: R${total.toFixed(2)}

Would you like to proceed with this booking?`;
  };

  const validateBooking = (booking) => {
    const errors = [];

    if (!booking.serviceType) errors.push('Service type is required');
    if (booking.serviceType === 'Indoor Services' && !booking.homeSize) errors.push('Home size is required for Indoor Services');
    if (booking.serviceType === 'Event Cleaning') {
      if (!booking.eventSize) errors.push('Event size is required');
      if (!booking.eventCleaningScope) errors.push('Cleaning scope is required');
    }
    if (booking.serviceType === 'Laundry & Ironing' && !booking.laundryBundle) errors.push('Laundry bundle is required');

    if (
      ['Indoor Services', 'Outdoor Services', 'Office Cleaning', 'Moving Cleaning', "Mom's Helper", 'Elder Care'].includes(booking.serviceType) &&
      !booking.hoursNeeded
    ) {
      errors.push('Hours needed is required');
    }

    if (!booking.address) errors.push('Address is required');
    if (!booking.scheduledDate) errors.push('Scheduled date is required');
    if (!booking.scheduledTime) errors.push('Scheduled time is required');

    if (booking.scheduledDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const bookingDate = new Date(booking.scheduledDate);
      if (bookingDate < today) {
        errors.push('Scheduled date cannot be in the past');
      }
    }

    if (booking.hoursNeeded && (booking.hoursNeeded < 2 || booking.hoursNeeded > 8)) {
      errors.push('Hours must be between 2 and 8');
    }

    return errors;
  };

  const handleBookingMessage = async (userInput) => {
    if (!checkRateLimit()) {
      addBotMessage("I'm receiving too many messages. Please wait a moment and try again.");
      setIsTyping(false);
      return;
    }

    const sanitizedInput = sanitizeInput(userInput);
    if (!sanitizedInput) {
      addBotMessage("I didn't understand that. Could you please rephrase?");
      setIsTyping(false);
      return;
    }

    let updatedBooking = { ...bookingData };
    const currentState = { ...conversationState };
    const lowerInput = sanitizedInput.toLowerCase().trim();

    if (isLoggedIn && userAddresses.length > 0 && !updatedBooking.address) {
      const numMatch = lowerInput.match(/^\d+$/);
      if (numMatch) {
        const selectedIndex = parseInt(numMatch[0]) - 1;
        if (selectedIndex >= 0 && selectedIndex < userAddresses.length) {
          const selectedAddr = userAddresses[selectedIndex];
          updatedBooking.address = {
            formattedAddress: selectedAddr.formattedAddress,
            unitNumber: selectedAddr.unitNumber || '',
            addressId: selectedAddr._id
          };
          currentState.hasAskedAddress = true;
          setBookingData(updatedBooking);
          setConversationState(currentState);
        } else {
          addBotMessage("That number doesn't match any saved address. Please try again or provide a new address.");
          setIsTyping(false);
          return;
        }
      }
    }

    updatedBooking = extractBookingInfo(sanitizedInput);

    const hasRequiredServiceDetails =
      (updatedBooking.serviceType === 'Indoor Services' && updatedBooking.homeSize && updatedBooking.hoursNeeded) ||
      (updatedBooking.serviceType === 'Office Cleaning' && updatedBooking.hoursNeeded) ||
      (updatedBooking.serviceType === 'Event Cleaning' && updatedBooking.eventSize && updatedBooking.eventCleaningScope) ||
      (updatedBooking.serviceType === 'Laundry & Ironing' && updatedBooking.laundryBundle) ||
      (['Outdoor Services', 'Moving Cleaning', "Mom's Helper", 'Elder Care'].includes(updatedBooking.serviceType) && updatedBooking.hoursNeeded);

    if (!updatedBooking.address && !/^\d+$/.test(sanitizedInput.trim()) && hasRequiredServiceDetails) {
      const addressKeywords = ['street', 'road', 'avenue', 'drive', 'lane', 'way', 'place', 'crescent', 'court', 'str', 'rd', 'ave', 'dr', 'ln', 'address', 'city', 'province', 'postal', 'code'];
      const hasAddressKeywords = addressKeywords.some(keyword => lowerInput.includes(keyword));
      const hasNumbers = /\d/.test(sanitizedInput);

      const isAddressPhase = hasRequiredServiceDetails && !currentState.hasAskedAddress;

      if (isAddressPhase && (hasAddressKeywords || (hasNumbers && sanitizedInput.length > 10))) {
        updatedBooking.address = {
          formattedAddress: sanitizedInput.trim(),
          unitNumber: '',
          addressId: null
        };
        currentState.hasAskedAddress = true;
      }
    }

    if (updatedBooking.serviceType && !currentState.hasAskedServiceType) {
      currentState.hasAskedServiceType = true;
      currentState.step = 'service_details';
    }

    if (hasRequiredServiceDetails && !currentState.hasAskedServiceDetails) {
      currentState.hasAskedServiceDetails = true;
    }

    if (updatedBooking.address && !currentState.hasAskedAddress) {
      currentState.hasAskedAddress = true;
    }

    if (updatedBooking.scheduledDate && updatedBooking.scheduledTime) {
      currentState.hasAskedDateTime = true;
      currentState.isReadyToBook = true;
    }

    setBookingData(updatedBooking);
    setConversationState(currentState);

    if (
      (lowerInput.includes('yes') || lowerInput.includes('proceed') || lowerInput.includes('confirm') || lowerInput.includes('book it')) &&
      updatedBooking.address &&
      updatedBooking.scheduledDate &&
      updatedBooking.scheduledTime
    ) {
      const validationErrors = validateBooking(updatedBooking);
      if (validationErrors.length === 0) {
        await createBooking(updatedBooking);
        return;
      } else {
        addBotMessage(`I need a bit more information before I can create your booking:\n${validationErrors.join('\n')}`);
        setIsTyping(false);
        return;
      }
    }

    const nextQuestion = getNextQuestion(currentState, updatedBooking);

    setTimeout(() => {
      addBotMessage(nextQuestion);
      setIsTyping(false);
    }, 1000);
  };

  const createBooking = async (booking) => {
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        addBotMessage("You need to be logged in to create a booking. Please log in to your account and try again.");
        setIsTyping(false);
        return;
      }

      const validationErrors = validateBooking(booking);
      if (validationErrors.length > 0) {
        addBotMessage(`I need more information:\n${validationErrors.join('\n')}`);
        setIsTyping(false);
        return;
      }

      const totalCost = calculateTotal();

      const bookingPayload = {
        serviceType: booking.serviceType,
        address: {
          formattedAddress: booking.address.formattedAddress,
          unitNumber: booking.address.unitNumber || '',
          ...(booking.address.addressId && { addressId: booking.address.addressId })
        },
        customTasks: booking.extraTasks || [],
        hoursNeeded: (booking.serviceType === 'Event Cleaning' || booking.serviceType === 'Laundry & Ironing') ? undefined : booking.hoursNeeded,
        frequency: booking.frequency || 'one-time',
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        notes: booking.notes || '',
        totalCost,
        payment: {
          method: 'payfast',
          status: 'pending'
        }
      };

      if (booking.serviceType === 'Event Cleaning') {
        bookingPayload.eventSize = booking.eventSize;
        bookingPayload.eventCleaningScope = booking.eventCleaningScope || 'base';
        bookingPayload.eventPackage = booking.eventSize;
      }

      if (booking.serviceType === 'Laundry & Ironing') {
        bookingPayload.laundryBundle = booking.laundryBundle || 'small';
      }

      if (booking.serviceType === 'Office Cleaning') {
        bookingPayload.officeSpecialRequests = booking.officeSpecialRequests;
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const bookingResult = await res.json();
      const bookingId = bookingResult.booking?._id || bookingResult._id;

      addBotMessage(`Booking created successfully!

Booking ID: ${bookingId}
Total amount: R${totalCost.toFixed(2)}

I'll now redirect you to complete the payment.`);

      await initializePayment(bookingId, totalCost);
    } catch (error) {
      console.error('Booking creation error:', error);
      addBotMessage(`Sorry, I encountered an error: ${error.message}. Please try again or contact our support team for assistance.`);
    } finally {
      setIsTyping(false);
    }
  };

  const initializePayment = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const userData = JSON.parse(userStr);

      const res = await fetch(`${API_BASE_URL}/api/payments/payfast/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId,
          email: userData.email,
          paymentMethod: 'payfast'
        })
      });

      if (!res.ok) {
        throw new Error('Failed to initialize payment');
      }

      const data = await res.json();

      setTimeout(() => {
        addBotMessage("Redirecting you to complete payment...");

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://www.payfast.co.za/eng/process";

        Object.entries(data.paymentData).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }, 2000);
    } catch (error) {
      console.error('Payment initialization error:', error);
      addBotMessage(`Payment initialization failed. Please visit your bookings page to complete payment. Booking ID: ${bookingId}`);
    }
  };

  const isBookingRelated = (text) => {
    const lowerText = text.toLowerCase();
    const bookingKeywords = [
      'book', 'booking', 'service', 'clean', 'cleaning', 'need help', 'schedule',
      'indoor', 'outdoor', 'office', 'moving', 'laundry', 'event', 'gardening',
      'home size', 'space', 'bedroom', 'urgent', 'asap', 'price', 'cost', 'hour',
      'pet', 'eco', 'special requirement', 'date', 'time', 'when', 'address',
      'mom', 'elder', 'care', 'helper'
    ];
    return bookingKeywords.some(keyword => lowerText.includes(keyword));
  };

  const processUserMessage = async (userInput) => {
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setInputValue('');
    setIsTyping(true);

    const isBooking = isBookingRelated(userInput);

    if (isBooking) {
      await handleBookingMessage(userInput);
    } else {
      try {
        const token = localStorage.getItem('token');
        const conversationHistory = messages.slice(-10).map(msg => ({
          sender: msg.sender,
          text: msg.text
        }));

        const response = await fetch(`${API_BASE_URL}/api/auth/chatbot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          },
          body: JSON.stringify({
            question: userInput,
            conversationHistory
          })
        });

        if (!response.ok) throw new Error('Failed to get AI response');

        const data = await response.json();
        addBotMessage(data.answer || "I'm sorry, I couldn't process your question. Please try again.");
      } catch (error) {
        console.error('Chatbot AI error:', error);
        addBotMessage("I'm having trouble processing your question right now. Please try again later or contact our support team.");
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await processUserMessage(inputValue.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleRestart = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    speechQueueRef.current = [];
    isSpeakingRef.current = false;
    shouldAutoSendRef.current = false;
    transcriptRef.current = '';
    isProcessingVoiceRef.current = false;

    setMessages([{
      id: 1,
      text: "Hi! 👋 I'm here to help you with ShineSpec. I can assist with booking services or answer any questions about our platform. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }]);

    setBookingData({
      serviceType: null,
      homeSize: null,
      hoursNeeded: null,
      scheduledDate: null,
      scheduledTime: null,
      address: null,
      extraTasks: [],
      urgency: 'normal',
      frequency: 'one-time',
      laundryBundle: null,
      eventSize: null,
      eventCleaningScope: null,
      officeSpecialRequests: {
        extraProviders: false,
        highRiskAreas: false,
        earlyMorning: false,
        afterHours: false,
        biohazard: false,
        customRequest: ''
      },
      notes: ''
    });

    setConversationState({
      step: 'welcome',
      hasAskedServiceType: false,
      hasAskedServiceDetails: false,
      hasAskedAddress: false,
      hasAskedDateTime: false,
      isReadyToBook: false
    });

    setMessageCount(0);
    setLastMessageTime(Date.now());
    setInputValue('');
    setIsListening(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-14 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${isOpen ? 'hidden' : 'block'}`}
        aria-label="Open chatbot"
      >
        <img
          src="/chatbot.png"
          alt="Chatbot"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        />
      </button>

      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-96 h-[650px] max-h-[calc(100vh-6rem)] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200">
          <div className="bg-blue-500 text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/chatbot.png"
                alt="Chatbot"
                className="w-8 h-8 object-contain bg-white rounded-full p-1"
              />
              <div>
                <h3 className="font-bold text-lg">Booking Assistant</h3>
                <p className="text-xs text-blue-100">
                  {isListening ? 'Listening... I’ll reply when you stop talking' : 'Type or speak to chat'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVoiceEnabled(prev => !prev)}
                className="text-white hover:text-blue-200 p-1 rounded hover:bg-white/20 transition"
                title={voiceEnabled ? "Mute bot voice" : "Enable bot voice"}
              >
                {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              <button
                onClick={handleRestart}
                className="text-white hover:text-blue-200 text-xs px-2 py-1 rounded hover:bg-white/20 transition"
                title="Restart conversation"
              >
                Restart
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-blue-200 p-1 rounded hover:bg-white/20 transition"
                aria-label="Close chatbot"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!speechSupported && (
            <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-xs border-b border-yellow-200">
              Voice features are not supported in this browser. Typing still works normally.
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isListening ? "Listening... speak naturally" : "Type your message..."}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                maxLength={1000}
              />

              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={!speechSupported || isProcessingVoiceRef.current}
                className={`p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="submit"
                disabled={!inputValue.trim() || isListening}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send typed message"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-gray-500 mt-2">
              Tap the microphone and speak.
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormalBookingFlow from '../components/BookingFlow';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedService = location.state?.selectedService;

  // If no service selected, redirect back to home
  React.useEffect(() => {
    if (!selectedService) {
      navigate('/');
    }
  }, [selectedService, navigate]);

  if (!selectedService) {
    return null;
  }

  return (
    <FormalBookingFlow
      selectedService={selectedService}
      onClose={() => navigate('/')}
    />
  );
};

export default BookingPage;
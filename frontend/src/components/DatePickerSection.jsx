import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DatePickerSection({
  bookingDetails,
  setBookingDetails,
  contentRef,
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const inputRef = useRef(null);
  const calendarRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCalendar]);

  // Update month when date changes
  useEffect(() => {
    if (bookingDetails.scheduledDate) {
      setCurrentMonth(new Date(bookingDetails.scheduledDate));
    }
  }, [bookingDetails.scheduledDate]);

  const handleDateSelect = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = selected.toISOString().split('T')[0];
    
    // Save scroll position like original
    if (contentRef?.current) {
      const scrollPos = contentRef.current.scrollTop;
      sessionStorage.setItem('bookingScrollPos', scrollPos.toString());
    }
    
    setBookingDetails({ ...bookingDetails, scheduledDate: dateStr });
    setShowCalendar(false);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const today = new Date().toISOString().split('T')[0];
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isDateDisabled = (day) => {
    if (!day) return true;
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return dateStr < today;
  };

  const isDateSelected = (day) => {
    if (!day || !bookingDetails.scheduledDate) return false;
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return dateStr === bookingDetails.scheduledDate;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Choose a date';
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Select start date:
      </label>

      {/* Display Input */}
      <button
        ref={inputRef}
        onClick={() => setShowCalendar(!showCalendar)}
        className={`
          w-full
          h-14
          px-4
          pr-12
          rounded-lg
          border-2
          flex
          items-center
          justify-between
          transition-all
          duration-200
          text-left
          font-medium
          ${
            bookingDetails.scheduledDate
              ? 'border-blue-500 bg-blue-50 text-gray-900'
              : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
          }
          ${showCalendar ? 'ring-2 ring-blue-200' : ''}
        `}
      >
        <span className="truncate">{formatDate(bookingDetails.scheduledDate)}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
            showCalendar ? 'text-blue-500' : 'text-gray-400'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Calendar Dropdown */}
      {showCalendar && (
        <div
          ref={calendarRef}
          className="
            absolute
            top-full
            left-0
            mt-2
            w-full
            bg-white
            border-2
            border-blue-500
            rounded-lg
            shadow-lg
            p-4
            z-50
            animate-in
            fade-in
            zoom-in-95
            duration-200
          "
        >
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="font-semibold text-gray-900">
              {currentMonth.toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric',
              })}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-500 h-8 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => (
              <button
                key={idx}
                onClick={() => day && !isDateDisabled(day) && handleDateSelect(day)}
                disabled={isDateDisabled(day)}
                className={`
                  h-8
                  rounded-md
                  font-medium
                  text-sm
                  transition-all
                  duration-150
                  flex
                  items-center
                  justify-center
                  ${
                    !day
                      ? ''
                      : isDateDisabled(day)
                        ? 'text-gray-300 cursor-not-allowed'
                        : isDateSelected(day)
                          ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                          : 'text-gray-700 hover:bg-blue-100 cursor-pointer'
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Today shortcut */}
          <button
            onClick={() => {
              const todayDate = new Date().toISOString().split('T')[0];
              setBookingDetails({ ...bookingDetails, scheduledDate: todayDate });
              setShowCalendar(false);
            }}
            className="w-full mt-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Today
          </button>
        </div>
      )}
    </div>
  );
}
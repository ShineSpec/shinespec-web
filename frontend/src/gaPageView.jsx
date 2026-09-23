import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = "G-JL2LK2BMS6";
const MAX_RETRIES = 5;
const RETRY_DELAY = 300;

const GAPageView = () => {
  const location = useLocation();
  const trackedRef = useRef(false); // Track if current page view has been tracked
  const timeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const lastPathRef = useRef(''); // Track last path to detect navigation

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset tracking flag if this is a new page (different pathname)
    if (lastPathRef.current !== location.pathname) {
      trackedRef.current = false;
      retryCountRef.current = 0;
      lastPathRef.current = location.pathname;
    }

    // Function to get a meaningful page title
    const getPageTitle = () => {
      const pageTitle = document.title || location.pathname;
      const defaultTitle = "ShineSpec";
      
      if (pageTitle === defaultTitle) {
        // Create a title from the pathname
        const pathParts = location.pathname.split('/').filter(Boolean);
        return pathParts.length > 0
          ? pathParts.map(part => 
              part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')
            ).join(' - ') + ' | ShineSpec'
          : 'Home | ShineSpec';
      }
      
      return pageTitle;
    };

    // Function to track page view (only once per page navigation)
    const trackPageView = (isRetry = false) => {
      // Check if already tracked for this navigation
      if (trackedRef.current) {
        return;
      }

      // Check if gtag is available
      if (!window.gtag) {
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          timeoutRef.current = setTimeout(() => {
            trackPageView(true);
          }, RETRY_DELAY);
          return;
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Google Analytics (gtag) not loaded. Page view not tracked:', location.pathname);
          }
          return;
        }
      }

      try {
        const finalTitle = getPageTitle();
        
        // Mark as tracked for this navigation
        trackedRef.current = true;
        
        // Send page view with both path and title using config
        window.gtag("config", GA_MEASUREMENT_ID, {
          page_path: location.pathname,
          page_title: finalTitle,
          page_location: window.location.href,
        });

        // Also send as a page_view event for GA4 (recommended for GA4)
        window.gtag("event", "page_view", {
        page_path: location.pathname,
          page_title: finalTitle,
          page_location: window.location.href,
        });

        // Log for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ GA Page View Tracked:', {
            path: location.pathname,
            title: finalTitle,
            url: window.location.href
          });
        }
      } catch (error) {
        console.error('Error tracking page view:', error);
        // Reset tracked flag so we can retry
        trackedRef.current = false;
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Wait a bit for pages that set title in useEffect and for gtag to be available
      timeoutRef.current = setTimeout(() => {
        trackPageView();
      }, 200);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location]); // Track whenever location changes

  return null;
};

export default GAPageView;

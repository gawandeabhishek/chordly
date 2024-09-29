import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize('YOUR_TRACKING_ID'); // Replace with your Google Analytics Tracking ID
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname + window.location.search);
};

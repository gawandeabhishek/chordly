import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize(import.meta.env.GOOGLE_ANALYTICS_TRACKING_ID);
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname + window.location.search);
};

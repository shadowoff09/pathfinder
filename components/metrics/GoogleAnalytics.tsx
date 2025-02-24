"use client";

import { GoogleAnalytics as GoogleAnalyticsScript } from "@next/third-parties/google";

const GoogleAnalytics = () => {
  return (
    <GoogleAnalyticsScript
      gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string}
    />
  );
};

export default GoogleAnalytics;
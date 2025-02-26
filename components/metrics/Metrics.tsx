import React from 'react'
import MicrosoftClarity from './MicrosoftClarity';
import GoogleAnalytics from './GoogleAnalytics';
import PostHogAnalytics from './PostHogAnalytics';

export default function Metrics() {
  return (
    <>
        <MicrosoftClarity />
        <GoogleAnalytics />
        <PostHogAnalytics />
    </>
  );
}

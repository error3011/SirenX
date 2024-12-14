// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import * as Spotlight from '@spotlightjs/spotlight';

Sentry.init({
	dsn: "https://dbab8da6c8f3937a04bb7ff8453deaa3@sentry.heyyczer.com/2",

	// Add optional integrations for additional features
	integrations: [
		Sentry.replayIntegration({
			maskAllInputs: false,
			maskAllText: false,
			blockAllMedia: false,
		}),
	],

	// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
	tracesSampleRate: 0.1,

	// Define how likely Replay events are sampled.
	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.01,

	// Define how likely Replay events are sampled when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});

if (process.env.NODE_ENV === 'development') {
	Spotlight.init();
}
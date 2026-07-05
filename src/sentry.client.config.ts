import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://b10d02c4a5697c3624e3f7775ba1735f@o4510903685677056.ingest.us.sentry.io/4510903688036352",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
  // Enable logs to be sent to Sentry
  enableLogs: true,
});

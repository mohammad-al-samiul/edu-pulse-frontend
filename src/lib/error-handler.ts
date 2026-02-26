// Client-side error handling utilities

export function initializeErrorHandling() {
  // Handle unhandled promise rejections
  if (typeof window !== "undefined") {
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);

      // Prevent the default browser behavior
      event.preventDefault();

      // You could also show a user-friendly error message here
      // For example, using a toast notification
    });

    // Handle uncaught errors
    window.addEventListener("error", (event) => {
      console.error("Uncaught error:", event.error);

      // You could also show a user-friendly error message here
    });
  }
}

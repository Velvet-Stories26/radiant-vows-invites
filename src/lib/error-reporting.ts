type ErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  
  // Log to console in development
  if (process.env["NODE_ENV"] === "development") {
    console.error("Error reported:", error, context);
  }
  
  // Normalize error message
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  
  const stack = error instanceof Error ? error.stack : undefined;
  
  // Log error details to help with debugging
  console.error({
    message,
    stack,
    context,
    pathname: window.location.pathname,
  });
}

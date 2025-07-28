import React, {
  ComponentType,
  ReactNode,
  Suspense,
  useEffect,
  useRef,
  ErrorInfo,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RetryComponentProps } from "./RetryComponentProps";
import { DefaultErrorComponent } from "./DefaultErrorComponent";
import { DefaultLoadingAnimation } from "./DefaultLoadingAnimation";

// Props for LazyLoad
export interface LazyLoadProps<T extends object> {
  // Component import function
  importFn: () => Promise<any>;

  // Props to pass to the loaded component
  componentProps?: T;

  // Loading options
  retries?: number;
  retryDelay?: number;

  // UI components
  loadingComponent?: ComponentType;
  errorComponent?: ComponentType<RetryComponentProps>;

  // Callbacks
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;

  // Enable/disable verbose logging
  verbose?: boolean;
}

/**
 * Lazy loads React components with automatic retry logic
 * @example
 * <LazyLoad
 *   importFn={() => import('./MyComponent')}
 *   retries={3}
 *   verbose={true}
 * />
 */
export const LazyLoad = <T extends object>({
  importFn,
  componentProps,
  retries = 3,
  retryDelay = 1000,
  loadingComponent,
  errorComponent,
  onError,
  onRetry,
  verbose = false,
}: LazyLoadProps<T>) => {
  // Logger function that respects verbose flag
  const log = React.useCallback(
    (level: "info" | "error", ...args: any[]) => {
      if (!verbose) return;

      const prefix = "[LazyLoad]";

      if (level === "info") {
        console.log(prefix, ...args);
      } else {
        console.error(prefix, ...args);
      }
    },
    [verbose]
  );

  const [mountKey, setMountKey] = React.useState(0);
  const [retryKey, setRetryKey] = React.useState(0);
  const timersRef = useRef<Set<number>>(new Set());
  const isMountedRef = useRef(true);

  const createSafeTimeout = React.useCallback(
    (callback: () => void, delay: number) => {
      if (!isMountedRef.current) {
        return;
      }

      const timerId = window.setTimeout(() => {
        timersRef.current.delete(timerId);

        if (isMountedRef.current) {
          callback();
        }
      }, delay);

      timersRef.current.add(timerId);
      return timerId;
    },
    []
  );

  const clearAllTimers = React.useCallback(() => {
    timersRef.current.forEach((timerId) => {
      clearTimeout(timerId);
    });
    timersRef.current.clear();
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      clearAllTimers();
      log("info", "Component unmounted, all timers cleared");
    };
  }, [clearAllTimers, log]);

  // Create lazy component with automatic retry logic
  const LazyComponent = React.useMemo(() => {
    log(
      "info",
      `Creating new lazy component instance with retryKey: ${retryKey}`
    );

    return React.lazy(() => {
      return new Promise<any>((resolve, reject) => {
        let attempts = 0;
        let currentAttemptCancelled = false;

        const tryImport = () => {
          if (currentAttemptCancelled || !isMountedRef.current) {
            reject(new Error("Import cancelled due to component unmount"));
            return;
          }

          importFn()
            .then((module) => {
              if (!currentAttemptCancelled && isMountedRef.current) {
                resolve(module);
              }
            })
            .catch((error) => {
              if (currentAttemptCancelled || !isMountedRef.current) {
                reject(new Error("Import cancelled due to component unmount"));
                return;
              }

              attempts++;
              log(
                "info",
                `Import attempt ${attempts}/${retries} failed:`,
                error.message
              );

              if (attempts >= retries) {
                reject(error);
              } else {
                const delay = retryDelay * attempts;
                log("info", `Retrying in ${delay}ms...`);

                createSafeTimeout(tryImport, delay);
              }
            });
        };

        tryImport();

        return () => {
          currentAttemptCancelled = true;
        };
      });
    });
  }, [importFn, retries, retryDelay, retryKey, log, createSafeTimeout]);

  React.useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [retryKey, clearAllTimers]);

  // Error handler for logging
  const handleError = React.useCallback(
    (error: Error, errorInfo: ErrorInfo) => {
      log("error", "LazyLoad Error:", error);
      log("error", "Component Stack:", errorInfo.componentStack);

      // Call user-provided error handler
      onError?.(error, errorInfo);
    },
    [log, onError]
  );

  // Function to retry lazy component
  const retryLazyComponent = React.useCallback(() => {
    log("info", "Forcing lazy component recreation...");
    clearAllTimers();
    setRetryKey((prev) => prev + 1);
  }, [log, clearAllTimers]);

  // Reset error handler
  const handleReset = React.useCallback(() => {
    log("info", "Retrying component loading...");

    // 1. First recreate the lazy component
    retryLazyComponent();

    // 2. Increment key to force remount children
    setMountKey((prev) => {
      const newKey = prev + 1;
      log("info", `Remounting component with key: ${newKey}`);
      return newKey;
    });

    // 3. Notify parent component (if additional logic needed)
    onRetry?.();
  }, [log, retryLazyComponent, onRetry]);

  // Error fallback component
  const ErrorFallback = React.useCallback(
    (props: {
      error: Error;
      resetErrorBoundary: () => void;
    }): React.JSX.Element => {
      const { error, resetErrorBoundary } = props;

      const handleRetry = () => {
        handleReset();
        resetErrorBoundary();
      };

      // Use custom error component if provided
      if (errorComponent) {
        if (React.isValidElement(errorComponent)) {
          return React.cloneElement(errorComponent as React.ReactElement, {
            error,
            resetErrorBoundary: handleRetry,
          });
        }

        if (typeof errorComponent === "function") {
          const ErrorComponent =
            errorComponent as ComponentType<RetryComponentProps>;
          return (
            <ErrorComponent error={error} resetErrorBoundary={handleRetry} />
          );
        }

        return errorComponent as React.JSX.Element;
      }

      // Use default error component
      return (
        <DefaultErrorComponent error={error} resetErrorBoundary={handleRetry} />
      );
    },
    [handleReset, errorComponent]
  );

  // Render loading component
  const renderLoadingComponent = (): NonNullable<ReactNode> => {
    if (!loadingComponent) {
      return <DefaultLoadingAnimation />;
    }

    if (React.isValidElement(loadingComponent)) {
      return loadingComponent;
    }

    if (typeof loadingComponent === "function") {
      const LoadingComponent = loadingComponent as ComponentType;
      return <LoadingComponent />;
    }

    return loadingComponent as NonNullable<ReactNode>;
  };

  return (
    <ErrorBoundary
      fallbackRender={ErrorFallback}
      onError={handleError}
      onReset={handleReset}
      resetKeys={[mountKey, retryKey]}
    >
      <Suspense fallback={renderLoadingComponent()}>
        <React.Fragment key={mountKey}>
          <LazyComponent {...componentProps} />
        </React.Fragment>
      </Suspense>
    </ErrorBoundary>
  );
};

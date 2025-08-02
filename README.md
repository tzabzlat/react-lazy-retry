# @tzabzlat/react-lazy-retry

Simple React component lazy loading with automatic retry logic and loading error handling.

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Read this in other languages: [English](README.md), [Русский](README.ru.md)*

## Features

- Simple usage: `<LazyLoad importFn={() => import('./MyComponent')}/>`,
- Retry attempts without page reload: automatic and/or user-triggered,
- Customizable UI: you can provide your own loading and error components.

## Installation

```bash
npm install @tzabzlat/react-lazy-retry
```

## Quick Start

```typescript
import React from 'react';
import { LazyLoad } from '@tzabzlat/react-lazy-retry';

function App() {
  return (
    <div>
      <LazyLoad importFn={() => import('./MyComponent')}/>
    </div>
  );
}
```

## Usage Examples

### Basic Usage

```typescript
import { LazyLoad } from '@tzabzlat/react-lazy-retry';

// Simple lazy loading
<LazyLoad importFn={() => import('./Dashboard')} />
```

### With Component Props

```typescript
// Without typing
<LazyLoad
  importFn={() => import('./UserProfile')}
  componentProps={{
    userId: 123,
    theme: 'dark'
  }}
/>

// With typing
interface UserProfileProps {
  userId: number;
  theme: 'light' | 'dark';
}

<LazyLoad<UserProfileProps>
  importFn={() => import('./UserProfile')}
  componentProps={{
    userId: 123,
    theme: 'dark'
  }}
/>
```

### Advanced Configuration

```typescript
interface AnalyticsChartProps {
  dataSource: string;
  refreshInterval?: number;
}

<LazyLoad<AnalyticsChartProps>
  importFn={() => import('./AnalyticsChart')}
  componentProps={{
    dataSource: 'api/analytics',
    refreshInterval: 5000
  }}
  retries={5}
  retryDelay={2000}
  verbose={true}
  onError={(error, errorInfo) => {
    console.error('Component loading error:', error);
    // Send to analytics
    analytics.track('component_load_error', {
      component: 'AnalyticsChart',
      error: error.message
    });
  }}
  onRetry={() => {
    console.log('Retrying component loading...');
  }}
/>
```

### Custom Loading and Error Components

```typescript
import { LazyLoad, RetryComponentProps } from '@tzabzlat/react-lazy-retry';

// Custom loading component
const CustomLoad = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-2">Loading component...</span>
  </div>
);

// Custom error component
const CustomError: React.FC<RetryComponentProps> = ({ error, resetErrorBoundary }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <h3 className="text-red-800 font-semibold">Loading Error</h3>
    <p className="text-red-600 text-sm mt-1">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Try Again
    </button>
  </div>
);

// Usage
<LazyLoad
  importFn={() => import('./MyComponent')}
  loadingComponent={CustomLoad}
  errorComponent={CustomError}
/>
```

## API

### LazyLoadProps<T>

| Parameter          | Type                                           | Default                   | Description                                |
|--------------------|------------------------------------------------|---------------------------|--------------------------------------------|
| `importFn`         | `() => Promise<any>`                           | **required**              | Component import function                  |
| `componentProps`   | `T`                                            | `undefined`               | Props to pass to the loaded component      |
| `retries`          | `number`                                       | `3`                       | Number of retry attempts                   |
| `retryDelay`       | `number`                                       | `1000`                    | Delay between attempts (ms)                |
| `loadingComponent` | `ComponentType`                                | `DefaultLoadingAnimation` | Component to display loading state         |
| `errorComponent`   | `ComponentType<RetryComponentProps>`           | `DefaultErrorComponent`   | Component to display loading error         |
| `onError`          | `(error: Error, errorInfo: ErrorInfo) => void` | `undefined`               | Callback on error                          |
| `onRetry`          | `() => void`                                   | `undefined`               | Callback on retry attempt                  |
| `verbose`          | `boolean`                                      | `false`                   | Enable detailed logging                    |

### RetryComponentProps

```typescript
interface RetryComponentProps {
  error: Error;
  resetErrorBoundary: () => void;
}
```

## Compatibility

- React 16.8+
- TypeScript 4.0+

## Contributing

Thanks to [@Gorefistus](https://github.com/Gorefistus) for adding generic type support!

If you found a bug or have suggestions for improvement, feel free to:

- Create an issue with a description of the problem or suggestion
- Submit pull requests with fixes or new features

## License

MIT
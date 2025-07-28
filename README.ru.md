# @tzabzlat/react-lazy-retry

Простая ленивая загрузка React компонентов с автоматическими повторными попытками и обработкой ошибок загрузки.

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Read this in other languages: [English](README.md), [Русский](README.ru.md)*

## Особенности

- Простое использование: `<LazyLoad importFn={() => import('./MyComponent')}/>`,
- Повторные попытки без перезагрузки страницы: автоматически и/или через действие пользователя,
- Кастомизируемый UI: можно задать собственные компоненты загрузки и ошибок.

## Установка

```bash
npm install @tzabzlat/react-lazy-retry
```

## Быстрый старт

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

## Примеры использования

### Базовое использование

```typescript
import { LazyLoad } from '@tzabzlat/react-lazy-retry';

// Простая ленивая загрузка
<LazyLoad importFn={() => import('./Dashboard')} />
```

### С передачей props в компонент

```typescript
<LazyLoad
  importFn={() => import('./UserProfile')}
  componentProps={{
    userId: 123,
    theme: 'dark'
  }}
/>
```

### Расширенная конфигурация

```typescript
<LazyLoad
  importFn={() => import('./AnalyticsChart')}
  retries={5}
  retryDelay={2000}
  verbose={true}
  onError={(error, errorInfo) => {
    console.error('Ошибка загрузки компонента:', error);
    // Отправка в аналитику
    analytics.track('component_load_error', {
      component: 'AnalyticsChart',
      error: error.message
    });
  }}
  onRetry={() => {
    console.log('Повторная попытка загрузки...');
  }}
/>
```

### Кастомные компоненты загрузки и ошибок

```typescript
import { LazyLoad, RetryComponentProps } from '@tzabzlat/react-lazy-retry';

// Кастомный компонент загрузки
const CustomLoad = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-2">Загружаем компонент...</span>
  </div>
);

// Кастомный компонент ошибки
const CustomError: React.FC<RetryComponentProps> = ({ error, resetErrorBoundary }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <h3 className="text-red-800 font-semibold">Ошибка загрузки</h3>
    <p className="text-red-600 text-sm mt-1">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Попробовать снова
    </button>
  </div>
);

// Использование
<LazyLoad
  importFn={() => import('./MyComponent')}
  loadingComponent={CustomLoad}
  errorComponent={CustomError}
/>
```

## API

### LazyLoadProps

| Параметр           | Тип                                            | По умолчанию              | Описание                                   |
|--------------------|------------------------------------------------|---------------------------|--------------------------------------------|
| `importFn`         | `() => Promise<any>`                           | **обязательный**          | Функция импорта компонента                 |
| `componentProps`   | `Record<string, any>`                          | `undefined`               | Props для передачи в загруженный компонент |
| `retries`          | `number`                                       | `3`                       | Количество повторных попыток               |
| `retryDelay`       | `number`                                       | `1000`                    | Задержка между попытками (мс)              |
| `loadingComponent` | `ComponentType`                                | `DefaultLoadingAnimation` | Компонент отображения состояния загрузки   |
| `errorComponent`   | `ComponentType<RetryComponentProps>`           | `DefaultErrorComponent`   | Компонент отображения ошибки загрузки      |
| `onError`          | `(error: Error, errorInfo: ErrorInfo) => void` | `undefined`               | Callback при ошибке                        |
| `onRetry`          | `() => void`                                   | `undefined`               | Callback при повторной попытке             |
| `verbose`          | `boolean`                                      | `false`                   | Включить подробное логирование             |

### RetryComponentProps

```typescript
interface RetryComponentProps {
  error: Error;
  resetErrorBoundary: () => void;
}
```

## Совместимость

- React 16.8+
- TypeScript 4.0+

### Вклад в проект
Если вы нашли ошибку или у вас есть предложения по улучшению, не стесняйтесь:

- Создавать issue с описанием проблемы или предложения
- Предлагать pull request'ы с исправлениями или новыми функциями

## Лицензия

MIT
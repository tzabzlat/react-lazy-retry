import {RetryComponentProps} from "./RetryComponentProps";
import React from "react";

export const DefaultErrorComponent: React.FC<RetryComponentProps> = ({ error, resetErrorBoundary }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        padding: '20px',
        textAlign: 'center'
    }}>
        <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            color: '#e74c3c'
        }}>
            ⚠️
        </div>
        <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '20px',
            color: '#333'
        }}>
            Failed to load component
        </h3>
        <p style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            color: '#666',
            maxWidth: '400px'
        }}>
            {error.message || 'An unexpected error occurred'}
        </p>
        <button
            onClick={resetErrorBoundary}
            style={{
                padding: '8px 16px',
                fontSize: '14px',
                color: '#fff',
                backgroundColor: '#3498db',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                outline: 'none',
                boxShadow: 'none'
            }}
            onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(52, 152, 219, 0.5)';
            }}
            onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            Retry
        </button>
    </div>
);
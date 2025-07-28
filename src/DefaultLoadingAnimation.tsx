import React from "react";

export const DefaultLoadingAnimation: React.FC = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        fontSize: '16px',
        color: '#666'
    }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{
                display: 'inline-flex',
                gap: '4px',
                marginBottom: '16px'
            }}>
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#3498db',
                            borderRadius: '50%',
                            opacity: index === 0 ? 1 : index === 1 ? 0.6 : 0.3,
                            transition: 'opacity 0.3s ease',
                        }}
                    />
                ))}
            </div>
            <div>Loading...</div>
        </div>
    </div>
);
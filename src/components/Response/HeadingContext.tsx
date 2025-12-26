import React, { createContext, useContext, useRef, useCallback, useState } from 'react';

interface HeadingContextType {
    lastHeading: React.MutableRefObject<string | null>;
    consumedHeadings: string[];
    consumeHeading: (text: string) => void;
    resetConsumedHeadings: () => void;
}

const HeadingContext = createContext<HeadingContextType | null>(null);

export const HeadingTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const lastHeading = useRef<string | null>(null);
    const [consumedHeadings, setConsumedHeadings] = useState<string[]>([]);

    const consumeHeading = useCallback((text: string) => {
        setConsumedHeadings(prev => [...prev, text]);
    }, []);

    const resetConsumedHeadings = useCallback(() => {
        setConsumedHeadings([]);
        lastHeading.current = null;
    }, []);

    return (
        <HeadingContext.Provider value={{ lastHeading, consumedHeadings, consumeHeading, resetConsumedHeadings }}>
            {children}
        </HeadingContext.Provider>
    );
};

export const useHeadingTracking = () => {
    const context = useContext(HeadingContext);
    if (!context) {
        throw new Error('useHeadingTracking must be used within a HeadingTracker');
    }
    return context;
};

/**
 * Recursive helper to extract text content from React nodes
 */
export const extractTextFromChildren = (children: React.ReactNode): string => {
    if (typeof children === 'string') {
        return children;
    }
    if (typeof children === 'number') {
        return String(children);
    }
    if (Array.isArray(children)) {
        return children.map(extractTextFromChildren).join('');
    }
    if (React.isValidElement(children)) {
        const element = children as React.ReactElement<any>;
        if (element.props.children) {
            return extractTextFromChildren(element.props.children);
        }
    }
    return '';
};

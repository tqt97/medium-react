import { useEffect, useRef } from 'react';

// Custom hook to focus on an input element when an error occurs
export function useFocusOnError(errors: { [key: string]: string }, fieldName: string) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (errors[fieldName]) {
            inputRef.current?.focus();
        }
    }, [errors, fieldName]);

    return inputRef;
}

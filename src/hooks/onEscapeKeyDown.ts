import { useEffect } from 'react';

const ESCAPE_KEYCODE = 'Escape';

interface callbackFunc {
  (): any;
};

const useOnEscapeKeyDown = (isListening: boolean, onEscapeKeyDown: callbackFunc) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ESCAPE_KEYCODE) {
        onEscapeKeyDown();
      }
    };

    if (isListening) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isListening, onEscapeKeyDown]);
};

export default useOnEscapeKeyDown;

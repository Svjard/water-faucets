import { useEffect, useRef, MutableRefObject, RefObject } from 'react';

interface callbackFunc {
  (): any;
};

const useOnOutsideClick = (
  $ignoredElementRefs: Array<RefObject<Element|undefined>>,
  isListening: boolean,
  onOutsideClick: callbackFunc,
  $listeningElementRef: RefObject<Element|undefined>,
) => {
  const $mouseDownTargetRef: MutableRefObject<Element|null> = useRef<Element|null>(null);

  useEffect(() => {
    const handleMouseDown = (event: Event) => {
      $mouseDownTargetRef.current = event.target as Element;
    };

    const handleMouseUp = (event: Event) => {
      const isAnyIgnoredElementAncestorOfTarget = ($ignoredElementRefs || []).some(
        ($elementRef: RefObject<Element|undefined>) => {
          if (!$elementRef || !$elementRef.current) {
            return false;
          }

          return $elementRef.current.contains($mouseDownTargetRef.current) ||
            $elementRef.current.contains(event.target as Element);
        },
      );
      
      if ((event as MouseEvent).button === 0 && !isAnyIgnoredElementAncestorOfTarget) {
        onOutsideClick();
      }
    };

    const $listeningElement = $listeningElementRef && $listeningElementRef.current ? $listeningElementRef.current : document;

    if (isListening) {
      $listeningElement.addEventListener('mousedown', handleMouseDown);
      $listeningElement.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      $listeningElement.removeEventListener('mousedown', handleMouseDown);
      $listeningElement.removeEventListener('mouseup', handleMouseUp);
    };
  }, [$ignoredElementRefs, $listeningElementRef, isListening, onOutsideClick]);
};

export default useOnOutsideClick;

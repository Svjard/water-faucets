import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback
} from 'react';
import ReactDOM from 'react-dom';

import useOnOutsideClick from '../hooks/onOutsideClick';
import useOnEscapeKeyDown from '../hooks/onEscapeKeyDown';

import './SimModal.css';

interface IModalProps {
  className?: string;
  width?: number;
  title?: string;
  isOpen: boolean;
  total: number;
  onClose?: (sim?: string|null, mode?: string) => void;
}

const defaultProps: IModalProps = {
  className: undefined,
  width: 600,
  total: 10,
  isOpen: true,
  onClose: () => {},
};

const validateInput = (input?: string|null, total?: number): string|null => {
  if (!input) {
    return 'This field is required to run a simulation';
  } else if (!input.match(/^[\d+\s+\d+\s+]+$/)) {
    return 'The simulation does not have the correct format';
  }

  const lines = input.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const indices = lines[i].trim().split(/\s+/);
    if (indices.length !== 2) {
      return 'Each line must contain two indices';
    }
    
    if (total) {
      if (+indices[0] < 0 ||
        +indices[0] > total-1 ||
        +indices[1] < 0 ||
        +indices[1] > total-1) {
        return 'Indices out of range';
      }
    }
  }

  return null;
}

const Modal = ({
  title,
  width,
  isOpen,
  total,
  onClose,
}: IModalProps = defaultProps) => {
  const [stateIsOpen, setStateOpen] = useState(isOpen);
  const [simError, setSimError] = useState<string|null>(null);
  
  const $modalRef = useRef<HTMLDivElement>(null);
  const $clickableOverlayRef = useRef<HTMLDivElement>(null);
  const $simRef = useRef<HTMLTextAreaElement>(null);

  const closeModal = useCallback((sim?: string|null, mode?: string) => {
    const err = validateInput(sim, total);
    
    const isStr = typeof sim === 'string';
    if (!isStr || (isStr && sim && !err)) {
      setStateOpen(false);
      if (onClose) {
        onClose(sim, mode);
      }
    } else if (err) {
      setSimError(err);
    }
  }, [onClose, total]);

  useOnOutsideClick([$modalRef], isOpen, closeModal, $clickableOverlayRef);
  useOnEscapeKeyDown(isOpen, closeModal);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  const validateSim = useCallback((sim?: string|null) => {
    setSimError(validateInput(sim, total));
  }, [total]);

  const $root = document.body;

  return (
    <Fragment>
      {stateIsOpen &&
      ReactDOM.createPortal(
        <div className="ScrollOverlay">
          <div className="ClickableOverlay" ref={$clickableOverlayRef}>
            <div className="Modal" ref={$modalRef}>
              <div className="CloseIcon" onClick={() => closeModal()} />
              {title && <div className="ModalHeader">
                <div className="ModalHeaderContainer">
                  <div className="ModalHeaderTitle">{title}</div>
                </div>
              </div>}
              <h4>Enter a simulation in the text field below. Each line must contain a starting index and ending index seperated by whitespace, e.g. 1 4</h4>
              <textarea rows={12} ref={$simRef} onChange={() => validateSim($simRef.current && $simRef.current.value)}></textarea>
              {simError && <div>{simError}</div>}
              <div className="Modal-Container">
                <div className="Modal-GridRow">
                  <button
                    className="Modal-Btn"
                    onClick={() => closeModal($simRef.current && $simRef.current.value, 'step')}
                  >Animate Simulation</button>
                  <button
                    className="Modal-Btn"
                    onClick={() => closeModal($simRef.current && $simRef.current.value, 'final')}
                  >Run Simulation</button>
                  <button
                    className="Modal-Btn"
                    onClick={() => closeModal()}
                  >Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        $root,
      )}
    </Fragment>
  );
};

export default Modal;
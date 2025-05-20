import { useToast } from '../../hooks/useToast';
import Toast from './Toast';

const ToastContainer = () => {
  const { toast, hideToast } = useToast();
  
  return (
    <Toast
      message={toast.message}
      type={toast.type || 'info'}
      show={toast.show}
      onClose={hideToast}
    />
  );
};

export default ToastContainer;

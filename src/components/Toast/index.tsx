import { motion } from 'framer-motion';
import { ToastBar, Toaster, ToastOptions } from 'react-hot-toast';

const toastOptions: ToastOptions = {
  position: "top-right",
  style: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#FFFF',
    backgroundColor: '#1B873F',
    borderRadius: 0,
    padding: 14
  }
}

export function Toast() {
  return (
    <Toaster 
      toastOptions={toastOptions}
    >
      {(t) => (
        <motion.div
          animate={{
            opacity: t.visible ? 1 : 0,
            translateX: t.visible ? -50 : 0
          }}
        >
          <ToastBar 
            toast={t}
            style={{
              ...t.style,
              animation: '',
            }}
          />
        </motion.div>
      )}
    </Toaster>
  );
}
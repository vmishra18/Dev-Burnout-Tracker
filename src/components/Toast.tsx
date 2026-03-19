import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface ToastProps {
  message: string;
  variant?: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, variant = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2800);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  const isSuccess = variant === "success";
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="fixed bottom-5 right-5 z-50"
      >
        <div
          className={`glass-panel flex items-center gap-3 rounded-2xl px-4 py-3 ${
            isSuccess ? "border-success/30" : "border-danger/30"
          }`}
        >
          <Icon size={18} className={isSuccess ? "text-success" : "text-danger"} />
          <span className="text-sm font-semibold text-foreground">{message}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

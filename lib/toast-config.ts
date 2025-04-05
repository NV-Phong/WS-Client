import { toast } from "sonner";

const commonToastStyle = {
  className: "bg-background border-border",
  style: {
    background: "var(--background)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
    borderRadius: "var(--radius)",
  },
};

export const toastConfig = {
  success: commonToastStyle,
  error: commonToastStyle,
};

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      ...toastConfig.success,
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      ...toastConfig.error,
    });
  },
}; 
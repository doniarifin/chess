import { useEffect } from "react";

type Props = {
  open: boolean;
  type?: "success" | "error" | "info";
  message: string;
  onClose: () => void;
  duration?: number;
};

export default function NotificationModal({
  open,
  type = "info",
  message,
  onClose,
  duration = 2000,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  const colors = {
    success: "#22c55e",
    error: "#ef4444",
    info: "#3b82f6",
  };

  return (
    <div style={styles.overlay}>
      <div
        style={{
          ...styles.modal,
          borderColor: colors[type],
        }}
      >
        <div
          style={{
            ...styles.dot,
            background: colors[type],
          }}
        />
        <p style={styles.text}>{message}</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 9999,
  },
  modal: {
    minWidth: 200,
    padding: "12px 16px",
    background: "#111",
    color: "#fff",
    borderRadius: 8,
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    animation: "fadeIn 0.2s ease",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
  text: {
    margin: 0,
    fontSize: 14,
  },
};

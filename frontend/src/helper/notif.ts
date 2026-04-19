import { useState } from "react";

type NotifType = "info" | "success" | "error";

export function useNotif() {
  const [notif, setNotif] = useState<{
    open: boolean;
    type: NotifType;
    message: string;
  }>({
    open: false,
    type: "info",
    message: "",
  });

  const showNotif = (type: NotifType, message: string) => {
    setNotif({
      open: true,
      type,
      message,
    });
  };

  const closeNotif = () => {
    setNotif((p) => ({ ...p, open: false }));
  };

  return { notif, showNotif, closeNotif };
}

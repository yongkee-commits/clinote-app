import { Outlet } from "react-router";
import { Toaster } from "sonner";

export function Root() {
  return (
    <>
      <Outlet />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.85)',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            padding: '12px 20px',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
}

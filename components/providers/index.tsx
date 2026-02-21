"use client";
import React from "react";
import QueryProvider from "./query-provider";
import { ThemeProvider } from "next-themes";
import { SocketIoProvider } from "./socket-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "./auth-provider";
import ModalProvider from "./modal-provider";
const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        storageKey="bulsujuans"
      >
        <SocketIoProvider>
          <QueryProvider>
            <AuthProvider>
              <ModalProvider />
              {/* <SessionProvider> */}
              {children}
              <Toaster position="top-center" />
              {/* </SessionProvider> */}
              <ModalProvider />
            </AuthProvider>
          </QueryProvider>
        </SocketIoProvider>
      </ThemeProvider>
    </>
  );
};

export default Provider;

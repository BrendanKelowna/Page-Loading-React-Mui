import { LinearProgressProps } from "@mui/material";
import { createContext, ReactNode, useContext, useMemo } from "react";
import usePageLoading from "./usePageLoading";

//* State
export type PageLoadingContextState = {
  variant: LinearProgressProps["variant"];
  value?: number;
  loading?: boolean;
};

const defaultState: PageLoadingContextState = {
  variant: "indeterminate",
};

const PageLoadingContext = createContext(defaultState);

export function usePageLoadingContext() {
  return useContext(PageLoadingContext);
}

//* Services
export type PageLoadingContextServices = {
  add: (id: string | number, value?: number | null) => void;
  remove: (id: string | number) => void;
  update: (id: string | number, value?: number | null) => void;
};

const errorMessage = "PageLoadingProvider not found";
const defaultServices: PageLoadingContextServices = {
  add: () => {
    throw new Error(errorMessage);
  },
  remove: () => {
    throw new Error(errorMessage);
  },
  update: () => {
    throw new Error(errorMessage);
  },
};
const ServicesContext = createContext(defaultServices);

export function usePageLoadingServicesContext() {
  return useContext(ServicesContext);
}

export function PageLoadingProvider({ children }: { children: ReactNode }) {
  const { add, remove, update, variant, value, loading } = usePageLoading();

  const state = useMemo(() => ({ variant, value, loading }), [variant, value, loading]);

  const services = useMemo(() => ({ add, remove, update }), [add, remove, update]);

  return (
    <PageLoadingContext.Provider value={state}>
      <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>
    </PageLoadingContext.Provider>
  );
}

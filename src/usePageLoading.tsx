import { LinearProgressProps } from "@mui/material";
import { useState } from "react";

//* Types
export type PageLoadingState = ReturnType<typeof usePageLoading>;

type Loaders = { [id: string | number]: number | null };

//* Definitions

//* Styling

//* Helpers

export default function usePageLoading() {
  //* Context

  //* State
  const [loaders, setLoaders] = useState<Loaders>({});

  const determinates = Object.values(loaders).filter(
    (value): value is number => value !== null
  );

  const variant: LinearProgressProps["variant"] = determinates.length
    ? "determinate"
    : "indeterminate";

  const totalValue = determinates.reduce((acc, value) => acc + value, 0);
  const totalPercent = totalValue / determinates.length;

  const loading = !!Object.keys(loaders).length;

  //* Effects

  //* Handlers
  function add(id: string | number, value?: number | null) {
    const newValue = value ?? null;
    setLoaders((state) => ({ ...state, [id]: newValue }));
  }

  function remove(id: string | number) {
    setLoaders((state) => {
      const newState = { ...state };
      delete newState[id];
      return newState;
    });
  }

  function update(id: string | number, value?: number | null) {
    if ((value ?? 0) >= 100) return remove(id);
    return add(id, value);
  }

  //* Renders
  return {
    add,
    remove,
    update,
    variant,
    value: totalPercent,
    loading,
  };
}

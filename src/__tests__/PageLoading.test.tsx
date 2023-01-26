import { act, render, screen } from "@testing-library/react";
import PageLoading from "../PageLoading";
import {
  PageLoadingContextServices,
  PageLoadingContextState,
  PageLoadingProvider,
  usePageLoadingContext,
  usePageLoadingServicesContext,
} from "../PageLoadingContext";
import usePageLoading, { PageLoadingState } from "../usePageLoading";

function MockPageLoadingWithState({ state }: { state: PageLoadingState }) {
  const newState = usePageLoading();
  Object.assign(state, newState);
  return (
    <PageLoading
      loading={newState.loading}
      value={newState.value}
      variant={newState.variant}
    />
  );
}

function MockPageLoadingWithContext({
  services,
  state,
}: {
  services: PageLoadingContextServices;
  state: PageLoadingContextState;
}) {
  const newServices = usePageLoadingServicesContext();
  Object.assign(services, newServices);

  const newState = usePageLoadingContext();
  Object.assign(state, newState);

  return <PageLoading {...newState} />;
}

describe("Page Loading tests", () => {
  it("Initial render", () => {
    //* Setup
    render(<PageLoading />);

    const progress = screen.getByRole("progressbar", { hidden: true });

    //* Assert
    expect(progress).toBeInTheDocument();
  });

  it("Show when loading", () => {
    //* Setup
    render(<PageLoading loading />);

    const progress = screen.getByRole("progressbar", { hidden: true });

    //* Assert
    expect(progress).toBeVisible();
  });

  it("Hide when not loading", () => {
    //* Setup
    render(<PageLoading loading={false} />);

    const progress = screen.getByRole("progressbar", { hidden: true });

    //* Assert
    expect(progress).not.toBeVisible();
  });

  describe("Page loading hook tests", () => {
    it("Determinate render test", () => {
      //* Setup
      const state = {} as PageLoadingState;
      render(<MockPageLoadingWithState state={state} />);

      const progress = screen.getByRole("progressbar", { hidden: true });

      //* Assert
      expect(progress).toBeInTheDocument();
      act(() => state.add(1, 0));

      expect(progress).toBeVisible();
      expect(state.variant).toBe("determinate");
    });

    it("Indeterminate render test", () => {
      //* Setup
      const state = {} as PageLoadingState;
      render(<MockPageLoadingWithState state={state} />);

      const progress = screen.getByRole("progressbar", { hidden: true });

      //* Assert
      expect(progress).toBeInTheDocument();
      expect(progress).not.toBeVisible();

      act(() => state.add(1));
      expect(progress).toBeVisible();
      expect(state.variant).toBe("indeterminate");
    });

    it("Multiple determinate test", () => {
      //* Setup
      const state = {} as PageLoadingState;
      render(<MockPageLoadingWithState state={state} />);

      const progress = screen.getByRole("progressbar", { hidden: true });

      //* Assert
      expect(progress).toBeInTheDocument();
      expect(progress).not.toBeVisible();

      act(() => state.add(1, 25));
      expect(progress).toBeVisible();
      expect(state.variant).toBe("determinate");
      expect(state.value).toBe(25);

      act(() => state.add(2, 75));
      expect(progress).toBeVisible();
      expect(state.value).toBe(50);
    });

    it("Determinate priority test", () => {
      //* Setup
      const state = {} as PageLoadingState;
      render(<MockPageLoadingWithState state={state} />);

      const progress = screen.getByRole("progressbar", { hidden: true });

      //* Assert
      expect(progress).toBeInTheDocument();
      expect(progress).not.toBeVisible();

      act(() => state.add(1, 25));
      expect(progress).toBeVisible();
      expect(state.variant).toBe("determinate");

      act(() => state.add(2));
      expect(progress).toBeVisible();
      expect(state.variant).toBe("determinate");
    });

    it("Loading done test", () => {
      //* Setup
      const state = {} as PageLoadingState;
      render(<MockPageLoadingWithState state={state} />);
      const progress = screen.getByRole("progressbar", { hidden: true });

      //* Assert
      expect(progress).toBeInTheDocument();
      expect(progress).not.toBeVisible();

      act(() => state.add(1, 25));
      expect(progress).toBeVisible();
      expect(state.variant).toBe("determinate");

      act(() => state.update(1, 100));
      expect(progress).not.toBeVisible();

      act(() => state.add(2));
      expect(progress).toBeVisible();
      expect(state.variant).toBe("indeterminate");

      act(() => state.remove(2));
      expect(progress).not.toBeVisible();
    });
  });
  describe("Page loading context tests", () => {
    it("Make sure page loading context wroks", () => {
      //* Setup
      const services = {} as PageLoadingContextServices;
      const state = {} as PageLoadingContextState;
      render(
        <PageLoadingProvider>
          <MockPageLoadingWithContext services={services} state={state} />
        </PageLoadingProvider>
      );

      const progress = screen.getByRole("progressbar", { hidden: true });

      //* Assert
      expect(progress).toBeInTheDocument();
      expect(progress).not.toBeVisible();

      act(() => services.add(2));
      expect(progress).toBeVisible();
      expect(state.variant).toBe("indeterminate");

      act(() => services.add(1, 25));
      expect(progress).toBeVisible();
      expect(state.variant).toBe("determinate");
      expect(state.value).toBe(25);

      act(() => services.remove(2));
      expect(progress).toBeVisible();

      act(() => services.update(1, 100));
      expect(progress).not.toBeVisible();
    });
  });
});

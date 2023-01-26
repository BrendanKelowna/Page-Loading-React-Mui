import { LinearProgress, LinearProgressProps } from "@mui/material";

export type PageLoadingProps = LinearProgressProps & { loading?: boolean };

export default function PageLoading({ loading, ...props }: PageLoadingProps) {
  return (
    <LinearProgress sx={{ visibility: loading ? "initial" : "hidden" }} {...props} />
  );
}

PageLoading.defaultProps = {
  loading: false,
};

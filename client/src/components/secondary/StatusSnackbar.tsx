import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { makeStyles } from "@mui/styles";

interface State extends SnackbarOrigin {
  open: boolean;
}

const useStyles = makeStyles((theme) => ({
  snackbar: {
    marginTop: 0,
  },
}));

function StatusSnackbar({isConnected}: {isConnected: boolean}) {
  const classes = useStyles();
  const [state, setState] = React.useState<State>({
    open: !isConnected,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <Box sx={{ width: 400 }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={!isConnected}
        onClose={handleClose}
        message="Disconnected. Trying to connect."
        key={"top" + "center"}
        className={classes.snackbar}
      />
    </Box>
  );
}

export default StatusSnackbar;

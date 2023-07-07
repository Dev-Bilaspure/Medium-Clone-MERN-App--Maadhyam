import { Button, Popover } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";

function PopoverMoreIcon({ element, buttonElement }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="">
      <Button
        aria-describedby={id}
        variant="text"
        onClick={handleClick}
        color="inherit"
        style={{ padding: 0, minWidth: 0, backgroundColor: "#FFFFFF" }}
      >
        {buttonElement}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {element}
      </Popover>
    </div>
  );
}

export default PopoverMoreIcon;

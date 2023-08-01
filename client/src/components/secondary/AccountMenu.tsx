import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useStore } from "@/store/useStore";
import { defaultUserPic } from "@/constants";
import WebStoriesIcon from '@mui/icons-material/WebStories';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CreateIcon from '@mui/icons-material/Create';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useNavigate } from "react-router-dom";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate()

  const {
    data: { authenticatedUser },
    actions: {auth: {logoutUser}}
  } = useStore();
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <div
              className="h-10 w-10 cursor-pointer rounded-full bg-cover"
              style={{
                backgroundImage: `url(${
                  authenticatedUser.profilePicture || defaultUserPic
                })`,
              }}
            ></div>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="px-2 pb-3">
          <MenuItem onClick={() => {
            navigate(`/${authenticatedUser.username}`);
            handleClose();
          }}>
            <div className="flex space-x-3 pt-3 pb-3">
              <div
                className="h-[45px] w-[45px] cursor-pointer rounded-full bg-cover"
                style={{
                  backgroundImage: `url(${
                    authenticatedUser.profilePicture || defaultUserPic
                  })`,
                }}
              ></div>
              <div className="mt-[2px]">
                <p className="flex justify-center text-[15px] ">
                  {authenticatedUser.firstName +
                    " " +
                    authenticatedUser.lastName}
                </p>
                <p className="text-[12px] italic text-[#757575]">
                  @{authenticatedUser.username}
                </p>
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => {
            navigate(`/me/mystories`);
            handleClose();
          }}>
            <ListItemIcon>
              <WebStoriesIcon fontSize="small" />
            </ListItemIcon>
            My Stories
          </MenuItem>
          <MenuItem onClick={() => {
            navigate(`/me/liked`);
            handleClose();
          }}>
            <ListItemIcon>
              <ThumbUpIcon fontSize="small" />
            </ListItemIcon>
            Liked
          </MenuItem>
          <MenuItem onClick={() => {
            navigate(`/me/bookmarks`);
            handleClose();
          }}>
            <ListItemIcon>
              <BookmarkIcon fontSize="small" />
            </ListItemIcon>
            Bookmarks
          </MenuItem>
          <MenuItem onClick={() => {
            navigate(`/write`);
            handleClose();
          }}>
            <ListItemIcon>
              <CreateIcon fontSize="small" />
            </ListItemIcon>
            Write
          </MenuItem>
          <MenuItem onClick={() => {
            navigate(`/me/settings`);
            handleClose();
          }}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={() => {
            navigate(`/${authenticatedUser.username}/followers`);
            handleClose();
          }}>
            <ListItemIcon>
              <PeopleAltIcon fontSize="small" />
            </ListItemIcon>
            My followers
          </MenuItem>
          <MenuItem onClick={() => {
            handleClose();
            navigate(`/${authenticatedUser.username}/followings`);
          }}>
            <ListItemIcon>
              <PeopleAltIcon fontSize="small" />
            </ListItemIcon>
            My followings
          </MenuItem>
          <MenuItem onClick={() => {
            handleClose();
            window.open('https://github.com/Dev-Bilaspure/Medium-Clone-MERN-App--Maadhyam', '_blank');
          }}>
            <ListItemIcon>
              <GitHubIcon fontSize="small" />
            </ListItemIcon>
            Github repo
          </MenuItem>
          <MenuItem onClick={() => {
            handleClose();
            window.open('https://linkedin.com/in/dev-bilaspure', '_blank');
          }}>
            <ListItemIcon>
              <LinkedInIcon fontSize="small" />
            </ListItemIcon>
            Contact Me
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => {
            handleClose();
            logoutUser();
          }}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </div>
      </Menu>
    </React.Fragment>
  );
}

export default AccountMenu;

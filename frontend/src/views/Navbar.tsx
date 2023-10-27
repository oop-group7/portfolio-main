import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import { Link, useHistory } from "react-router-dom";
import logo from "../assets/logo.svg";
import "./css/Navbar.css";
import { useState, useEffect } from "react";
import { getUserData, logout } from "../utils/apihelper";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Box, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Inbox, Mail } from "@mui/icons-material";


// function Navbar() {
//   const userData = getUserData();

//   // useEffect(() => {
//   //   if (userData == null) {
//   //     if (
//   //       window.location.pathname !== "/" &&
//   //       window.location.pathname !== "/register" &&
//   //       window.location.pathname !== "/validation" &&
//   //       window.location.pathname !== "/password" &&
//   //       window.location.pathname !== "/passwordvalidation"
//   //     ) {
//   //       window.location.href = "/";
//   //     }
//   //   } 
//   //   else {
//   //     if (
//   //       window.location.pathname === "/" ||
//   //       window.location.pathname === "/register" ||
//   //       window.location.pathname === "/validation" ||
//   //       window.location.pathname === "/password" ||
//   //       window.location.pathname === "/passwordvalidation"
//   //     ) {
//   //       window.location.href = "/homepage";
//   //     }
//   //   }
//   // }, [window.location.pathname]);

//   async function handleLogout() {
//     logout();
//   }
//   return (
//     <>
//       <nav className="navbar navbar-expand-lg navbar-light bg-light">
//         <div className="container-fluid">
//           <img className="logo mx-3" src={logo} />
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarSupportedContent"
//             aria-controls="navbarSupportedContent"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div
//             className="collapse navbar-collapse"
//             id="navbarSupportedContent"
//           >
//             <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 <a className="nav-link active" aria-current="page" href="/homepage">Home</a>
//                 {/* <router-link class="nav-link" to="/register"
//                               >Register</router-link> */}
//               </li>
//               <li className="nav-item">
//                 <a className="nav-link active" href="/profile">Profile</a>
//               </li>
//               <li className="nav-item" id="#isLoginDisplay">
//                 {/* <a href="#" className="formstyles" onClick={handleLogout}>
//                   {(userData == null) ? "" : "Logout" }
//                 </a> */}
//                 {/* <a className="nav-link active" href="#" onClick={handleLogout}>
//                   {(userData == null) ? "" : "Logout"}
//                 </a> */}
//                 {userData ? (
//                   <a className="nav-link active" href="#" onClick={handleLogout}>
//                     Logout
//                   </a>
//                 ) : null}
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }

// // function useIsLoggedIn() {
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);

// //   useEffect(() => {
// //     const userData = getUserData();
// //     console.log("User data:", userData);
// //     setIsLoggedIn(getUserData() !== null);
// //   }, []);

// //   console.log(isLoggedIn);
// //   return isLoggedIn;
// // }

// export default Navbar;

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar(props: React.PropsWithChildren) {
  const [drawer, toggleDrawer] = useState<boolean>(false)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: "200px",
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: "200px", boxSizing: 'border-box' }
        }}
        anchor={"left"}
        open={drawer}
        onClose={() => toggleDrawer(false)}
      >
        <Toolbar sx={{ marginTop: "1rem" }} />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <Inbox /> : <Mail />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <AppBar position="fixed" sx={{ backgroundColor: "white", color: "#5e9ac9", zIndex: (theme) => theme.zIndex.drawer + 1, paddingX: 3, paddingY: 2 }}>
        <Grid container width={"100%"} justifyContent={"space-between"}>
          <Grid item>
            <img style={{ width: "7rem" }} src={logo} />
            {/* <Button style={{ backgroundColor: 'transparent', color: "black" }} disableRipple onClick={() => toggleDrawer(!drawer)}>
              <MenuIcon fontSize="large" sx={{ marginX: "1.5rem" }} />
            </Button> */}
          </Grid>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
export default ResponsiveAppBar;


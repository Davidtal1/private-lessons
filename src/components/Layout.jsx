import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, CssBaseline } from "@mui/material";
import { Outlet, Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SubjectIcon from '@mui/icons-material/Subject';

export default function Layout() {
    const drawerWidth = 240;

    // Map of text to paths and icons
    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Add lesson', icon: <AddCircleOutlineIcon />, path: '/create' },
        { text: 'My lessons', icon: <SubjectIcon />, path: '/lessons' }
    ];

    const DrawerList = (
        <Box sx={{ width: drawerWidth }} role="presentation">
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text}>
                        <ListItemButton component={Link} to={item.path}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0
                }}
                variant="permanent"
                open
            >
                {DrawerList}
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1 }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

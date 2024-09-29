import React, { useState } from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, CssBaseline } from "@mui/material";
import { Outlet, Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SubjectIcon from '@mui/icons-material/Subject';
import CalculateIcon from '@mui/icons-material/Calculate';
import { Resizable } from "react-resizable";
import 'react-resizable/css/styles.css';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

export default function Layout() {
    const [drawerWidth, setDrawerWidth] = useState(160);

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Add lesson', icon: <AddCircleOutlineIcon />, path: '/create' },
        { text: 'My lessons', icon: <SubjectIcon />, path: '/lessons' },
        { text: 'Debt by name', icon: <CalculateIcon />, path: '/debts' },
        { text: 'Payments', icon: <PaidOutlinedIcon />, path: '/payments' }

    ];

    const DrawerList = (
        <Box sx={{ width: '100%'}} role="presentation">
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

    const handleResize = (e, { size }) => {
        setDrawerWidth(size.width);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Resizable 
                width={drawerWidth}
                height={0}
                axis="x"
                minConstraints={[150, 0]}
                maxConstraints={[400, 0]}
                onResize={handleResize}
            >
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box'
                        }
                    }}
                    variant="permanent"
                >
                    {DrawerList}
                </Drawer>
            </Resizable>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: 0,
                    transition: 'margin 0.3s',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

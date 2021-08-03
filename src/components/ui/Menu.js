// in src/Menu.js
import * as React from 'react';
import { createElement } from 'react';
import { useSelector } from 'react-redux';
//import { useMediaQuery } from '@material-ui/core';
import { MenuItemLink, getResources } from 'react-admin';
import { withRouter } from 'react-router-dom';


import PermMediaIcon from '@material-ui/icons/PermMedia';

import PagesIcon from '@material-ui/icons/LibraryBooks';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';

const Menu = ({ onMenuClick, logout }) => {
    //const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const open = useSelector(state => state.admin.ui.sidebarOpen);
    const resources = useSelector(getResources);

    return (
        <div>
            <MenuItemLink
                to="/"
                primaryText="Home"
                leftIcon={<HomeIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
            />
            <MenuItemLink
                to="/pages"
                primaryText="Pages"
                leftIcon={<PagesIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
            />
            <MenuItemLink
                to="/media"
                primaryText="Media"
                leftIcon={<PermMediaIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
            />
            {resources.map(resource => (
                <MenuItemLink
                    key={resource.name}
                    to={`/${resource.name}`}
                    primaryText={resource.options ? resource.options.label : resource.name}
                    leftIcon={createElement(resource.icon)}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                />
            ))}
            <MenuItemLink
                to="/settings"
                primaryText="Settings"
                leftIcon={<SettingsIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
            />

            { logout}

        </div>
    );
}

export default withRouter(Menu);



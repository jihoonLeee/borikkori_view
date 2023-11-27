import React from 'react';

export const NavigationMenu = () => {
  return (
    <div>
      <h2>Navigation Menu</h2>
      {/* 여기에 메뉴 항목을 추가하세요. */}
    </div>
  );
};

export const NavigationMenuLink = ({ href, children }) => (
    <a href={href}>{children}</a>
  );
  
export const NavigationMenuTrigger = ({ onClick, children }) => (
<button onClick={onClick}>{children}</button>
);

export const NavigationMenuContent = ({ children }) => (
<div className="menu-content">{children}</div>
);

export const NavigationMenuItem = ({ children }) => (
<li className="menu-item">{children}</li>
);

export const NavigationMenuList = ({ children }) => (
<ul className="menu-list">{children}</ul>
);
export default NavigationMenu;
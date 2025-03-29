// components/NavbarWrapper.tsx
'use client';

import { useCallback } from 'react';
import { signOut } from "next-auth/react";
import Navbar from './navbar/NavBar';

interface NavbarWrapperProps {
  menuData: any;
  themes: any;
}

const NavbarWrapper = ({ menuData, themes }: NavbarWrapperProps) => {
  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  return (
    <Navbar
      menuData={menuData} 
      themes={themes} 
    />
  );
};

export default NavbarWrapper;
"use client";

import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <main className="main-content">
      {children}
    </main>
  );
};

export default PageLayout;
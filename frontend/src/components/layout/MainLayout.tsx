import React from 'react';
import BottomNavigation from './BottomNavigation';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
  hideNavigation?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  rightElement,
  hideNavigation = false,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title={title}
        showBackButton={showBackButton}
        rightElement={rightElement}
      />
      <main className="flex-1 pb-16">
        <div className="max-w-lg mx-auto">
          {children}
        </div>
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
};

export default MainLayout;
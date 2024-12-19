import React from 'react';
import { Outlet } from 'react-router-dom';  // Import Outlet from react-router-dom
import NavBar from '../components/NavBar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Outlet /> {/* This will render the child routes here */}
      </main>
      {/* Optional Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Secure File Sharing. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;

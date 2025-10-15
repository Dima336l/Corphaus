import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import ChatBot from '../components/ChatBot';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};


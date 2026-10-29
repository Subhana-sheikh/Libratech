import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
        <BookOpen className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h3 className="text-lg font-bold text-slate-800">Page Not Found</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
        The page you are looking for does not exist or may have been relocated.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

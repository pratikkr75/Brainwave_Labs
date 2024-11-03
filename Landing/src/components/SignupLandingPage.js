import React from 'react';
import { Card } from '@/components/ui/card';

const LandingOptions = () => {
  return (
    <div className="flex flex-col md:flex-row w-full gap-8 p-8 items-stretch">
      {/* Admin Section */}
      <Card className="flex-1 p-6 flex flex-col items-center text-center">
        <div className="mb-4">
          <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full uppercase">
            Business
          </span>
        </div>
        
        <h2 className="text-3xl mb-4">
          For <span className="text-green-600">Admin</span>
        </h2>
        
        <p className="text-gray-600 mb-8">
          We are the market-leading technical interview platform to identify and hire investigators with the right skills.
        </p>
        
        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors mb-4">
          Login
        </button>
        
        <div className="text-gray-600">
          Don't have an account?
          <div className="mt-2">
            <a href="#" className="text-gray-900 font-medium mr-2">Contact sales</a>
            or
            <a href="#" className="text-gray-900 font-medium ml-2">Get free trial</a>
          </div>
        </div>
      </Card>

      {/* Investigators Section */}
      <Card className="flex-1 p-6 flex flex-col items-center text-center">
        <h2 className="text-3xl mb-4">
          For <span className="text-green-600">Investigators</span>
        </h2>
        
        <p className="text-gray-600 mb-8">
          Join over 21 million investigators, practice investigation skills, prepare for interviews, and get hired.
        </p>
        
        <button className="w-full border-2 border-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors mb-4">
          Login
        </button>
        
        <div className="text-gray-600">
          Don't have an account?
          <div className="mt-2">
            <a href="#" className="text-gray-900 font-medium">Sign up</a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LandingOptions;
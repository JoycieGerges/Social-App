import React from "react";
import { CiSearch } from "react-icons/ci";

export default function PostPlaceHolder() {
  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 animate-pulse mb-6">
  
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
        
            <div className="rounded-full w-10 h-10 bg-gray-200"></div>
            <div className="space-y-2">
       
              <div className="h-3 bg-gray-200 rounded-full w-24"></div>
       
              <div className="h-2 bg-gray-100 rounded-full w-16"></div>
            </div>
          </div>
        </div>


        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 rounded-full w-full"></div>
          <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
        </div>

        
        <div className="w-full h-80 mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
        < CiSearch />
        </div>

 
        <div className="flex justify-between pb-4 border-b border-gray-100 mb-2">
          <div className="h-3 bg-gray-100 rounded-full w-20"></div>
          <div className="h-3 bg-gray-100 rounded-full w-20"></div>
        </div>

      
        <div className="grid grid-cols-3 gap-2 py-1 mb-4">
          <div className="h-8 bg-gray-50 rounded-xl w-full"></div>
          <div className="h-8 bg-gray-50 rounded-xl w-full"></div>
          <div className="h-8 bg-gray-50 rounded-xl w-full"></div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-50">
          <div className="w-10 h-10 rounded-full bg-gray-100"></div>
          <div className="flex-1 space-y-2">
            <div className="h-12 bg-gray-50 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Building2, 
  School as SchoolIcon, 
  Bell, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming you have a utility for tailwind classes
import SchoolSettings from '../components/settings/SchoolSettings';
import DepartmentSettings from '../components/settings/DepartmentSettings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('school');

  const navigation = [
    { id: 'school', name: 'School Details', icon: SchoolIcon, description: 'Manage name, logo, and contact info' },
    { id: 'users', name: 'User Management', icon: Users, description: 'Add staff, teachers, and admins' },
    { id: 'departments', name: 'Departments', icon: Building2, description: 'Organize school structure' },
    // { id: 'security', name: 'Security', icon: ShieldCheck, description: 'Permissions and roles' },
    // { id: 'notifications', name: 'Notifications', icon: Bell, description: 'System alerts and messaging' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-sm text-gray-500">Configure your school management environment and user access.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 p-1 bg-gray-50/50 rounded-2xl border border-gray-100">
            {navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap lg:whitespace-normal w-full",
                    isActive 
                      ? "bg-white text-indigo-600 shadow-sm border border-gray-100" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                  )}
                >
                  <item.icon size={18} className={isActive ? "text-indigo-600" : "text-gray-400"} />
                  <span className="flex-1 text-left">{item.name}</span>
                  <ChevronRight size={14} className={cn("hidden lg:block opacity-0", isActive && "opacity-100")} />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
          <div className="p-8">
            {/* Tab Header */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900">
                {navigation.find(n => n.id === activeTab)?.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {navigation.find(n => n.id === activeTab)?.description}
              </p>
            </div>

            {/* Render Content Based on Active Tab */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {activeTab === 'school' && (
                <div className="space-y-6">
             <SchoolSettings/>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* USER LIST & ADD BUTTON COMPONENT GOES HERE */}
                  <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-400">
                    User Management Interface Placeholder
                  </div>
                </div>
              )}

              {activeTab === 'departments' && (
                <div className="space-y-6">
                <DepartmentSettings/>
                </div>
              )}
              
              {/* Other tabs follow same pattern */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
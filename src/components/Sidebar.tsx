/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { LayoutDashboard, ShoppingCart, Package, LogOut, Users, Settings, Zap } from "lucide-react";
import { View } from "../types";

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "ventas", label: "Ventas", icon: ShoppingCart },
    { id: "inventario", label: "Inventario", icon: Package },
  ];

  const adminItems = [
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <Zap className="h-6 w-6 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight tracking-tight">Umbral Ingenieria</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Ingeniería & Suministros</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-4 space-y-2">
        <div className="px-2 mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Principal</span>
        </div>
        
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id || (currentView === "historial" && item.id === "ventas")
                ? "bg-emerald-500/10 text-emerald-400 border-r-4 border-emerald-500"
                : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}

        <div className="px-2 mt-8 mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Panel</span>
        </div>
        
        {adminItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Juan Pérez</p>
            <p className="text-xs text-slate-400 truncate">Admin</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200">
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

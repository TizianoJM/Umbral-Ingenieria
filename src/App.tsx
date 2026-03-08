/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Inventory } from "./components/Inventory";
import { Sales } from "./components/Sales";
import { ProductModal, MassiveUpdateModal } from "./components/Modals";
import { View, Product } from "./types";
import { MOCK_PRODUCTS } from "./mockData";
import { Menu, X } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMassiveUpdateModalOpen, setIsMassiveUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto del inventario?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "inventario":
        return (
          <Inventory
            products={products}
            onNewProduct={handleNewProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onMassiveUpdate={() => setIsMassiveUpdateModalOpen(true)}
          />
        );
      case "ventas":
      case "historial":
        return <Sales products={products} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          closeSidebar();
        }} 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      
      <main className={`flex-1 min-h-screen flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <Menu className="h-5 w-5 text-white" onClick={toggleSidebar} />
            </div>
            <span className="font-bold text-slate-800">Umbral</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="h-6 w-6 text-slate-600" /> : <Menu className="h-6 w-6 text-slate-600" />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {renderView()}
        </div>
      </main>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
      />
      
      <MassiveUpdateModal
        isOpen={isMassiveUpdateModalOpen}
        onClose={() => setIsMassiveUpdateModalOpen(false)}
      />
    </div>
  );
}

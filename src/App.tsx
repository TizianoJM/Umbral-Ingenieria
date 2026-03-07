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

export default function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMassiveUpdateModalOpen, setIsMassiveUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 ml-64 min-h-screen flex flex-col overflow-hidden">
        {renderView()}
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

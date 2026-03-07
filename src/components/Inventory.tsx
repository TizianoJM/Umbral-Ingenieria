/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Filter, Plus, Edit, Trash2, TrendingUp, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { MOCK_PRODUCTS } from "../mockData";

interface InventoryProps {
  products: any[];
  onNewProduct: () => void;
  onEditProduct: (product: any) => void;
  onDeleteProduct: (id: string) => void;
  onMassiveUpdate: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, onNewProduct, onEditProduct, onDeleteProduct, onMassiveUpdate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventario</h2>
          <p className="text-sm text-slate-500 mt-1">{products.length} productos · Stock con decimales</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onMassiveUpdate}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            Ajuste Masivo
          </button>
          <button
            onClick={onNewProduct}
            className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-emerald-600 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </button>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="px-8 py-4 bg-slate-50/50 flex gap-4 items-center">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            placeholder="Filtrar por nombre, código o marca..."
            type="text"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-500 hover:text-slate-700 transition-colors">
            <Filter className="h-5 w-5" />
          </button>
          <div className="relative">
            <select className="border border-slate-200 rounded-lg bg-white text-sm text-slate-700 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2 pr-10 appearance-none outline-none">
              <option>Todas las categorías</option>
              <option>Cables</option>
              <option>Iluminación</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="flex-1 overflow-auto px-8 py-4">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="px-4 py-4 font-semibold">Código</th>
              <th className="px-4 py-4 font-semibold">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
                  Producto
                  <ChevronDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-4 py-4 font-semibold">Categoría</th>
              <th className="px-4 py-4 font-semibold">Stock</th>
              <th className="px-4 py-4 font-semibold">Costo</th>
              <th className="px-4 py-4 font-semibold">Público</th>
              <th className="px-4 py-4 font-semibold">Gremio</th>
              <th className="px-4 py-4 font-semibold">Mayorista</th>
              <th className="px-4 py-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px]">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-4 text-slate-500 font-mono">{product.code}</td>
                <td className="px-4 py-4">
                  <div className="font-bold text-slate-800">{product.name}</div>
                  <div className="text-[11px] text-slate-400">{product.brand}</div>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-medium">{product.category}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-bold text-[11px]">
                    {product.stockActual.toFixed(2)} {product.unit.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-700">$ {product.priceCosto}</td>
                <td className="px-4 py-4 font-bold text-blue-600">$ {product.pricePublico}</td>
                <td className="px-4 py-4 font-bold text-amber-500">$ {product.priceGremio}</td>
                <td className="px-4 py-4 font-bold text-teal-600">$ {product.priceMayorista}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="text-slate-400 hover:text-emerald-500 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => onDeleteProduct(product.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </motion.div>
  );
};

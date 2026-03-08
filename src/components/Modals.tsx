/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Save, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Category, Unit, Product } from "../types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
        >
          <header className="flex items-center justify-between px-6 md:px-8 py-4 md:py-6 border-b border-slate-100">
            <h2 className="text-lg md:text-xl font-bold text-slate-800">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </header>
          <div className="overflow-y-auto max-h-[80vh]">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
  const isEdit = !!product;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Editar Producto" : "Nuevo Producto"}>
      <form className="p-4 md:p-8 space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nombre del Producto</label>
            <input
              className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border"
              type="text"
              defaultValue={product?.name || ""}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Código</label>
            <input
              className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border"
              type="text"
              defaultValue={product?.code || ""}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Categoría</label>
            <select className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border bg-white">
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat} selected={product?.category === cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Unidad</label>
            <select className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border bg-white">
              {Object.values(Unit).map((u) => (
                <option key={u} value={u} selected={product?.unit === u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Marca</label>
            <input
              className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border"
              type="text"
              defaultValue={product?.brand || ""}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Stock Actual</label>
            <input
              className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border"
              type="number"
              defaultValue={product?.stockActual || 0}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Stock Mínimo</label>
            <input
              className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border"
              type="number"
              defaultValue={product?.stockMinimo || 0}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">IVA %</label>
            <input
              className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border"
              type="number"
              defaultValue={product?.iva || 21}
            />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 md:p-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Precios</h3>
          <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Costo</label>
              <input
                className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border"
                type="number"
                defaultValue={product?.priceCosto || 0}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-blue-500 mb-1 uppercase">Público</label>
              <input
                className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border"
                type="number"
                defaultValue={product?.pricePublico || 0}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-orange-400 mb-1 uppercase">Gremio</label>
              <input
                className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border"
                type="number"
                defaultValue={product?.priceGremio || 0}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-emerald-500 mb-1 uppercase">Mayorista</label>
              <input
                className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none border"
                type="number"
                defaultValue={product?.priceMayorista || 0}
              />
            </div>
          </div>
        </div>

        <footer className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full md:w-auto px-8 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            <Save className="h-5 w-5" />
            Guardar
          </button>
        </footer>
      </form>
    </Modal>
  );
};

interface MassiveUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MassiveUpdateModal: React.FC<MassiveUpdateModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Actualización Masiva de Precios">
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-slate-700" />
          <p className="text-slate-600 text-sm">Ajusta los precios de múltiples productos a la vez.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Categoría</label>
            <select className="w-full border-slate-200 rounded-lg p-3 text-slate-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none border bg-white">
              <option>— Todas las categorías —</option>
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Porcentaje de Ajuste (%)</label>
            <input
              className="w-full border-slate-200 rounded-lg p-3 text-slate-700 placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500 outline-none border"
              placeholder="Ej: 10 para +10%, -5 para -5%"
              type="text"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Aplicar a</label>
            <div className="flex flex-wrap gap-2">
              {["Costo", "Público", "Gremio", "Mayorista"].map((label) => (
                <button
                  key={label}
                  className={`px-5 py-2 rounded-lg border-2 transition-all duration-200 font-semibold text-sm ${
                    label === "Costo" ? "border-emerald-500 text-emerald-600 bg-emerald-50" : "border-slate-200 text-slate-500 hover:border-emerald-200 hover:text-emerald-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <footer className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-6">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors shadow-sm">
            Aplicar Actualización
          </button>
        </footer>
      </div>
    </Modal>
  );
};

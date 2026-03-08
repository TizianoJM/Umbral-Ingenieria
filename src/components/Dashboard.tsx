/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { DollarSign, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

export const Dashboard: React.FC = () => {
  const metrics = [
    {
      label: "Facturación Total",
      value: "$ 448.825",
      icon: DollarSign,
      color: "border-blue-500",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Ventas Confirmadas",
      value: "6",
      subtext: "2 presupuestos pendientes",
      icon: CheckCircle,
      color: "border-amber-500",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      label: "Stock Bajo",
      value: "0",
      subtext: "Productos bajo mínimo",
      icon: AlertTriangle,
      color: "border-teal-500",
      iconColor: "text-teal-500",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 space-y-6 md:space-y-8"
    >
      <header>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Resumen de indicadores clave</p>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            className={`bg-white p-6 rounded-2xl shadow-sm border-t-4 ${metric.color} transition-all duration-200`}
          >
            <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center ${metric.iconColor} mb-4`}>
              <metric.icon className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{metric.value}</div>
            <div className="text-sm text-slate-500 mt-1">{metric.label}</div>
            {metric.subtext && (
              <div className="text-[10px] text-slate-400 mt-1">{metric.subtext}</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Detailed Breakdown Placeholder */}
      <section>
        <div className="bg-[#111c2d] text-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg">
          <h3 className="text-slate-400 text-xs md:text-sm font-medium mb-2 uppercase tracking-wider">Resumen de Facturación</h3>
          <div className="text-4xl md:text-6xl font-black text-blue-400 mb-6 md:mb-8 tracking-tight">$ 448.825</div>
          
          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-slate-700">
            <div>
              <p className="text-slate-400 text-[10px] md:text-xs uppercase font-bold tracking-wider mb-1 md:mb-2">IVA Estimado (21%)</p>
              <p className="text-xl md:text-2xl font-bold text-amber-400">$ 77.895</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] md:text-xs uppercase font-bold tracking-wider mb-1 md:mb-2">Ventas Netas (Sin IVA)</p>
              <p className="text-xl md:text-2xl font-bold text-emerald-400">$ 370.930</p>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for next section */}
      <div className="mt-12 text-center text-slate-400 border-t border-slate-200 pt-8">
        <p className="text-sm italic">Desglose por Venta section would appear here...</p>
      </div>
    </motion.div>
  );
};

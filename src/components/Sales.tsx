/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Search, User, ShoppingCart, Receipt, MoreVertical, CheckCircle, Clock, Download, Filter, X, Plus, Minus, Trash2, Edit, Printer, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MOCK_SALES, MOCK_PRODUCTS } from "../mockData";
import { SaleStatus, SaleType, Product, CartItem, PriceList, Sale, PaymentMethod } from "../types";

interface SalesProps {
  products: Product[];
}

export const Sales: React.FC<SalesProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<"nueva" | "historial">("nueva");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  // Sales State
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPriceList, setSelectedPriceList] = useState<PriceList>("publico");
  const [selectedDocType, setSelectedDocType] = useState<SaleType>(SaleType.FacturaC);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.EfectivoTransferencia);
  const [clientName, setClientName] = useState("Consumidor Final");
  const [clientCuit, setClientCuit] = useState("");

  // History State
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [historyDateFilter, setHistoryDateFilter] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [showArcaModal, setShowArcaModal] = useState(false);
  const [showLoadBudgetModal, setShowLoadBudgetModal] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const historyItemsPerPage = 5;

  const modalFilteredProducts = useMemo(() => {
    if (!modalSearchQuery.trim()) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(modalSearchQuery.toLowerCase())
    );
  }, [modalSearchQuery, products]);

  const recalculateSaleTotals = (sale: Sale) => {
    const itemsCount = sale.items.reduce((total, item) => total + item.quantity, 0);
    const total = sale.items.reduce((sum, item) => sum + item.product.pricePublico * item.quantity, 0); // Defaulting to public price for simplicity in edit
    
    return { ...sale, itemsCount, total };
  };

  const handleAddItemToEdit = (product: Product) => {
    if (!editingSale) return;
    
    const existingItem = editingSale.items.find(item => item.product.id === product.id);
    let newItems;
    
    if (existingItem) {
      newItems = editingSale.items.map(item => 
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newItems = [...editingSale.items, { product, quantity: 1 }];
    }
    
    setEditingSale(recalculateSaleTotals({ ...editingSale, items: newItems }));
    setModalSearchQuery("");
  };

  const handleRemoveItemFromEdit = (productId: string) => {
    if (!editingSale) return;
    const newItems = editingSale.items.filter(item => item.product.id !== productId);
    setEditingSale(recalculateSaleTotals({ ...editingSale, items: newItems }));
  };

  const handleUpdateItemQuantityInEdit = (productId: string, delta: number) => {
    if (!editingSale) return;
    const newItems = editingSale.items.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setEditingSale(recalculateSaleTotals({ ...editingSale, items: newItems }));
  };

  const handleDeleteSale = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro del historial?")) {
      setSales(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleUpdateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSale) return;

    setSales(prev => prev.map(s => s.id === editingSale.id ? editingSale : s));
    setEditingSale(null);
  };

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const searchLower = historySearchQuery.toLowerCase();
      
      // Search by client or sale number (id)
      const matchesSearch = 
        sale.client.toLowerCase().includes(searchLower) ||
        sale.id.toLowerCase().includes(searchLower);
      
      // Filter by date if selected
      let matchesDate = true;
      if (historyDateFilter) {
        // historyDateFilter is YYYY-MM-DD
        // sale.date is DD/MM/YY HH:mm
        const [year, month, day] = historyDateFilter.split('-');
        const shortYear = year.slice(-2);
        const dateStr = `${day}/${month}/${shortYear}`;
        matchesDate = sale.date.startsWith(dateStr);
      }

      return matchesSearch && matchesDate;
    });
  }, [historySearchQuery, historyDateFilter, sales]);

  const totalPages = Math.ceil(filteredSales.length / historyItemsPerPage);
  const paginatedSales = useMemo(() => {
    const startIndex = (historyPage - 1) * historyItemsPerPage;
    return filteredSales.slice(startIndex, startIndex + historyItemsPerPage);
  }, [filteredSales, historyPage]);

  const handleHistorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHistorySearchQuery(e.target.value);
    setHistoryPage(1); // Reset to first page on search
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    clearSearch();
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const getPrice = (product: Product) => {
    switch (selectedPriceList) {
      case "gremio":
        return product.priceGremio;
      case "mayorista":
        return product.priceMayorista;
      default:
        return product.pricePublico;
    }
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + getPrice(item.product) * item.quantity, 0);
  }, [cart, selectedPriceList]);

  const handleConfirmSale = () => {
    if (cart.length === 0) return;

    const newSale: Sale = {
      id: (sales.length + 101).toString(),
      date: new Date().toLocaleString('es-AR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }).replace(',', ''),
      type: selectedDocType,
      client: clientName,
      cuit: clientCuit,
      paymentMethod: selectedPaymentMethod,
      items: [...cart],
      itemsCount: cart.reduce((total, item) => total + item.quantity, 0),
      total: cartTotal,
      status: selectedDocType === SaleType.Presupuesto ? SaleStatus.Pendiente : SaleStatus.Confirmada,
      isDeclared: false,
    };

    setSales([newSale, ...sales]);
    setLastSale(newSale);
    setCart([]);
    setClientName("Consumidor Final");
    setClientCuit("");
    setShowArcaModal(true);
  };

  const handlePrintReceipt = (saleToPrint?: Sale | React.MouseEvent) => {
    // If called from onClick={handlePrintReceipt}, the first arg is an event
    const sale = (saleToPrint && 'id' in (saleToPrint as any)) ? (saleToPrint as Sale) : lastSale;
    
    if (!sale) return;
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert("Por favor habilita las ventanas emergentes para imprimir el comprobante.");
      return;
    }

    const itemsHtml = sale.items.map(item => {
      // Try to determine the price used by comparing with the total if possible, 
      // but for now we'll use the pricePublico as default or just use the sale total logic
      const itemPrice = item.product.pricePublico; // Default
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${itemPrice.toLocaleString()}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(itemPrice * item.quantity).toLocaleString()}</td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${sale.type === SaleType.Presupuesto ? 'Presupuesto' : 'Comprobante'} #${sale.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #10b981; padding-bottom: 20px; }
            .info { margin-bottom: 30px; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f8fafc; padding: 12px 8px; text-align: left; border-bottom: 2px solid #e2e8f0; }
            .total-box { text-align: right; font-size: 1.2em; font-weight: bold; border-top: 2px solid #eee; padding-top: 10px; }
            .footer { margin-top: 50px; text-align: center; font-size: 0.8em; color: #666; border-top: 1px dashed #ccc; padding-top: 20px; }
            .doc-title { font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 10px; text-transform: uppercase; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="doc-title">${sale.type === SaleType.Presupuesto ? 'PRESUPUESTO' : 'COMPROBANTE DE VENTA'}</div>
            <h1>UMBRAL INGENIERIA</h1>
            <p>Ingeniería y Suministros Eléctricos</p>
          </div>
          <div class="info">
            <div>
              <p><strong>Cliente:</strong> ${sale.client}</p>
              <p><strong>Fecha:</strong> ${sale.date}</p>
            </div>
            <div>
              <p><strong>Comprobante:</strong> ${sale.type} #${sale.id}</p>
              <p><strong>Medio de Pago:</strong> ${sale.paymentMethod}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th style="text-align: center;">Cant.</th>
                <th style="text-align: right;">Precio</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="total-box">
            <p>TOTAL: $${sale.total.toLocaleString()}</p>
          </div>
          <div class="footer">
            <p>Gracias por su compra</p>
            <p>Este documento no es válido como factura legal.</p>
            <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimir ahora</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleArcaResponse = (confirm: boolean) => {
    setShowArcaModal(false);
    if (confirm && lastSale) {
      setSales(prev => prev.map(s => s.id === lastSale.id ? { ...s, isDeclared: true } : s));
      alert(`Iniciando facturación electrónica ARCA para la venta #${lastSale?.id}...`);
      // Here we would call the ARCA API
    }
    setActiveTab("historial");
  };

  const handleLoadBudget = (budget: Sale) => {
    setCart([...budget.items]);
    setClientName(budget.client);
    setClientCuit(budget.cuit || "");
    setSelectedDocType(SaleType.FacturaC); // Default to Invoice when loading budget
    setSelectedPaymentMethod(budget.paymentMethod);
    setShowLoadBudgetModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Ventas</h2>
              <p className="text-slate-500 text-xs md:text-sm">Punto de venta y facturación ARCA</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-4 md:gap-8 border-b border-slate-200 -mb-4 md:-mb-6">
            <button
              onClick={() => setActiveTab("nueva")}
              className={`pb-3 md:pb-4 text-xs md:text-sm font-bold transition-all duration-200 ${
                activeTab === "nueva" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Nueva Venta
            </button>
            <button
              onClick={() => setActiveTab("historial")}
              className={`pb-3 md:pb-4 text-xs md:text-sm font-bold transition-all duration-200 ${
                activeTab === "historial" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Historial
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
        {activeTab === "nueva" ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
            {/* Left Column: Search & Client */}
            <div className="lg:col-span-7 flex flex-col gap-6 lg:overflow-y-auto lg:pr-2 custom-scrollbar">
              {/* Search Bar Container */}
              <div className="relative z-20">
                <div className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 ${showResults ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}`}>
                  <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${showResults ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <input
                      className="w-full pl-12 pr-10 py-3 bg-transparent border-none focus:ring-0 text-sm outline-none text-slate-700"
                      placeholder="Buscar producto por nombre, código o marca..."
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => searchQuery.length > 0 && setShowResults(true)}
                    />
                    {searchQuery && (
                      <button 
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showResults && filteredProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-[500px] flex flex-col"
                    >
                      <div className="overflow-y-auto custom-scrollbar">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors text-left"
                          >
                            <div className="flex flex-col">
                              <h3 className="text-[16px] font-bold text-slate-800">{product.name}</h3>
                              <p className="text-xs text-slate-400 mt-1">
                                {product.category} <span className="mx-1.5">•</span>
                                <span className="text-emerald-500 font-semibold">{product.stockActual.toFixed(2)} {product.unit.toLowerCase()}</span>
                                <span className="mx-1.5">•</span> {product.brand}
                              </p>
                            </div>
                            <div className="flex space-x-2 shrink-0">
                              <span className="px-3 py-1 bg-blue-50 text-[#3b82f6] text-[12px] font-bold rounded-md border border-blue-100">
                                $ {product.pricePublico.toLocaleString()}
                              </span>
                              <span className="px-3 py-1 bg-orange-50 text-[#f59e0b] text-[12px] font-bold rounded-md border border-orange-100">
                                $ {product.priceGremio.toLocaleString()}
                              </span>
                              <span className="px-3 py-1 bg-emerald-50 text-[#10b981] text-[12px] font-bold rounded-md border border-emerald-100">
                                $ {product.priceMayorista.toLocaleString()}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Client Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <User className="text-emerald-500 h-5 w-5" />
                    <h3 className="text-lg font-bold text-slate-800">Detalles del Cliente</h3>
                  </div>
                  <button 
                    onClick={() => setShowLoadBudgetModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Cargar Presupuesto
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="Nombre del cliente"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">CUIT/CUIL</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="XX-XXXXXXXX-X"
                      type="text"
                      value={clientCuit}
                      onChange={(e) => setClientCuit(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Cart Items List (Mobile or Left Column if needed) */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="text-emerald-500 h-5 w-5" />
                  <h3 className="text-lg font-bold text-slate-800">Detalle de Productos</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                      <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                      <p className="text-sm italic">No hay productos en el carrito</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group gap-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">{item.product.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{item.product.code}</span>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-500 hover:border-emerald-200 transition-all"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="text-sm font-bold text-slate-700 w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-500 hover:border-emerald-200 transition-all"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="flex flex-col items-end min-w-[100px]">
                              <span className="text-sm font-bold text-slate-800">$ {(getPrice(item.product) * item.quantity).toLocaleString()}</span>
                              <span className="text-[10px] text-slate-400">$ {getPrice(item.product).toLocaleString()} c/u</span>
                            </div>

                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Cart Summary & Controls */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white rounded-xl flex flex-col h-full shadow-sm border border-slate-200 overflow-hidden">
                {/* Cart Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="text-emerald-500 h-5 w-5" />
                    <h3 className="text-lg font-bold text-slate-800">Resumen de Venta</h3>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">{cart.length} items</span>
                </div>
                
                {/* Cart Controls */}
                <div className="p-6 space-y-6">
                  {/* Price List */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lista de Precios</label>
                    <div className="flex p-1 bg-slate-100 rounded-lg">
                      <button 
                        onClick={() => setSelectedPriceList("publico")}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                          selectedPriceList === "publico" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Público
                      </button>
                      <button 
                        onClick={() => setSelectedPriceList("gremio")}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                          selectedPriceList === "gremio" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Gremio
                      </button>
                      <button 
                        onClick={() => setSelectedPriceList("mayorista")}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                          selectedPriceList === "mayorista" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Mayorista
                      </button>
                    </div>
                  </div>
                  
                  {/* Document Type */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de Documento</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[SaleType.Presupuesto, SaleType.FacturaA, SaleType.FacturaB, SaleType.FacturaC].map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedDocType(type)}
                          className={`py-2 px-3 text-xs font-bold border rounded-lg transition-all ${
                            selectedDocType === type 
                              ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-600" 
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medio de Pago</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[PaymentMethod.EfectivoTransferencia, PaymentMethod.TarjetaCredito, PaymentMethod.TarjetaDebito, PaymentMethod.QR].map((method) => (
                        <button
                          key={method}
                          onClick={() => setSelectedPaymentMethod(method)}
                          className={`py-2 px-3 text-xs font-bold border rounded-lg transition-all ${
                            selectedPaymentMethod === method 
                              ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-600" 
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cart Footer */}
                <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="text-slate-700 font-bold">$ {(cartTotal / 1.21).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">IVA (21%)</span>
                      <span className="text-slate-700 font-bold">$ {(cartTotal - (cartTotal / 1.21)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <span className="text-slate-800 font-bold">Total</span>
                      <span className="text-3xl font-black text-emerald-600">$ {cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleConfirmSale}
                    disabled={cart.length === 0}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
                      cart.length > 0 
                        ? "bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600 active:scale-[0.98]" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Receipt className="h-5 w-5" />
                    Confirmar Venta
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Filters/Actions Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 w-full md:max-w-2xl">
                <div className="flex items-center gap-3 bg-white border border-slate-200 px-3 py-2 rounded-lg flex-1 shadow-sm">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                    placeholder="Buscar por cliente o número de venta..."
                    type="text"
                    value={historySearchQuery}
                    onChange={handleHistorySearch}
                  />
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm w-full md:min-w-[180px]">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-slate-600"
                    value={historyDateFilter}
                    onChange={(e) => {
                      setHistoryDateFilter(e.target.value);
                      setHistoryPage(1);
                    }}
                  />
                  {historyDateFilter && (
                    <button 
                      onClick={() => {
                        setHistoryDateFilter("");
                        setHistoryPage(1);
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                  <Download className="h-4 w-4" />
                  Exportar Excel
                </button>
              </div>
            </div>
            {/* Sales Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Medio de Pago</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-400">#{sale.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{sale.date}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            sale.type === SaleType.Presupuesto ? "bg-slate-100 text-slate-600" :
                            sale.type === SaleType.FacturaA ? "bg-purple-100 text-purple-600" :
                            sale.type === SaleType.FacturaB ? "bg-blue-100 text-blue-600" :
                            "bg-cyan-100 text-cyan-600"
                          }`}>
                            {sale.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{sale.client}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-medium">{sale.paymentMethod}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{sale.itemsCount} productos</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">$ {sale.total.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex flex-col gap-1.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase w-fit ${
                              sale.status === SaleStatus.Pendiente ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600"
                            }`}>
                              {sale.status === SaleStatus.Pendiente ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                              {sale.status}
                            </span>
                            {sale.status === SaleStatus.Confirmada && sale.type !== SaleType.Presupuesto && !sale.isDeclared && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-500 text-[10px] font-bold uppercase w-fit border border-red-100">
                                <X className="h-2.5 w-2.5" />
                                No declarada
                              </span>
                            )}
                            {sale.status === SaleStatus.Confirmada && sale.isDeclared && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase w-fit border border-emerald-100">
                                <CheckCircle className="h-2.5 w-2.5" />
                                Declarada ARCA
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          <div className="flex items-center justify-center gap-2">
                            {sale.status === SaleStatus.Pendiente && (
                              <button 
                                onClick={() => {
                                  setLastSale(sale);
                                  setShowArcaModal(true);
                                  // Update status to confirmed when invoicing
                                  setSales(prev => prev.map(s => s.id === sale.id ? { ...s, status: SaleStatus.Confirmada, type: SaleType.FacturaC } : s));
                                }}
                                className="p-1.5 hover:bg-emerald-50 rounded-md text-emerald-500 hover:text-emerald-600 transition-all"
                                title="Facturar / Confirmar Venta"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => handlePrintReceipt(sale)}
                              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-emerald-500 transition-all"
                              title="Imprimir Comprobante"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setEditingSale(sale)}
                              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-blue-500 transition-all"
                              title="Editar Venta"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSale(sale.id)}
                              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Mostrando {Math.min(filteredSales.length, (historyPage - 1) * historyItemsPerPage + 1)} a {Math.min(filteredSales.length, historyPage * historyItemsPerPage)} de {filteredSales.length} ventas
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setHistoryPage(prev => Math.max(1, prev - 1))}
                    disabled={historyPage === 1}
                    className={`px-3 py-1 border border-slate-200 rounded text-sm transition-colors ${historyPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                  >
                    Anterior
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setHistoryPage(page)}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        historyPage === page 
                          ? "bg-emerald-500 text-white font-bold" 
                          : "border border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    onClick={() => setHistoryPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={historyPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 border border-slate-200 rounded text-sm transition-colors ${historyPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Sale Modal */}
      <AnimatePresence>
        {editingSale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-2">
                  <Edit className="text-emerald-500 h-5 w-5" />
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">Editar Venta #{editingSale.id}</h3>
                </div>
                <button 
                  onClick={() => setEditingSale(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-6">
                <form onSubmit={handleUpdateSale} id="edit-sale-form" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Fecha</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                        value={editingSale.date}
                        onChange={(e) => setEditingSale({ ...editingSale, date: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Estado</label>
                      <select
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                        value={editingSale.status}
                        onChange={(e) => setEditingSale({ ...editingSale, status: e.target.value as SaleStatus })}
                      >
                        <option value={SaleStatus.Confirmada}>Confirmada</option>
                        <option value={SaleStatus.Pendiente}>Pendiente</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Cliente</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                      value={editingSale.client}
                      onChange={(e) => setEditingSale({ ...editingSale, client: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Documento</label>
                      <select
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                        value={editingSale.type}
                        onChange={(e) => setEditingSale({ ...editingSale, type: e.target.value as SaleType })}
                      >
                        <option value={SaleType.FacturaA}>Factura A</option>
                        <option value={SaleType.FacturaB}>Factura B</option>
                        <option value={SaleType.FacturaC}>Factura C</option>
                        <option value={SaleType.Presupuesto}>Presupuesto</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Medio de Pago</label>
                      <select
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                        value={editingSale.paymentMethod}
                        onChange={(e) => setEditingSale({ ...editingSale, paymentMethod: e.target.value as PaymentMethod })}
                      >
                        <option value={PaymentMethod.EfectivoTransferencia}>{PaymentMethod.EfectivoTransferencia}</option>
                        <option value={PaymentMethod.TarjetaCredito}>{PaymentMethod.TarjetaCredito}</option>
                        <option value={PaymentMethod.TarjetaDebito}>{PaymentMethod.TarjetaDebito}</option>
                        <option value={PaymentMethod.QR}>{PaymentMethod.QR}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Total ($)</label>
                      <input
                        type="number"
                        readOnly
                        className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none cursor-not-allowed"
                        value={editingSale.total}
                      />
                    </div>
                  </div>
                </form>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Productos en esta venta</h4>
                    <span className="text-xs text-slate-500 font-medium">{editingSale.items.length} items</span>
                  </div>

                  {/* Add Product Search */}
                  <div className="relative">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                      <Search className="h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Agregar más productos..."
                        className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                        value={modalSearchQuery}
                        onChange={(e) => setModalSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Modal Search Results */}
                    <AnimatePresence>
                      {modalSearchQuery && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto"
                        >
                          {modalFilteredProducts.length > 0 ? (
                            modalFilteredProducts.map((product) => (
                              <button
                                key={product.id}
                                onClick={() => handleAddItemToEdit(product)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                              >
                                <div className="text-left">
                                  <div className="text-sm font-bold text-slate-800">{product.name}</div>
                                  <div className="text-[10px] text-slate-500">{product.brand} · {product.code}</div>
                                </div>
                                <div className="text-sm font-bold text-emerald-600">$ {product.pricePublico}</div>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-sm text-slate-500">No se encontraron productos</div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Items List */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2 font-bold text-slate-500 text-[10px] uppercase">Producto</th>
                          <th className="px-4 py-2 font-bold text-slate-500 text-[10px] uppercase text-center">Cant.</th>
                          <th className="px-4 py-2 font-bold text-slate-500 text-[10px] uppercase text-right">Subtotal</th>
                          <th className="px-4 py-2 font-bold text-slate-500 text-[10px] uppercase text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {editingSale.items.map((item) => (
                          <tr key={item.product.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-800">{item.product.name}</div>
                              <div className="text-[10px] text-slate-500">{item.product.brand}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => handleUpdateItemQuantityInEdit(item.product.id, -1)}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-500"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                                <button 
                                  onClick={() => handleUpdateItemQuantityInEdit(item.product.id, 1)}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-500"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-800">
                              $ {(item.product.pricePublico * item.quantity).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => handleRemoveItemFromEdit(item.product.id)}
                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {editingSale.items.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">
                              No hay productos en esta venta
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSale(null)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="edit-sale-form"
                  className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Guardar Cambios
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ARCA Confirmation Modal */}
      <AnimatePresence>
        {showArcaModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 md:p-8 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Receipt className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                  {lastSale?.type === SaleType.Presupuesto ? "Presupuesto Guardado" : "Venta Registrada"}
                </h3>
                <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8">
                  El documento <span className="font-bold text-slate-700">#{lastSale?.id}</span> se ha guardado correctamente. <br className="hidden md:block"/>
                  ¿Deseas realizar la <span className="text-emerald-600 font-bold">facturación electrónica al ARCA</span> ahora?
                </p>
                
                <div className="flex flex-col gap-3">
                  {lastSale?.type !== SaleType.Presupuesto && (
                    <button
                      onClick={() => handleArcaResponse(true)}
                      className="w-full py-3 md:py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Sí, Facturar al ARCA
                    </button>
                  )}
                  <button
                    onClick={() => handlePrintReceipt()}
                    className={`w-full py-3 md:py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                      lastSale?.type === SaleType.Presupuesto 
                        ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30" 
                        : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Printer className="h-5 w-5" />
                    {lastSale?.type === SaleType.Presupuesto ? "Imprimir Presupuesto" : "Imprimir Comprobante"}
                  </button>
                  <button
                    onClick={() => handleArcaResponse(false)}
                    className="w-full py-3 md:py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    {lastSale?.type === SaleType.Presupuesto ? "Cerrar" : "No por ahora"}
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Umbral Ingenieria v2.0</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Load Budget Modal */}
      <AnimatePresence>
        {showLoadBudgetModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Clock className="text-emerald-500 h-5 w-5" />
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">Seleccionar Presupuesto</h3>
                </div>
                <button 
                  onClick={() => setShowLoadBudgetModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="space-y-3">
                  {sales.filter(s => s.status === SaleStatus.Pendiente).length === 0 ? (
                    <div className="text-center py-10 text-slate-400 italic">
                      No hay presupuestos pendientes
                    </div>
                  ) : (
                    sales.filter(s => s.status === SaleStatus.Pendiente).map((budget) => (
                      <button
                        key={budget.id}
                        onClick={() => handleLoadBudget(budget)}
                        className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800">{budget.client}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">#{budget.id}</span>
                          </div>
                          <span className="text-xs text-slate-500">{budget.date} • {budget.itemsCount} productos</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-slate-800">$ {budget.total.toLocaleString()}</span>
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="h-4 w-4" />
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">Selecciona un presupuesto para cargar sus productos al carrito actual</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

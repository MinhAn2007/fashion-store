// utils.js
import html2pdf from "html2pdf.js";

/**
 * Format a number as Vietnamese Dong (VND)
 * @param {number|string} price - The price to format
 * @returns {string} - The formatted price in VND
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(price));
  };

  export const downloadPDF = (componentRef, fileName = "order.pdf") => {
    console.log(componentRef);
    
    html2pdf()
      .set({
        filename: fileName,
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(componentRef)
      .save();
  };
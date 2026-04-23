import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ correct import

export const generateReport = (form) => {
  try {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(form.type, 14, 20);

    doc.setFontSize(11);
    doc.text(`Category: ${form.category}`, 14, 30);
    doc.text(`Start: ${form.startDate}`, 14, 38);
    doc.text(`End: ${form.endDate}`, 14, 46);

    // ✅ correct usage
    autoTable(doc, {
      startY: 55,
      head: [["ID", "Name", "Status", "Amount"]],
      body: [
        ["1", "Aman", "Active", "5000"],
        ["2", "Ravi", "Pending", "3000"],
        ["3", "Neha", "Completed", "8000"],
      ],
    });

    doc.save("report.pdf");

  } catch (error) {
    console.error("PDF Error:", error);
    throw error;
  }
};
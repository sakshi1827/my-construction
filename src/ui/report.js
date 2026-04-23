/*import jsPDF from "jspdf";
import "jspdf-autotable";

export function generateReport(data) {

  const doc = new jsPDF();

  doc.text("Construction Report", 14, 20);

  doc.autoTable({
    head: [["Report Type", "Category", "Start Date", "End Date"]],
    body: [
      [
        data.type,
        data.category,
        data.startDate || "-",
        data.endDate || "-"
      ]
    ]
  });

  doc.save("report.pdf");
}*/
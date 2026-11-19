import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export default async function exportReport(data) {
  const doc = new jsPDF();

  // Cover Page
  doc.setFontSize(22);
  doc.text("TrendLens Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Keyword: ${data.keyword}`, 14, 35);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 45);

  // Capture the complete analytics section
  const analytics = document.getElementById("analytics-section");

  if (analytics) {
    const canvas = await html2canvas(analytics, {
      backgroundColor: "#111827",
      scale: 2,
      useCORS: true,
    });

    const img = canvas.toDataURL("image/png");

    const pageWidth = doc.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addPage();

    doc.setFontSize(18);
    doc.text("Analytics Overview", 14, 20);

    doc.addImage(img, "PNG", 10, 30, imgWidth, imgHeight);
  }

  // Countries Table
  doc.addPage();

  doc.setFontSize(18);
  doc.text("Regional Breakdown", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Region", "Score"]],
    body: data.regions.map((r) => [r.region, r.score]),
    theme: "grid",
  });

  doc.save(`TrendLens_Report_${data.keyword}.pdf`);
}
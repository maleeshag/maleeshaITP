import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@mui/material";
import logo from "./image.png";
import moment from "moment";
const doc = new jsPDF({
  orientation: "landscape",
});

const exportPDF = (tableData) => {
doc.addImage(logo, 'PNG', 0, 0, 200, 50);
  doc.setFontSize(11);
  doc.text("User Report", 15, 53);
  doc.text(`Report Generated ${moment().format("MMMM Do YYYY, h:mm:ss a")}`, 14, 59);


  autoTable(doc, { html: "#my-table" });
  const data = tableData.map((opportunity) => [
    opportunity.itnumber,
    opportunity.firstname,
    opportunity.lastname,
    opportunity.foodtype,
    opportunity.email,
    opportunity.address,
    opportunity.role,
    opportunity.mobile,
    

  ]);
  // Or use javascript directly:
  autoTable(doc, {
    head: [["IT Number","First Name","Last Name","Food Type","Email","Address","Role","Contact No"]],
    body: data,
    styles: {
      cellWidth: "auto",
    },
    startY: 65,
  });

  doc.save("Opportunities.pdf");
};

const OpportunityPDF = ({ tableData }) => {
  return (
    <div>
      <Button
        color="primary"
        onClick={() => {
          exportPDF(tableData);
        }}
        variant="contained"
      >
        Export as PDF
      </Button>
    </div>
  );
};

export default OpportunityPDF;
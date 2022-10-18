import React from "react";
import "./DownloadCSV.css";

const DownloadCSV = ({ convertToCSV, csv, details = "ram" }) => {
  return (
    <a
      href={`data:text/csv;charset=utf-8,${csv}`}
      className="csv-download-btn"
      onClick={convertToCSV}
      download={`${details.eventName}.csv`}
    >
      Download CSV
    </a>
  );
};

export default DownloadCSV;

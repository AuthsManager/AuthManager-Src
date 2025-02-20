import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TableManagement({ columns, data }) {
  const renderMobile = () => (
    <div className="space-y-4">
      {data.length > 0 ? (
        data.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className="bg-[#0A1323] p-4 rounded-lg border border-[#1B2B4B] space-y-3"
          >
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col space-y-1">
                <span className="text-white/50 text-sm">{column}</span>
                <div className={`${
                  columnIndex === 0 ? "font-mono text-sm text-white/60" :
                  columnIndex === columns.length - 1 ? "flex justify-end" :
                  "text-white/70"
                }`}>
                  {Object.values(row)[columnIndex]}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="bg-[#0A1323] p-4 rounded-lg border border-[#1B2B4B] text-center text-white/40">
          No data available
        </div>
      )}
    </div>
  );

  const renderDesktop = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-[#1B2B4B] hover:bg-transparent">
            {columns.map((column, columnIndex) => (
              <TableHead
                key={columnIndex}
                className={`text-white/70 py-4 ${
                  columnIndex === columns.length - 1 ? "text-right" : "text-left"
                } whitespace-nowrap`}
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className="border-[#1B2B4B] hover:bg-[#1B2B4B]/40 transition-colors duration-200"
              >
                {columns.map((column, columnIndex) => (
                  <TableCell 
                    key={columnIndex}
                    className={`py-4 px-4 ${
                      columnIndex === 0 ? "font-mono text-sm text-white/60" : 
                      columnIndex === columns.length - 1 ? "text-right" : 
                      "text-white/70"
                    } whitespace-nowrap`}
                  >
                    {Object.values(row)[columnIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-32 text-center text-white/40"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="w-full bg-[#0A1323] rounded-lg border border-[#1B2B4B]">
      <div className="hidden md:block">
        {renderDesktop()}
      </div>
      <div className="md:hidden">
        {renderMobile()}
      </div>
    </div>
  );
}

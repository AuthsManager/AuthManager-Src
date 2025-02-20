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
  return (
    <div className="w-full bg-[#0A1323] rounded-lg border border-[#1B2B4B]">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1B2B4B] hover:bg-transparent">
              {columns.map((column, columnIndex) => (
                <TableHead
                  key={columnIndex}
                  className={`text-white/70 py-4 ${
                    columnIndex === columns.length - 1 ? "text-right" : "text-left"
                  }`}
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
                      }`}
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
    </div>
  );
}

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
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y">
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            {columns.map((column, columnIndex) => (
              <TableHead
                key={columnIndex}
                className={
                  columnIndex === columns.length - 1 ? "text-right" : "text-left"
                }
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="md:table-row-group">
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="md:table-row flex flex-col mb-4 md:mb-0">
              {columns.map((column, columnIndex) => (
                <React.Fragment key={columnIndex}>
                  <TableCell className="md:hidden font-bold py-2 px-4 border-t border-gray-600">
                    {column}
                  </TableCell>
                  <TableCell className="py-2 px-4">
                    {Object.values(row)[columnIndex]}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

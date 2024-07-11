const express = require('express');
// requires
const fs = require("fs");
const PDFDocumentTable = require("pdfkit-table");
const PDFDocument = require('pdfkit');
const { headerNames } = require('./constants/constants');
const app = express();
const port = 3001;

let records = [];
for (let i = 1; i <= 5000; i++) {
    records.push([
        i, "John", "Wick", "SWW", "Cosmoc", "DAL", "x556644", "Active", "Employee"
    ])
};

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/pdf', async (req, res) => {
    // init document
    let doc = new PDFDocumentTable({ margin: 30, size: 'A4' });

    // set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=document.pdf');

    // set response headers
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'inline; filename=document.pdf');

    // pipe document to response
    doc.pipe(res);

    (async function createTable() {
        // table
        const table = {
            title: 'Title',
            headers: headerNames,
            rows: records,
        };

        // the magic (async/await)
        await doc.table(table, { /* options */ });
        // -- or --
        // doc.table(table).then(() => { doc.end() }).catch((err) => { })

        // if your run express.js server
        // to show PDF on navigator
        // doc.pipe(res);

        // done!
        doc.end();
    })();
});

app.get('/pdf-demo', async (req, res) => {
    try {
        // Create a new PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margin: 30,
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="example.pdf"'); // Change 'inline' to 'attachment' to force download

        // Example data for the table
        const table = {
            headers: headerNames,
            rows: records,
        };

        // Draw headers
        doc.text('Example PDF with Table', 50, 50);
        doc.moveDown(); // move down the text cursor


        // Draw the table
        drawTable(doc, table);

        // Pipe the PDF to the response
        doc.pipe(res);
        doc.end();

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

// // Function to draw a table with dynamic header heights, row separators, and vertical lines
// function drawTable(doc, table) {
//     const { headers, rows } = table;
//     const columnCount = headers.length; // Get the column count from headers length
//     const rowCount = rows.length;

//     // Set table properties
//     const startX = doc.page.margins.left;
//     const startY = doc.page.margins.top;
//     const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
//     const cellPadding = 10;
//     const cellHeight = 30;
//     const lineWidth = 1;

//     // Calculate column widths and header heights
//     const { columnWidths, headerHeights } = calculateColumnWidthsAndHeaderHeights(headers, rows, doc, availableWidth, cellPadding);

//     // Draw headers
//     doc.font('Helvetica-Bold');
//     headers.forEach((header, i) => {
//       const headerWidth = columnWidths[i]; // Use calculated width
//       const headerHeight = headerHeights[i];
//       doc.text(header, startX + sum(columnWidths.slice(0, i)) + cellPadding, startY + doc.page.margins.top + cellPadding, { width: headerWidth - cellPadding * 2, height: headerHeight, align: 'center' });
//     });

//     // Draw vertical lines between columns
//     headers.reduce((prevWidth, columnWidth, index) => {
//       doc.moveTo(startX + prevWidth, startY)
//          .lineTo(startX + prevWidth, startY + headerHeights[index] + cellPadding)
//          .stroke();
//       return prevWidth + columnWidth;
//     }, 0);

//     // Draw rows
//     doc.font('Helvetica');
//     rows.forEach((row, rowIndex) => {
//       row.forEach((cell, cellIndex) => {
//         const width = columnWidths[cellIndex];
//         const x = startX + sum(columnWidths.slice(0, cellIndex)) + cellPadding;
//         const y = startY + headerHeights[cellIndex] + cellHeight + rowIndex * cellHeight + cellPadding * (rowIndex + 1);
//         doc.text(cell.toString(), x, y, { width: width - cellPadding * 2 });

//         // Draw a line at the bottom of each row
//         if (rowIndex === rows.length - 1) {
//           doc.moveTo(startX, y + cellHeight)
//              .lineTo(startX + sum(columnWidths), y + cellHeight)
//              .lineWidth(lineWidth)
//              .stroke();
//         }
//       });
//     });

//     // Draw borders
//     const tableWidth = sum(columnWidths);
//     const tableHeight = (rowCount + 1) * cellHeight + cellPadding * (rowCount + 1);
//     doc.rect(startX, startY, tableWidth, tableHeight).stroke();
//   }

//   // Function to calculate column widths and header heights based on content and available width
//   function calculateColumnWidthsAndHeaderHeights(headers, rows, doc, availableWidth, cellPadding) {
//     const columnWidths = headers.map(header => {
//       const headerWidth = doc.widthOfString(header) + 2 * cellPadding;
//       return Math.min(headerWidth, availableWidth / headers.length); // Distribute evenly within available width
//     });

//     const headerHeights = headers.map(header => {
//       const headerHeight = doc.heightOfString(header, { width: columnWidths[headers.indexOf(header)] }) + 2 * cellPadding;
//       return headerHeight;
//     });

//     rows.forEach(row => {
//       row.forEach((cell, cellIndex) => {
//         const cellWidth = doc.widthOfString(cell.toString()) + 2 * cellPadding;
//         if (cellWidth > columnWidths[cellIndex]) {
//           columnWidths[cellIndex] = Math.min(cellWidth, availableWidth / headers.length); // Distribute evenly within available width
//         }
//       });
//     });

//     return { columnWidths, headerHeights };
//   }

//   // Utility function to sum an array
//   function sum(array) {
//     return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
//   }


// // Function to draw the entire table
// function drawTable(doc, table) {
//     const { headers, rows } = table;
//     const columnCount = headers.length;
//     const rowCount = rows.length;

//     // Set table properties
//     const startX = doc.page.margins.left;
//     const startY = doc.page.margins.top;
//     const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
//     console.log(startX, startY, availableWidth)
//     const cellPadding = 10;
//     const cellHeight = 10;
//     const lineWidth = 1;

//     // Calculate column widths and header heights
//     const { columnWidths, headerHeights } = calculateColumnWidthsAndHeaderHeights(headers, rows, doc, availableWidth, cellPadding, cellHeight);

//     // Draw headers
//     doc.font('Helvetica-Bold');
//     headers.forEach((header, i) => {
//         const headerWidth = columnWidths[i];
//         const headerHeight = headerHeights[i];
//         doc.text(header, startX + sum(columnWidths.slice(0, i)) + cellPadding, startY + headerHeight + cellPadding, { width: headerWidth - cellPadding * 2, height: headerHeight, align: 'center' });
//     });

//     // Draw rows
//     doc.font('Helvetica');
//     rows.forEach((row, rowIndex) => {
//         row.forEach((cell, cellIndex) => {
//             const width = columnWidths[cellIndex];
//             const x = startX + sum(columnWidths.slice(0, cellIndex)) + cellPadding;
//             const y = startY + headerHeights[cellIndex] + cellHeight + rowIndex * cellHeight + cellPadding * (rowIndex + 1);
//             doc.text(cell.toString(), x, y, { width: width - cellPadding * 2 });

//             // Draw a line at the bottom of each row
//             if (rowIndex === rows.length - 1) {
//                 doc.moveTo(startX, y + cellHeight)
//                     .lineTo(startX + sum(columnWidths), y + cellHeight)
//                     .lineWidth(lineWidth)
//                     .stroke();
//             }
//         });
//     });

//     // Draw borders
//     const tableWidth = sum(columnWidths);
//     const tableHeight = (rowCount + 1) * cellHeight + cellPadding * (rowCount + 1);
//     doc.rect(startX, startY, tableWidth, tableHeight).stroke();
// }

// // Function to calculate column widths and header heights based on content and available width
// function calculateColumnWidthsAndHeaderHeights(headers, rows, doc, availableWidth, cellPadding) {
//     // Store width of each column in array in columnWidth
//     const columnWidths = headers.map(header => {
//         const headerWidth = doc.widthOfString(header) + 2 * cellPadding;
//         return Math.min(headerWidth, availableWidth / headers.length); // Distribute evenly within available width
//     });

//     const headerHeights = headers.map(header => {
//         const headerHeight = doc.heightOfString(header, { width: columnWidths[headers.indexOf(header)] }) + 2 * cellPadding;
//         return headerHeight;
//     });

//     rows.forEach(row => {
//         row.forEach((cell, cellIndex) => {
//             const cellWidth = doc.widthOfString(cell.toString()) + 2 * cellPadding;
//             if (cellWidth > columnWidths[cellIndex]) {
//                 columnWidths[cellIndex] = Math.min(cellWidth, availableWidth / headers.length); // Distribute evenly within available width
//             }
//         });
//     });

//     return { columnWidths, headerHeights };
// }

// // Utility function to sum an array
// function sum(array) {
//     return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
// }

// Function to draw the entire table with borders around each cell, without overall table border
function drawTable(doc, table) {
    doc.fontSize(8);
    const { headers, rows } = table;
    const columnCount = headers.length;
    const rowCount = rows.length;

    // Set table properties
    const startX = doc.page.margins.left;
    const startY = doc.y
    const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    console.log(startX, startY.toFixed(2), availableWidth)   //*************************** */
    console.log("Available width", availableWidth);
    // Constants for cell dimensions and padding
    // const cellPadding = 10;
    const cellHeight = 10;
    const lineWidth = 0.5;




    // Check if there's enough space on the current page for the table content
    const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
    const pageWidht = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    // const tableHeight = (rowCount + 1) * cellHeight + cellPadding * (rowCount + 1); // Adjust as needed

    console.log("Page height", pageHeight);
    console.log("Page width", pageWidht);
    // console.log("Table height", tableHeight);

    // if (startY + tableHeight > pageHeight) {
    //     // If table height exceeds remaining page height, start a new page
    //     doc.addPage();
    //     startY = doc.page.margins.top; // Reset startY to top margin of the new page
    // }


    // Calculate column widths and header heights
    const { columnWidths, headerHeights } = calculateColumnWidthsAndHeaderHeights(headers, rows, doc, availableWidth, cellHeight);

    // Calculate endX, startY, and endY for the tabl
    const endX = startX + sum(columnWidths); // End of table horizontally
    const endY = doc.page.height - doc.page.margins.bottom - doc.y;  //critical here
    console.log("Endx ", endX);
    console.log("EndY ", endY);

    // Draw headers with borders
    const verticalMargin = 8;
    doc.font('Helvetica-Bold');
    headers.forEach((header, i) => {
        const headerWidth = columnWidths[i];
        const headerHeight = headerHeights[i];
        // doc.rect(x, y, width, height): Draws a rectangle on the PDF document
        doc.rect(startX + sum(columnWidths.slice(0, i)), startY, headerWidth, headerHeight + verticalMargin).stroke();
        // doc.text(text, x, y, options);
        doc.text(header, startX + sum(columnWidths.slice(0, i)), startY + (verticalMargin / 2), { width: headerWidth, align: 'left' });
    });
    // doc.moveDown();
    // Move down after headers
    doc.moveDown(2); // Move down by 2 lines (adjust as needed)

    // Update startY to current position
    let currentY = doc.y;
    // Draw rows
    doc.font('Helvetica');
    rows.forEach((row, rowIndex) => {
        const rowHeight = cellHeight;

        // Check if the current position exceeds the page height
        if (currentY + rowHeight > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            currentY = doc.page.margins.top;
        }
        row.forEach((cell, cellIndex) => {
            const width = columnWidths[cellIndex];
            const x = startX + sum(columnWidths.slice(0, cellIndex));
            const y = currentY;

            // Calculate bottom y position of the cell
            const bottomY = y + cellHeight;

            // Draw border for each cell
            doc.rect(x, y, width, cellHeight).stroke();

            // Draw text inside the cell
            doc.text(cell.toString(), x + 5, y + 5, { width: width - 10, height: cellHeight - 10, align: 'left' });

            // Draw a horizontal line at the bottom of the cell to represent the bottom border
            doc.moveTo(x, bottomY).lineTo(x + width, bottomY).stroke();

        });
        // Move to the next row position
        currentY += cellHeight;
    });

    // const totalHeaderHeight = headerHeights[0] + verticalMargin;
    // doc.text("Hello", startX, startYAfterHeaders)
    // Draw rows with borders
    // doc.font('Helvetica');
    // rows.forEach((row, rowIndex) => {
    //     row.forEach((cell, cellIndex) => {
    //         const width = columnWidths[cellIndex];
    //         const x = startX + sum(columnWidths.slice(0, cellIndex));
    //         const y = startY + sum(headerHeights) + rowIndex * cellHeight;
    //         doc.rect(x, y, width, cellHeight).stroke(); // Draw border for each cell
    //         doc.text(cell.toString(), x, y, { width: width });
    //     });
    // });

    // doc.text('Hellow', startX, doc.y)
    // doc.font('Helvetica');
    // rows.forEach((row, rowIndex) => {
    //     row.forEach((cell, cellIndex) => {
    //         const width = columnWidths[cellIndex];
    //         const x = startX + sum(columnWidths.slice(0, cellIndex));
    //         const y = startY + sum(headerHeights) + (rowIndex + 1) * cellHeight;
    //         doc.rect(x, y, width, cellHeight).stroke(); // Draw border for each cell
    //         doc.text(cell.toString(), x + 5, y + 5, { width: width - 10, height: cellHeight - 10, align: 'left' }); // Add padding inside the cell
    //     });
    // });

}

// Function to calculate column widths and header heights based on content and available width
function calculateColumnWidthsAndHeaderHeights(headers, rows, doc, availableWidth, cellHeight) {
    let updatedCellHeight = cellHeight;
    // Store width of each column in array in columnWidth
    const columnWidths = headers.map(header => {
        const headerWidth = doc.widthOfString(header); // Calculate the width required for each header
        const targetWidth = (availableWidth / headers.length).toFixed(2); // Calculate the target width for each column
        return parseFloat((availableWidth / headers.length).toFixed(2)); // Distribute evenly within available width
    });
    // width for each column
    const columnWidth = (availableWidth / headers.length).toFixed(2);  //return it to adjust width
    console.log('column width', columnWidth);
    console.log('column width array', columnWidths);
    let sum = 0;  //comment
    columnWidths.map((width) => sum += width); //comment
    console.log("Total Array width", sum); //comment

    let headerHeights = headers.map(header => {
        const headerHeight = parseFloat((doc.heightOfString(header, { width: columnWidths[headers.indexOf(header)] })).toFixed(2));
        if (headerHeight > updatedCellHeight)
            updatedCellHeight = headerHeight;
        return headerHeight;
    });

    // const headerVerticalPadding = 8;
    headerHeights = headerHeights.map((height) => {
        return updatedCellHeight;
    })
    console.log("Header height array", headerHeights);
    console.log('Updated cell Height', updatedCellHeight);

    //comment
    rows.forEach(row => {
        row.forEach((cell, cellIndex) => {
            const cellWidth = doc.widthOfString(cell.toString());
            if (cellWidth > columnWidths[cellIndex]) {
                columnWidths[cellIndex] = Math.min(cellWidth, availableWidth / headers.length); // Distribute evenly within available width
            }
        });
    });

    return { columnWidths, headerHeights };
}

// Utility function to sum an array
function sum(array) {
    return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}


/*
 Function to draw the entire table
function drawTable(doc, table) {
  const { headers, rows } = table;
  const columnCount = headers.length;
  const rowCount = rows.length;

  // Set table properties
  const startX = doc.page.margins.left;
  const startY = doc.page.margins.top;
  const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const cellPadding = 10;
  const cellHeight = 30;
  const lineWidth = 1;

  // Calculate column widths and header heights
  const { columnWidths, headerHeights } = calculateColumnWidthsAndHeaderHeights(headers, rows, doc, availableWidth, cellPadding);

  // Draw headers
  doc.font('Helvetica-Bold');
  headers.forEach((header, i) => {
    const headerWidth = columnWidths[i];
    const headerHeight = headerHeights[i];
    doc.text(header, startX + sum(columnWidths.slice(0, i)) + cellPadding, startY + headerHeight + cellPadding, { width: headerWidth - cellPadding * 2, height: headerHeight, align: 'center' });
  });

  // Draw rows
  doc.font('Helvetica');
  rows.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const width = columnWidths[cellIndex];
      const x = startX + sum(columnWidths.slice(0, cellIndex)) + cellPadding;
      const y = startY + headerHeights[cellIndex] + cellHeight + rowIndex * cellHeight + cellPadding * (rowIndex + 1);
      doc.text(cell.toString(), x, y, { width: width - cellPadding * 2 });

      // Draw a line at the bottom of each row
      if (rowIndex === rows.length - 1) {
        doc.moveTo(startX, y + cellHeight)
           .lineTo(startX + sum(columnWidths), y + cellHeight)
           .lineWidth(lineWidth)
           .stroke();
      }
    });
  });

  // Draw borders
  const tableWidth = sum(columnWidths);
  const tableHeight = (rowCount + 1) * cellHeight + cellPadding * (rowCount + 1);
  doc.rect(startX, startY, tableWidth, tableHeight).stroke();
}

// Function to calculate column widths and header heights based on content and available width
function calculateColumnWidthsAndHeaderHeights(headers, rows, doc, availableWidth, cellPadding) {
  const columnWidths = headers.map(header => {
    const headerWidth = doc.widthOfString(header) + 2 * cellPadding;
    return Math.min(headerWidth, availableWidth / headers.length); // Distribute evenly within available width
  });

  const headerHeights = headers.map(header => {
    const headerHeight = doc.heightOfString(header, { width: columnWidths[headers.indexOf(header)] }) + 2 * cellPadding;
    return headerHeight;
  });

  rows.forEach(row => {
    row.forEach((cell, cellIndex) => {
      const cellWidth = doc.widthOfString(cell.toString()) + 2 * cellPadding;
      if (cellWidth > columnWidths[cellIndex]) {
        columnWidths[cellIndex] = Math.min(cellWidth, availableWidth / headers.length); // Distribute evenly within available width
      }
    });
  });

  return { columnWidths, headerHeights };
}

// Utility function to sum an array
function sum(array) {
  return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}
*/


// // Function to draw the entire table
// function drawTable(doc, table) {
//     const { headers, rows } = table;
//     const columnCount = headers.length;
//     const rowCount = rows.length;

//     // Set table properties
//     const startX = doc.page.margins.left;
//     const startY = doc.page.margins.top;
//     const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
//     const cellPadding = 10;
//     const cellHeight = 30;

//     // Calculate column widths
//     const columnWidths = calculateColumnWidths(headers, rows, doc, availableWidth, cellPadding);

//     // Draw headers
//     doc.font('Helvetica-Bold');
//     headers.forEach((header, i) => {
//         doc.text(header, startX + sum(columnWidths.slice(0, i)) + cellPadding, startY + cellPadding);
//     });

//     // Draw rows
//     doc.font('Helvetica');
//     rows.forEach((row, rowIndex) => {
//         row.forEach((cell, cellIndex) => {
//             const width = columnWidths[cellIndex];
//             const x = startX + sum(columnWidths.slice(0, cellIndex)) + cellPadding;
//             const y = startY + cellHeight + rowIndex * cellHeight + cellPadding * (rowIndex + 1);
//             doc.text(cell.toString(), x, y, { width: width - cellPadding * 2 });
//         });
//     });

//     // Draw borders
//     const tableWidth = sum(columnWidths);
//     const tableHeight = (rowCount + 1) * cellHeight + cellPadding * (rowCount + 1);
//     doc.rect(startX, startY, tableWidth, tableHeight).stroke();
// }

// // Function to calculate column widths based on content and available width
// function calculateColumnWidths(headers, rows, doc, availableWidth, cellPadding) {
//     const columnWidths = headers.map(header => {
//         const headerWidth = doc.widthOfString(header) + 2 * cellPadding;
//         return Math.min(headerWidth, availableWidth / headers.length); // Distribute evenly within available width
//     });

//     rows.forEach(row => {
//         row.forEach((cell, cellIndex) => {
//             const cellWidth = doc.widthOfString(cell.toString()) + 2 * cellPadding;
//             if (cellWidth > columnWidths[cellIndex]) {
//                 columnWidths[cellIndex] = Math.min(cellWidth, availableWidth / headers.length); // Distribute evenly within available width
//             }
//         });
//     });

//     return columnWidths;
// }

// // Utility function to sum an array
// function sum(array) {
//     return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
// }

// Function to draw table headers
// function drawTableHeaders(doc, headers) {
//     doc.font('Helvetica-Bold');
//     headers.forEach((header, i) => {
//         doc.text(header, 50 + i * 150, 100);
//     });
// }

// // Function to draw table rows
// function drawTableRows(doc, rows) {
//     doc.font('Helvetica');
//     rows.forEach((row, rowIndex) => {
//         row.forEach((cell, cellIndex) => {
//             doc.text(cell.toString(), 50 + cellIndex * 150, 120 + rowIndex * 30);
//         });
//     });
// }

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
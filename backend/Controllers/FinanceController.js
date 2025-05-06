import Finance from '../models/Finance.js';
import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const HttpType = {
  OK: { code: 200 },
  CREATED: { code: 201 },
  BAD_REQUEST: { code: 400 },
  NOT_FOUND: { code: 404 },
  INTERNAL_SERVER_ERROR: { code: 500 }
};

const ResTypes = {
  errors: {
    create_error: { message: "Error creating finance record" },
    server_error: { message: "Internal server error" },
    not_found: { message: "Finance record not found" },
    upadate_error: { message: "Error updating finance record" },
    delete_error: { message: "Error deleting finance record" }
  }
};

const response = (res, statusCode, data) => {
  return res.status(statusCode).json(data);
};

// Create a new finance record
export const createFinance = async (req, res) => {
  try {
    const finance = new Finance(req.body);
    await finance.save();
    
    return response(res, HttpType.CREATED.code, {
      message: "Finance record created successfully",
      data: finance
    });
  } catch (error) {
    console.error("Create finance error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.create_error);
  }
};

// Get all finance records with pagination and search
export const getAllFinances = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const total = await Finance.countDocuments();
    const finances = await Finance.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    return response(res, HttpType.OK.code, {
      data: finances,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get finances error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

// Get a single finance record by ID
export const getFinanceById = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);
    return response(res, HttpType.OK.code, {
      data: finance
    });
  } catch (error) {
    console.error("Get finance error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

// Update a finance record
export const updateFinance = async (req, res) => {
  try {
    const updatedFinance = await Finance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    return response(res, HttpType.OK.code, {
      message: "Finance record updated successfully",
      data: updatedFinance
    });
  } catch (error) {
    console.error("Update finance error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.upadate_error);
  }
};

// Delete a finance record
export const deleteFinance = async (req, res) => {
  try {
    await Finance.findByIdAndDelete(req.params.id);
    
    return response(res, HttpType.OK.code, {
      message: "Finance record deleted successfully"
    });
  } catch (error) {
    console.error("Delete finance error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.delete_error);
  }
};

// Get finance categories
export const getFinanceCategories = async (req, res) => {
  try {
    const categories = await Finance.distinct('category');
    
    return response(res, HttpType.OK.code, {
      data: categories
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

// Generate PDF report for finance records
export const generateFinanceReport = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { startDate, endDate, type } = req.query;
    
    // Build filter query
    let query = {};
    
    // Add date filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.date.$lte = endDateTime;
      }
    }
    
    // Add type filtering
    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }
    
    console.log('Finance report query:', query);
    
    // Fetch finances with applied filters
    const finances = await Finance.find(query).sort({ date: -1 });
    
    const doc = new PDFDocument();
    const filename = `finance_report_${Date.now()}.pdf`;
    const filePath = path.join('temp', filename);
    
    if (!fs.existsSync('temp')) {
      fs.mkdirSync('temp');
    }
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    
    // Header
    doc.fontSize(24).fillColor('#2563eb').text('Finance Report', { align: 'center' });
    doc.moveDown(0.5);
    
    // Report metadata
    doc.fontSize(10).fillColor('#64748b')
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
    
    // Add filter information to report
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#334155');
    
    if (startDate || endDate) {
      const dateRangeText = `Date Range: ${startDate ? new Date(startDate).toLocaleDateString() : 'All'} to ${endDate ? new Date(endDate).toLocaleDateString() : 'Present'}`;
      doc.text(dateRangeText);
    }
    
    if (type) {
      doc.text(`Transaction Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    }
    
    doc.text(`Total Records: ${finances.length}`);
    doc.moveDown(0.5);

    // Table header
    const tableTop = 200; // Increased to accommodate filter info
    const rowHeight = 30;
    const colWidth = 110;
    
    // Draw table header
    doc.fillColor('#1e40af').rect(50, tableTop - 20, 500, 25).fill();
    doc.fillColor('#ffffff')
      .fontSize(10)
      .text('Date', 60, tableTop - 15)
      .text('Type', 170, tableTop - 15)
      .text('Category', 280, tableTop - 15)
      .text('Amount', 390, tableTop - 15)
      .text('Description', 470, tableTop - 15);
    
    let totalIncome = 0;
    let totalExpense = 0;
    let yPos = tableTop + 10;
    
    // Table rows
    finances.forEach((finance, index) => {
      if (finance.type === 'income') {
        totalIncome += finance.amount;
      } else {
        totalExpense += finance.amount;
      }
      
      // Alternate row colors
      doc.fillColor(index % 2 === 0 ? '#f1f5f9' : '#e2e8f0')
        .rect(50, yPos - 15, 500, rowHeight)
        .fill();
      
      doc.fillColor('#334155')
        .fontSize(9)
        .text(new Date(finance.date).toLocaleDateString(), 60, yPos - 10)
        .text(finance.type.charAt(0).toUpperCase() + finance.type.slice(1), 170, yPos - 10)
        .text(finance.category, 280, yPos - 10)
        .text(finance.amount.toFixed(2), 390, yPos - 10)
        .text(finance.description || 'N/A', 470, yPos - 10, { width: 80 });
      
      yPos += rowHeight;
      
      // Add new page if needed
      if (yPos > 700) {
        doc.addPage();
        yPos = 50;
      }
    });
    
    doc.moveDown(2);
    
    // Summary section with styled box
    doc.fillColor('#e2e8f0').rect(50, yPos, 500, 100).fill();
    doc.fillColor('#1e40af').fontSize(14).text('Summary', 60, yPos + 10, { underline: true });
    doc.fillColor('#334155').fontSize(12)
      .text(`Total Income: ${totalIncome.toFixed(2)}`, 60, yPos + 35)
      .text(`Total Expense: ${totalExpense.toFixed(2)}`, 60, yPos + 55);
    
    // Net amount with conditional color
    const netAmount = totalIncome - totalExpense;
    doc.fillColor(netAmount >= 0 ? '#059669' : '#dc2626')
      .text(`Net Amount: ${netAmount.toFixed(2)}`, 60, yPos + 75);
    
    // Footer
    doc.fontSize(8).fillColor('#94a3b8')
      .text('Generated by Finance Management System', 50, doc.page.height - 50, {
        align: 'center',
        width: doc.page.width - 100
      });
    
    doc.end();
    
    stream.on('finish', () => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      fileStream.on('end', () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error("Generate report error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

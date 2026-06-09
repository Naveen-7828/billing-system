package com.forge.billing_system.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.forge.billing_system.entity.Invoice;
import com.forge.billing_system.entity.InvoiceItem;
import com.forge.billing_system.entity.Product;
import com.forge.billing_system.repository.InvoiceRepository;
import com.forge.billing_system.repository.ProductRepository;

import java.io.ByteArrayOutputStream;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ProductRepository productRepository;

    // ================= CREATE INVOICE =================
    public Invoice createInvoice(Invoice invoice) {

        double subTotal = 0.0;
        double gstTotal = 0.0;

        invoice.setInvoiceDate(LocalDateTime.now());

        for (InvoiceItem item : invoice.getItems()) {

            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Product not found with ID: " + item.getProduct().getId()));

            // STOCK CHECK
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for product: " + product.getProductName());
            }

            // REDUCE STOCK
            product.setStockQuantity(
                    product.getStockQuantity() - item.getQuantity());

            productRepository.save(product);

            // SNAPSHOT
            item.setProductName(product.getProductName());

            double price = product.getSellingPrice();
            double gstRate = product.getGstRate();

            double baseAmount = price * item.getQuantity();
            double gstAmount = baseAmount * gstRate / 100;

            item.setPrice(price);
            item.setGstRate(gstRate);
            item.setLineTotal(baseAmount + gstAmount);

            item.setInvoice(invoice);

            subTotal += baseAmount;
            gstTotal += gstAmount;
        }

        invoice.setSubTotal(subTotal);
        invoice.setGstAmount(gstTotal);
        invoice.setTotalAmount(subTotal + gstTotal);

        return invoiceRepository.save(invoice);
    }

    // ================= GET ALL =================
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // ================= GET BY ID =================
    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    // ================= DELETE INVOICE =================
    public void deleteInvoice(Long id) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        // OPTIONAL: RESTORE STOCK ON DELETE (VERY IMPORTANT)

        for (InvoiceItem item : invoice.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElse(null);

            if (product != null) {
                product.setStockQuantity(
                        product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }

        invoiceRepository.delete(invoice);
    }
    
  

    public byte[] generateInvoicePdf(Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found"));

        try {

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(document, out);

            document.open();

            // ================= TITLE =================

            Font titleFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    18);

            Paragraph title = new Paragraph(
                    "FORGE INDIA CONNECT BILLING SYSTEM",
                    titleFont);

            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);

            document.add(new Paragraph(" "));

            // ================= STORE DETAILS =================

            Font storeFont = FontFactory.getFont(
                    FontFactory.HELVETICA,
                    10);

            Paragraph storeDetails = new Paragraph(
                    "Forge India Connect\n" +
                    "No. 12,RK Tower, krishnagiri, Tamil Nadu - 635104\n" +
                    "Phone : +91 9876543210\n" +
                    "GST No : 33ABCDE1234F1Z5\n" +
                    "Email : info@forgeindiaconnect.com",
                    storeFont);

            storeDetails.setAlignment(Element.ALIGN_CENTER);

            document.add(storeDetails);

            document.add(new Paragraph(
                    "-------------------------------------------------------------"));

            document.add(new Paragraph(" "));

            // ================= INVOICE INFO =================

            document.add(new Paragraph(
                    "Invoice ID : " + invoice.getId()));

            document.add(new Paragraph(
                    "Invoice Date : " + invoice.getInvoiceDate()));

            document.add(new Paragraph(" "));

            // ================= CUSTOMER DETAILS =================

            Font customerFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    12);

            document.add(new Paragraph(
                    "Customer Details",
                    customerFont));

            document.add(new Paragraph(
                    "Customer Name : "
                            + invoice.getCustomer().getCustomerName()));

            document.add(new Paragraph(
                    "Phone : "
                            + invoice.getCustomer().getPhoneNumber()));

            document.add(new Paragraph(
                    "Email : "
                            + invoice.getCustomer().getEmail()));

            document.add(new Paragraph(
                    "Address : "
                            + invoice.getCustomer().getAddress()));

            document.add(new Paragraph(
                    "GST No : "
                            + invoice.getCustomer().getGstNumber()));

            document.add(new Paragraph(" "));

            // ================= PRODUCT TABLE =================

            PdfPTable table = new PdfPTable(5);

            table.setWidthPercentage(100);

            table.addCell("Product");
            table.addCell("Quantity");
            table.addCell("Price");
            table.addCell("GST %");
            table.addCell("Total");

            for (InvoiceItem item : invoice.getItems()) {

                table.addCell(item.getProductName());

                table.addCell(
                        String.valueOf(item.getQuantity()));

                table.addCell(
                        "₹" + item.getPrice());

                table.addCell(
                        item.getGstRate() + "%");

                table.addCell(
                        "₹" + item.getLineTotal());
            }

            document.add(table);

            document.add(new Paragraph(" "));

            // ================= TOTALS =================

            document.add(new Paragraph(
                    "Subtotal : ₹" + invoice.getSubTotal()));

            document.add(new Paragraph(
                    "GST Amount : ₹" + invoice.getGstAmount()));

            document.add(new Paragraph(
                    "Grand Total : ₹" + invoice.getTotalAmount()));

            document.add(new Paragraph(" "));

            // ================= FOOTER =================

            Paragraph footer = new Paragraph(
                    "Thank you for your business!",
                    FontFactory.getFont(
                            FontFactory.HELVETICA_OBLIQUE,
                            10));

            footer.setAlignment(Element.ALIGN_CENTER);

            document.add(footer);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error generating PDF", e);
        }
    }}
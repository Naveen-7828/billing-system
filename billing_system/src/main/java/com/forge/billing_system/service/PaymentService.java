package com.forge.billing_system.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.forge.billing_system.entity.Invoice;
import com.forge.billing_system.entity.Payment;
import com.forge.billing_system.repository.InvoiceRepository;
import com.forge.billing_system.repository.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    // ================= CREATE PAYMENT =================
    public Payment createPayment(Payment payment) {

        if (payment.getInvoice() == null || payment.getInvoice().getId() == null) {
            throw new RuntimeException("Invoice is required");
        }

        Invoice invoice = invoiceRepository.findById(payment.getInvoice().getId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        payment.setInvoice(invoice);

        // Auto amount from invoice
        payment.setAmount(invoice.getTotalAmount());

        // Default values
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus("PAID");

        return paymentRepository.save(payment);
    }

    // ================= GET ALL PAYMENTS =================
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // ================= GET PAYMENT BY ID =================
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // ================= UPDATE PAYMENT =================
    public Payment updatePayment(Long id, Payment payment) {

        Payment existing = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        existing.setPaymentMethod(payment.getPaymentMethod());
        existing.setTransactionReference(payment.getTransactionReference());
        existing.setStatus(payment.getStatus());

        return paymentRepository.save(existing);
    }

    // ================= DELETE PAYMENT =================
    public void deletePayment(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        paymentRepository.delete(payment);
    }
}
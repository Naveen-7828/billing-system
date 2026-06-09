package com.forge.billing_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.forge.billing_system.dto.BillingItemDTO;
import com.forge.billing_system.dto.BillingRequestDTO;
import com.forge.billing_system.dto.BillingResponseDTO;
import com.forge.billing_system.entity.Customer;
import com.forge.billing_system.entity.Invoice;
import com.forge.billing_system.entity.InvoiceItem;
import com.forge.billing_system.entity.Payment;
import com.forge.billing_system.entity.Product;
import com.forge.billing_system.repository.CustomerRepository;
import com.forge.billing_system.repository.InvoiceRepository;
import com.forge.billing_system.repository.PaymentRepository;
import com.forge.billing_system.repository.ProductRepository;

@Service
public class BillingService {

@Autowired
private CustomerRepository customerRepository;

@Autowired
private ProductRepository productRepository;

@Autowired
private InvoiceRepository invoiceRepository;

@Autowired
private PaymentRepository paymentRepository;

public BillingResponseDTO generateBill(
        BillingRequestDTO request) {

    Customer customer;

    // EXISTING CUSTOMER
    if (request.getCustomerId() != null) {

        customer = customerRepository.findById(
                request.getCustomerId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found"));

    } else {

        // NEW CUSTOMER
        customer = new Customer();

        customer.setCustomerName(
                request.getCustomerName());

        customer.setPhoneNumber(
                request.getPhoneNumber());

        customer.setEmail(
                request.getEmail());

        customer.setAddress(
                request.getAddress());

        customer.setGstNumber(
                request.getGstNumber());

        customer = customerRepository.save(customer);
    }

    // CREATE INVOICE
    Invoice invoice = new Invoice();
    invoice.setCustomer(customer);

    double subTotal = 0.0;
    double gstTotal = 0.0;

    for (BillingItemDTO dto : request.getItems()) {

        Product product = productRepository.findById(
                dto.getProductId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"));

        // STOCK CHECK
        if (product.getStockQuantity() < dto.getQuantity()) {

            throw new RuntimeException(
                    "Insufficient stock for product: "
                            + product.getProductName());
        }

        // REDUCE STOCK
        product.setStockQuantity(
                product.getStockQuantity()
                        - dto.getQuantity());

        productRepository.save(product);

        // INVOICE ITEM
        InvoiceItem item = new InvoiceItem();

        item.setProduct(product);
        item.setProductName(
                product.getProductName());

        item.setQuantity(
                dto.getQuantity());

        item.setPrice(
                product.getSellingPrice());

        item.setGstRate(
                product.getGstRate());

        double baseAmount =
                product.getSellingPrice()
                        * dto.getQuantity();

        double gstAmount =
                baseAmount
                        * product.getGstRate()
                        / 100;

        double lineTotal =
                baseAmount + gstAmount;

        item.setLineTotal(lineTotal);

        invoice.addItem(item);

        subTotal += baseAmount;
        gstTotal += gstAmount;
    }

    invoice.setSubTotal(subTotal);
    invoice.setGstAmount(gstTotal);
    invoice.setTotalAmount(
            subTotal + gstTotal);

    invoice = invoiceRepository.save(invoice);

    // CREATE PAYMENT
    Payment payment = new Payment();

    payment.setInvoice(invoice);

    payment.setAmount(
            invoice.getTotalAmount());

    payment.setPaymentMethod(
            request.getPaymentMethod());

    payment.setTransactionReference(
            request.getTransactionReference());

    payment.setStatus(
            request.getPaymentStatus());

    payment = paymentRepository.save(payment);

    // RESPONSE
    BillingResponseDTO response =
            new BillingResponseDTO();

    response.setCustomerId(
            customer.getId());

    response.setInvoiceId(
            invoice.getId());

    response.setPaymentId(
            payment.getId());

    response.setTotalAmount(
            invoice.getTotalAmount());

    response.setMessage(
            "Bill Generated Successfully");

    return response;
}

}


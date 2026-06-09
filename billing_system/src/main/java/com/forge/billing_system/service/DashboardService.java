package com.forge.billing_system.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.forge.billing_system.dto.*;
import com.forge.billing_system.repository.*;

@Service
public class DashboardService {

    @Autowired private CustomerRepository customerRepo;
    @Autowired private ProductRepository productRepo;
    @Autowired private InvoiceRepository invoiceRepo;
    @Autowired private PaymentRepository paymentRepo;

    public Dashboard getDashboard() {

        Dashboard res = new Dashboard();

        // ================= CORE KPIs =================
        res.setTotalCustomers(customerRepo.count());
        res.setTotalProducts(productRepo.count());
        res.setTotalInvoices(invoiceRepo.count());

        Double revenue = invoiceRepo.getTotalRevenue();
        Double payments = paymentRepo.getTotalPayments();

        res.setTotalRevenue(revenue != null ? revenue : 0);
        res.setTotalPayments(payments != null ? payments : 0);

        res.setPendingPayments(
                res.getTotalRevenue() - res.getTotalPayments()
        );

        // ================= LOW STOCK =================
        List<LowStockProductDTO> lowStock = productRepo
                .findByStockQuantityLessThanEqual(5)
                .stream()
                .map(p -> {
                    LowStockProductDTO dto = new LowStockProductDTO();
                    dto.setProductId(p.getId());
                    dto.setProductName(p.getProductName());
                    dto.setStockQuantity(p.getStockQuantity());
                    return dto;
                })
                .collect(Collectors.toList());

        res.setLowStockProducts(lowStock);

        // ================= RECENT INVOICES =================
        List<RecentInvoiceDTO> recentInvoices = invoiceRepo
                .findTop5ByOrderByInvoiceDateDesc()
                .stream()
                .map(i -> {
                    RecentInvoiceDTO dto = new RecentInvoiceDTO();
                    dto.setInvoiceId(i.getId());
                    dto.setCustomerName(
                            i.getCustomer() != null
                                    ? i.getCustomer().getCustomerName()
                                    : "N/A"
                    );
                    dto.setTotalAmount(i.getTotalAmount());
                    dto.setInvoiceDate(i.getInvoiceDate());
                    return dto;
                })
                .collect(Collectors.toList());

        res.setRecentInvoices(recentInvoices);

        return res;
    }
}
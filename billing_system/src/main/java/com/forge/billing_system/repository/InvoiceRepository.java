package com.forge.billing_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.forge.billing_system.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    @Query("SELECT COALESCE(SUM(i.totalAmount),0) FROM Invoice i")
    Double getTotalRevenue();

    List<Invoice> findTop5ByOrderByInvoiceDateDesc();
}

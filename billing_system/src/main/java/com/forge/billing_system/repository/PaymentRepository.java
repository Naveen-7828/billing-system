package com.forge.billing_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.forge.billing_system.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT COALESCE(SUM(p.amount),0) FROM Payment p")
    Double getTotalPayments();
}

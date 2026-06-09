package com.forge.billing_system.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.forge.billing_system.entity.Invoice;


public interface DashboardRepository extends JpaRepository<Invoice, Long> {

   
}

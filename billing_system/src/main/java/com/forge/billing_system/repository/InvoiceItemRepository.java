package com.forge.billing_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.forge.billing_system.entity.InvoiceItem;

public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, Long> {
	
}

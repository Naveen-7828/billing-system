package com.forge.billing_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.forge.billing_system.entity.Customer;

public interface CustomerRepository
        extends JpaRepository<Customer, Long> {

    List<Customer> findByCustomerNameContainingIgnoreCase(String keyword);
}

package com.forge.billing_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.forge.billing_system.entity.Product;


public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStockQuantityLessThanEqual(Integer qty);

    List<Product> findByProductNameContainingIgnoreCase(String keyword);
}

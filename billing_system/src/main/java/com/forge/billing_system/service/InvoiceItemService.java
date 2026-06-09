package com.forge.billing_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.forge.billing_system.entity.InvoiceItem;
import com.forge.billing_system.entity.Product;
import com.forge.billing_system.repository.ProductRepository;

@Service
public class InvoiceItemService {

    @Autowired
    private ProductRepository productRepository;

    public InvoiceItem processItem(InvoiceItem item) {

        // Validate quantity
        if (item.getQuantity() == null || item.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        // Validate product
        if (item.getProduct() == null || item.getProduct().getId() == null) {
            throw new RuntimeException("Product is required");
        }

        // Fetch product from database
        Product product = productRepository.findById(item.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Save product snapshot
        item.setProductName(product.getProductName());
        item.setPrice(product.getSellingPrice());
        item.setGstRate(product.getGstRate());

        // Calculate totals
        double baseAmount = item.getPrice() * item.getQuantity();
        double gstAmount = baseAmount * item.getGstRate() / 100;
        double lineTotal = baseAmount + gstAmount;

        item.setLineTotal(lineTotal);

        return item;
    }
}
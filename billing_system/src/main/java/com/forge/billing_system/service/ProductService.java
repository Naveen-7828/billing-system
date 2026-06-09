package com.forge.billing_system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.forge.billing_system.entity.Product;
import com.forge.billing_system.repository.ProductRepository;

@Service
public class ProductService {
	
	@Autowired
	private ProductRepository productRepo;
	
	public Product createProduct(Product pd) {
		return productRepo.save(pd); 
	}
	
	// Get All
    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    // Get By Id
    public Product getProductById(Long id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // Update
    public Product updateProduct(Long id, Product product) {

        Product existingProduct = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setProductName(product.getProductName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setSku(product.getSku());
        existingProduct.setSellingPrice(product.getSellingPrice());
        existingProduct.setCostPrice(product.getCostPrice());
        existingProduct.setStockQuantity(product.getStockQuantity());
        existingProduct.setGstRate(product.getGstRate());

        return productRepo.save(existingProduct);
    }

    // Delete
    public void deleteProduct(Long id) {
        productRepo.deleteById(id);
    }
    
    public List<Product> searchProducts(String keyword) {
        return productRepo
                .findByProductNameContainingIgnoreCase(keyword);
    }
}



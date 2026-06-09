package com.forge.billing_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.forge.billing_system.entity.Product;
import com.forge.billing_system.service.ProductService;

@RestController
@RequestMapping("api/product")
@CrossOrigin(origins = "*")
public class ProductController {

	@Autowired
	private ProductService serviceRepo;
	
	@PostMapping
	public Product createProduct(@RequestBody Product pd) {
		return serviceRepo.createProduct(pd);
	}
	// Get All
    @GetMapping
    public List<Product> getAllProducts() {
        return serviceRepo.getAllProducts();
    }

    // Get By Id
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return serviceRepo.getProductById(id);
    }

    // Update
    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        return serviceRepo.updateProduct(id, product);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {

    	serviceRepo.deleteProduct(id);

        return "Product deleted successfully";
    }
    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam String keyword) {

        return serviceRepo.searchProducts(keyword);
    }
}

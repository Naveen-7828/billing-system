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

import com.forge.billing_system.entity.Customer;
import com.forge.billing_system.service.CustomerService;

@RestController
@RequestMapping("api/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

	@Autowired
	private CustomerService serviceRepo;
	
	@PostMapping
	public Customer createCustomer(@RequestBody Customer ca) {
		return serviceRepo.createCustomer(ca);
	}
	 @GetMapping
	    public List<Customer> getAllCustomers() {
	        return serviceRepo.getAllCustomers();
	    }

	    @GetMapping("/{id}")
	    public Customer getCustomerById(@PathVariable Long id) {
	        return serviceRepo.getCustomerById(id);
	    }

	    @PutMapping("/{id}")
	    public Customer updateCustomer(
	            @PathVariable Long id,
	            @RequestBody Customer customer) {

	        return serviceRepo.updateCustomer(id, customer);
	    }

	    @DeleteMapping("/{id}")
	    public String deleteCustomer(@PathVariable Long id) {

	    	serviceRepo.deleteCustomer(id);

	        return "Customer deleted successfully";
	    }
	    
	    @GetMapping("/search")
	    public List<Customer> searchCustomer(
	            @RequestParam String keyword) {

	        return serviceRepo.searchCustomer(keyword);
	    }
	}



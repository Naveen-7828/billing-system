package com.forge.billing_system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.forge.billing_system.entity.Customer;
import com.forge.billing_system.repository.CustomerRepository;

@Service
public class CustomerService {

	@Autowired
	private CustomerRepository customerRepo;
	
	public Customer createCustomer(Customer ca) {
		return customerRepo.save(ca);
	}
	public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer updateCustomer(Long id, Customer customer) {

        Customer existingCustomer = customerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        existingCustomer.setCustomerName(customer.getCustomerName());
        existingCustomer.setPhoneNumber(customer.getPhoneNumber());
        existingCustomer.setEmail(customer.getEmail());
        existingCustomer.setAddress(customer.getAddress());
        existingCustomer.setGstNumber(customer.getGstNumber());

        return customerRepo.save(existingCustomer);
    }

    public void deleteCustomer(Long id) {
        customerRepo.deleteById(id);
    }
    
    public List<Customer> searchCustomer(String keyword) {

        return customerRepo
                .findByCustomerNameContainingIgnoreCase(keyword);
    }
}
		
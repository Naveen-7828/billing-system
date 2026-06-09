package com.forge.billing_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.forge.billing_system.dto.BillingRequestDTO;
import com.forge.billing_system.dto.BillingResponseDTO;
import com.forge.billing_system.service.BillingService;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "*")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @PostMapping("/generate")
    public BillingResponseDTO generateBill(
            @RequestBody BillingRequestDTO request) {

        return billingService.generateBill(request);
    }
}
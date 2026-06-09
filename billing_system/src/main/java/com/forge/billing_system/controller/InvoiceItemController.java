package com.forge.billing_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.forge.billing_system.entity.InvoiceItem;
import com.forge.billing_system.service.InvoiceItemService;

@RestController
@RequestMapping("/api/invoice-items")
@CrossOrigin(origins = "*")
public class InvoiceItemController {

    @Autowired
    private InvoiceItemService itemService;

    // ✅ TEST ITEM CALCULATION ONLY
    @PostMapping("/calculate")
    public InvoiceItem calculateItem(@RequestBody InvoiceItem item) {
        return itemService.processItem(item);
    }
}
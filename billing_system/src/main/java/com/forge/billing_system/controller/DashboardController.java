package com.forge.billing_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.forge.billing_system.dto.Dashboard;
import com.forge.billing_system.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public Dashboard getDashboard() {
        return dashboardService.getDashboard();
    }
}
package com.forge.billing_system.dto;

import java.util.List;

public class Dashboard {

    // ================= CORE KPIs =================
    private Long totalCustomers;
    private Long totalProducts;
    private Long totalInvoices;
    private Double totalRevenue;
    private double totalPayments;
    private Double pendingPayments;

    // ================= ADVANCED =================
    private List<LowStockProductDTO> lowStockProducts;
    private List<RecentInvoiceDTO> recentInvoices;
	public Long getTotalCustomers() {
		return totalCustomers;
	}
	public void setTotalCustomers(Long totalCustomers) {
		this.totalCustomers = totalCustomers;
	}
	public Long getTotalProducts() {
		return totalProducts;
	}
	public void setTotalProducts(Long totalProducts) {
		this.totalProducts = totalProducts;
	}
	public Long getTotalInvoices() {
		return totalInvoices;
	}
	public void setTotalInvoices(Long totalInvoices) {
		this.totalInvoices = totalInvoices;
	}
	public Double getTotalRevenue() {
		return totalRevenue;
	}
	public void setTotalRevenue(Double totalRevenue) {
		this.totalRevenue = totalRevenue;
	}
	public double getTotalPayments() {
		return totalPayments;
	}
	public void setTotalPayments(double totalPayments2) {
		this.totalPayments = totalPayments2;
	}
	public Double getPendingPayments() {
		return pendingPayments;
	}
	public void setPendingPayments(Double pendingPayments) {
		this.pendingPayments = pendingPayments;
	}
	public List<LowStockProductDTO> getLowStockProducts() {
		return lowStockProducts;
	}
	public void setLowStockProducts(List<LowStockProductDTO> lowStockProducts) {
		this.lowStockProducts = lowStockProducts;
	}
	public List<RecentInvoiceDTO> getRecentInvoices() {
		return recentInvoices;
	}
	public void setRecentInvoices(List<RecentInvoiceDTO> recentInvoices) {
		this.recentInvoices = recentInvoices;
	}

    
}
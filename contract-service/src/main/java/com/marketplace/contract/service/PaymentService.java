package com.marketplace.contract.service;

import com.marketplace.contract.dto.payment.PaymentResponse;

public interface PaymentService {
    PaymentResponse processPayment(Long milestoneId, Long userId);

    PaymentResponse getPaymentById(Long id);

    PaymentResponse getPaymentByMilestoneId(Long milestoneId);
}

package com.marketplace.contract.controller;

import com.marketplace.contract.dto.payment.PaymentResponse;
import com.marketplace.contract.security.SecurityUtil;
import com.marketplace.contract.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    private final SecurityUtil securityUtil;

    @PostMapping("/{milestoneId}/pay")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<PaymentResponse> processPayment(@PathVariable Long milestoneId){
        Long userId = securityUtil.getCurrentUserId();
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(paymentService.processPayment(milestoneId, userId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'FREELANCER', 'ADMIN')")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id){
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/milestone/{milestoneId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'FREELANCER', 'ADMIN')")
    public ResponseEntity<PaymentResponse> getPaymentByMilestoneId(@PathVariable Long milestoneId) {
        return ResponseEntity.ok(paymentService.getPaymentByMilestoneId(milestoneId));
    }
}

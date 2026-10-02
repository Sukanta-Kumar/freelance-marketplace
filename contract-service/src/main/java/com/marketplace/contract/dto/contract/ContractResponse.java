package com.marketplace.contract.dto;

import com.marketplace.contract.entity.ContractStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractResponse {
    private Long id;
    private Long projectId;
    private Long bidId;
    private Long clientId;
    private Long freelancerId;
    private BigDecimal totalAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private ContractStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

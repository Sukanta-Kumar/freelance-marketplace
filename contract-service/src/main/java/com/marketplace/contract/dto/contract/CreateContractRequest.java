package com.marketplace.contract.dto.contract;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateContractRequest {
    private Long projectId;
    private Long bidId;
    private Long clientId;
    private Long freelancerId;
    private BigDecimal totalAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}

package com.marketplace.bid.dto;

import com.marketplace.bid.entity.BidStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BidResponse {
    private Long id;
    private Long projectId;
    private Long freelancerId;
    private BigDecimal amount;
    private String proposal;
    private Integer estimatedDays;
    private BidStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

package com.marketplace.bid.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BidRequest {
    private Long projectId;
    private BigDecimal amount;
    private String proposal;
    private Integer estimatedDays;
}

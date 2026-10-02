package com.marketplace.contract.dto.milestone;

import com.marketplace.contract.entity.MilestoneStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MilestoneResponse {
    private Long id;
    private Long contractId;
    private String title;
    private String description;
    private BigDecimal amount;
    private Integer sequenceNumber;
    private MilestoneStatus status;
    private String submissionDescription;
    private String deliverableUrl;
    private String rejectionReason;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

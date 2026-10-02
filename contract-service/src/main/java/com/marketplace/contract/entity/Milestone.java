package com.marketplace.contract.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "milestones")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long contractId;
    private String title;
    private String description;
    private BigDecimal amount;
    private Integer sequenceNumber;
    @Enumerated(EnumType.STRING)
    private MilestoneStatus status;
    private String submissionDescription;
    private String deliverableUrl;
    private String rejectionReason;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate(){
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;

        if(status == null){
            status = MilestoneStatus.PENDING;
        }
    }
    @PreUpdate
    protected void onUpdate(){
        updatedAt = LocalDateTime.now();
    }
}

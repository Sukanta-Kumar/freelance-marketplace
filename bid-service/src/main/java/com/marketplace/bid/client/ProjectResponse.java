package com.marketplace.bid.dto;

import com.marketplace.bid.entity.ProjectStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal budget;
    private LocalDate deadline;
    private ProjectStatus status;
    private Long clientId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

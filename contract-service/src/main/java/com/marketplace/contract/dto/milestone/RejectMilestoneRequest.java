package com.marketplace.contract.dto.milestone;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RejectMilestoneRequest {
    @NotBlank(message = "Rejection reason is required")
    private String reason;
}

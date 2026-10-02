package com.marketplace.contract.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitMilestoneRequest {
    @NotBlank(message = "Submission description is required")
    private String description;

    @NotBlank(message = "Deliverable URL is required")
    private String deliverableUrl;
}

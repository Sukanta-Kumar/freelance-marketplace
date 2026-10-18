package com.marketplace.contract.service;

import com.marketplace.contract.dto.milestone.*;
import jakarta.validation.Valid;

import java.util.List;

public interface MilestoneService {
    MilestoneResponse createMilestone(@Valid CreateMilestoneRequest request, Long userId);

    MilestoneResponse getMilestoneById(Long id);

    List<MilestoneResponse> getMilestonesByContractId(Long contractId);

    MilestoneResponse updateMilestone(Long id, @Valid UpdateMilestoneRequest request, Long userId);

    MilestoneResponse startMilestone(Long id, Long userId);

    MilestoneResponse submitMilestone(Long id, @Valid SubmitMilestoneRequest request, Long userId);

    MilestoneResponse approveMilestone(Long id, Long userId);

    MilestoneResponse rejectMilestone(Long id, @Valid RejectMilestoneRequest request, Long userId);
}

package com.marketplace.contract.mapper;

import com.marketplace.contract.dto.milestone.CreateMilestoneRequest;
import com.marketplace.contract.dto.milestone.MilestoneResponse;
import com.marketplace.contract.dto.milestone.UpdateMilestoneRequest;
import com.marketplace.contract.entity.Milestone;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MilestoneMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "submissionDescription", ignore = true)
    @Mapping(target = "deliverableUrl", ignore = true)
    @Mapping(target = "rejectionReason", ignore = true)
    @Mapping(target = "paidAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Milestone toEntity(CreateMilestoneRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "contractId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "submissionDescription", ignore = true)
    @Mapping(target = "deliverableUrl", ignore = true)
    @Mapping(target = "rejectionReason", ignore = true)
    @Mapping(target = "paidAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(UpdateMilestoneRequest request, @MappingTarget Milestone milestone);

    MilestoneResponse toResponse(Milestone milestone);

    List<MilestoneResponse> toResponseList(List<Milestone> milestones);
}

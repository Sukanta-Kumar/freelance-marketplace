package com.marketplace.contract.mapper;

import com.marketplace.contract.dto.contract.ContractResponse;
import com.marketplace.contract.dto.contract.CreateContractRequest;
import com.marketplace.contract.entity.Contract;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ContractMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true) // Handled by @PrePersist (defaults to ACTIVE)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Contract toEntity(CreateContractRequest request);

    ContractResponse toResponse(Contract contract);

    List<ContractResponse> toResponseList(List<Contract> contracts);
}


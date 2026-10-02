package com.marketplace.contract.service;

import com.marketplace.contract.dto.contract.ContractResponse;
import com.marketplace.contract.dto.contract.CreateContractRequest;
import jakarta.validation.Valid;

import java.util.List;

public interface ContractService {

    ContractResponse createContract(@Valid CreateContractRequest request);

    ContractResponse getCotractById(Long id);

    List<ContractResponse> getContractsByClientId(Long clientId);

    List<ContractResponse> getContractsByFreelancerId(Long freelancerId);

    ContractResponse completeContract(Long id);

    ContractResponse cancelContract(Long id);
}

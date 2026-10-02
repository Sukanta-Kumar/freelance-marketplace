package com.marketplace.contract.service;

import com.marketplace.contract.client.ProjectClient;
import com.marketplace.contract.client.ProjectStatus;
import com.marketplace.contract.client.UpdateProjectStatusRequest;
import com.marketplace.contract.dto.contract.ContractResponse;
import com.marketplace.contract.dto.contract.CreateContractRequest;
import com.marketplace.contract.entity.Contract;
import com.marketplace.contract.entity.ContractStatus;
import com.marketplace.contract.exception.ApiException;
import com.marketplace.contract.exception.ResourceNotFoundException;
import com.marketplace.contract.mapper.ContractMapper;
import com.marketplace.contract.repository.ContractRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService{
    private final ContractRepository contractRepository;
    private final ContractMapper contractMapper;
    private final ProjectClient projectClient;

    @Override
    @Transactional
    public ContractResponse createContract(CreateContractRequest request) {
        if (contractRepository.findById(request.getBidId()).isPresent()){
            throw new ApiException("A contract already exists for bid ID: \" + request.getBidId()");
        }
        Contract contract = contractMapper.toEntity(request);
        contract = contractRepository.save(contract);

        // Update project status to IN_PROGRESS via OpenFeign
        projectClient.updateStatus(
                contract.getProjectId(),
                new UpdateProjectStatusRequest(ProjectStatus.IN_PROGRESS)
        );
        return contractMapper.toResponse(contract);
    }

    @Override
    public ContractResponse getCotractById(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract","contractId",id));
        return contractMapper.toResponse(contract);
    }

    @Override
    public List<ContractResponse> getContractsByClientId(Long clientId) {
        List<Contract> contracts = contractRepository.findByClientId(clientId);
        return contractMapper.toResponseList(contracts);
    }

    @Override
    public List<ContractResponse> getContractsByFreelancerId(Long freelancerId) {
        List<Contract> contracts = contractRepository.findByFreelancerId(freelancerId);
        return contractMapper.toResponseList(contracts);
    }

    @Override
    @Transactional
    public ContractResponse completeContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract","contractId",id));

        contract.setStatus(ContractStatus.COMPLETED);
        Contract updatedContract = contractRepository.save(contract);

        // Update project status to COMPLETED via OpenFeign
        projectClient.updateStatus(contract.getProjectId(), new UpdateProjectStatusRequest(ProjectStatus.COMPLETED));

        return contractMapper.toResponse(updatedContract);
    }

    @Override
    @Transactional
    public ContractResponse cancelContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract","contractId",id));
        if (contract.getStatus() == ContractStatus.COMPLETED){
            throw new ApiException("Cannot cancel a contract that is already COMPLETED.");
        }
        if (contract.getStatus() == ContractStatus.CANCELLED){
            throw new ApiException("Contract is already CANCELLED.");
        }
        contract.setStatus(ContractStatus.CANCELLED);
        Contract updatedContract = contractRepository.save(contract);

        return contractMapper.toResponse(contract);
    }
}

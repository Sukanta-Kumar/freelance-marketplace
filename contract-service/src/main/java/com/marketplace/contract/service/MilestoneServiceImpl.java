package com.marketplace.contract.service;

import com.marketplace.contract.client.ProjectClient;
import com.marketplace.contract.client.ProjectStatus;
import com.marketplace.contract.client.UpdateProjectStatusRequest;
import com.marketplace.contract.config.MilestoneStateMachine;
import com.marketplace.contract.dto.milestone.*;
import com.marketplace.contract.entity.Contract;
import com.marketplace.contract.entity.ContractStatus;
import com.marketplace.contract.entity.Milestone;
import com.marketplace.contract.entity.MilestoneStatus;
import com.marketplace.contract.exception.ApiException;
import com.marketplace.contract.exception.ResourceNotFoundException;
import com.marketplace.contract.mapper.MilestoneMapper;
import com.marketplace.contract.repository.ContractRepository;
import com.marketplace.contract.repository.MilestoneRepository;
import com.marketplace.contract.security.SecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MilestoneServiceImpl implements MilestoneService{
    private final MilestoneRepository milestoneRepository;
    private final ContractRepository contractRepository;
    private final MilestoneMapper milestoneMapper;
    private final ProjectClient projectClient;
    private final SecurityUtil securityUtil;
    private final MilestoneStateMachine stateMachine;

    @Override
    @Transactional
    public MilestoneResponse createMilestone(CreateMilestoneRequest request, Long userId) {
        getContractAndValidateOwnership(request.getContractId(),userId, true);

        Milestone milestone = milestoneMapper.toEntity(request);
        milestone.setStatus(MilestoneStatus.PENDING);
        Milestone savedMilestone = milestoneRepository.save(milestone);
        return milestoneMapper.toResponse(savedMilestone);
    }

    @Override
    public MilestoneResponse getMilestoneById(Long id) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone", "MilestoneId", id));

        return milestoneMapper.toResponse(milestone);
    }

    @Override
    public List<MilestoneResponse> getMilestonesByContractId(Long contractId) {
        List<Milestone> milestones = milestoneRepository.findByContractIdOrderBySequenceNumberAsc(contractId);
        return milestoneMapper.toResponseList(milestones);
    }

    @Override
    @Transactional
    public MilestoneResponse updateMilestone(Long id, UpdateMilestoneRequest request, Long userId) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone", "MilestoneId", id));
        getContractAndValidateOwnership(milestone.getContractId(), userId, true);

        milestoneMapper.updateEntityFromRequest(request, milestone);
        return milestoneMapper.toResponse(milestoneRepository.save(milestone));
    }

    @Override
    @Transactional
    public MilestoneResponse startMilestone(Long id, Long userId) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone", "MilestoneId", id));
        getContractAndValidateOwnership(milestone.getContractId(), userId, false);

        stateMachine.validateTransition(milestone.getStatus(), MilestoneStatus.IN_PROGRESS);
        milestone.setStatus(MilestoneStatus.IN_PROGRESS);
        return milestoneMapper.toResponse(milestoneRepository.save(milestone));
    }

    @Override
    @Transactional
    public MilestoneResponse submitMilestone(Long id, SubmitMilestoneRequest request, Long userId) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone", "MilestoneId", id));
        getContractAndValidateOwnership(milestone.getContractId(), userId, false);

        stateMachine.validateTransition(milestone.getStatus(), MilestoneStatus.SUBMITTED);
        milestone.setStatus(MilestoneStatus.SUBMITTED);
        milestone.setSubmissionDescription(request.getDescription());
        milestone.setDeliverableUrl(request.getDeliverableUrl());
        return milestoneMapper.toResponse(milestoneRepository.save(milestone));
    }

    @Override
    @Transactional
    public MilestoneResponse approveMilestone(Long id, Long userId) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone", "MilestoneId", id));
        Contract contract = getContractAndValidateOwnership(milestone.getContractId(), userId, true);

        stateMachine.validateTransition(milestone.getStatus(), MilestoneStatus.APPROVED);
        milestone.setStatus(MilestoneStatus.APPROVED);
        milestone = milestoneRepository.save(milestone);

        return milestoneMapper.toResponse(milestone);
    }

    @Override
    @Transactional
    public MilestoneResponse rejectMilestone(Long id, RejectMilestoneRequest request, Long userId) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone", "MilestoneId", id));
        getContractAndValidateOwnership(milestone.getContractId(), userId, true);

        stateMachine.validateTransition(milestone.getStatus(), MilestoneStatus.REJECTED);
        milestone.setStatus(MilestoneStatus.REJECTED);
        milestone.setRejectionReason(request.getReason());
        return milestoneMapper.toResponse(milestoneRepository.save(milestone));
    }

    private Contract getContractAndValidateOwnership(Long contractId, Long userId, boolean isClient){
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", "contractId", contractId));

        if ("ADMIN".equalsIgnoreCase(securityUtil.getCurrentUserRole())){
            return contract;
        }
        Long ownerId = isClient ? contract.getClientId() : contract.getFreelancerId();
        if (!ownerId.equals(userId)) {
            throw new ApiException("You do not own this contract.");
        }
        return contract;
    }

    private void checkAndCompleteContract(Contract contract) {
        boolean allPaid = milestoneRepository.findByContractIdOrderBySequenceNumberAsc(contract.getId())
                .stream()
                .allMatch(m -> m.getStatus() == MilestoneStatus.PAID);

        if (allPaid) {
            contract.setStatus(ContractStatus.COMPLETED);
            contractRepository.save(contract);

            projectClient.updateStatus(contract.getProjectId(), new UpdateProjectStatusRequest(ProjectStatus.COMPLETED));
        }
    }
}

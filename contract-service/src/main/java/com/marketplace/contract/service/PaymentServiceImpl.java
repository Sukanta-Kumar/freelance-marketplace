package com.marketplace.contract.service;

import com.marketplace.contract.client.ProjectClient;
import com.marketplace.contract.client.ProjectStatus;
import com.marketplace.contract.client.UpdateProjectStatusRequest;
import com.marketplace.contract.config.MilestoneStateMachine;
import com.marketplace.contract.dto.payment.PaymentResponse;
import com.marketplace.contract.entity.*;
import com.marketplace.contract.exception.ApiException;
import com.marketplace.contract.exception.ResourceNotFoundException;
import com.marketplace.contract.mapper.PaymentMapper;
import com.marketplace.contract.repository.ContractRepository;
import com.marketplace.contract.repository.MilestoneRepository;
import com.marketplace.contract.repository.PaymentRepository;
import com.marketplace.contract.security.SecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final MilestoneRepository milestoneRepository;
    private final ContractRepository contractRepository;
    private final PaymentMapper paymentMapper;
    private final MilestoneStateMachine stateMachine;
    private final SecurityUtil securityUtil;
    private final ProjectClient projectClient;

    @Override
    @Transactional
    public PaymentResponse processPayment(Long milestoneId, Long userId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone", "milestoneId", milestoneId));

        Contract contract = contractRepository.findById(milestone.getContractId())
                .orElseThrow(()-> new ResourceNotFoundException("Contract", "contractId", milestone.getContractId()));

        if (!"ADMIN".equalsIgnoreCase(securityUtil.getCurrentUserRole()) && !contract.getClientId().equals(userId)) {
            throw new ApiException("You do not own this contract.");
        }

        // Validate State (Must be APPROVED to pay)
        if (milestone.getStatus() != MilestoneStatus.APPROVED) {
            throw new ApiException("Milestone must be APPROVED before payment.");
        }

        // Create Payment Record
        Payment payment = Payment.builder()
                .milestoneId(milestone.getId())
                .contractId(contract.getId())
                .clientId(contract.getClientId())
                .freelancerId(contract.getFreelancerId())
                .amount(milestone.getAmount())
                .status(PaymentStatus.SUCCESS)
                .build();
        payment = paymentRepository.save(payment);

        // Update Milestone State to PAID
        stateMachine.validateTransition(milestone.getStatus(), MilestoneStatus.PAID);
        milestone.setStatus(MilestoneStatus.PAID);
        milestone.setPaidAt(payment.getPaidAt());
        milestoneRepository.save(milestone);

        checkAndCompleteContract(contract);

        return paymentMapper.toResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Payment", "paymentId", id));

        return paymentMapper.toResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentByMilestoneId(Long milestoneId) {
        Payment payment = paymentRepository.findByMilestoneId(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "milestoneId", milestoneId));

        return paymentMapper.toResponse(payment);
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

package com.marketplace.contract.controller;

import com.marketplace.contract.dto.milestone.*;
import com.marketplace.contract.security.SecurityUtil;
import com.marketplace.contract.service.MilestoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milestones")
@RequiredArgsConstructor
public class MilestoneController {
    private final MilestoneService milestoneService;
    private final SecurityUtil securityUtil;

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<MilestoneResponse> createMilestone(@Valid @RequestBody CreateMilestoneRequest request){
        Long userId = securityUtil.getCurrentUserId();
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(milestoneService.createMilestone(request, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MilestoneResponse> getMilestoneById(@PathVariable Long id){
        return ResponseEntity.ok(milestoneService.getMilestoneById(id));
    }

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<MilestoneResponse>> getMilestoneByContractId(@PathVariable Long contractId){
        return ResponseEntity.ok(milestoneService.getMilestonesByContractId(contractId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<MilestoneResponse> updateMilestone(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMilestoneRequest request){
        Long userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(milestoneService.updateMilestone(id, request, userId));
    }

    @PatchMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('FREELANCER', 'ADMIN')")
    public ResponseEntity<MilestoneResponse> startMilestone(@PathVariable Long id) {
        Long userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(milestoneService.startMilestone(id, userId));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('FREELANCER', 'ADMIN')")
    public ResponseEntity<MilestoneResponse> submitMilestone(
            @PathVariable Long id,
            @Valid @RequestBody SubmitMilestoneRequest request) {
        Long userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(milestoneService.submitMilestone(id, request, userId));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<MilestoneResponse> approveMilestone(@PathVariable Long id) {
        Long userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(milestoneService.approveMilestone(id, userId));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<MilestoneResponse> rejectMilestone(
            @PathVariable Long id,
            @Valid @RequestBody RejectMilestoneRequest request) {
        Long userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(milestoneService.rejectMilestone(id, request, userId));
    }
}

    /*
POST /milestones
GET /milestones/{id}
GET /milestones/contract/{contractId}
PUT /milestones/{id}
PATCH /milestones/{id}/start
POST /milestones/{id}/submit
PATCH /milestones/{id}/approve
PATCH /milestones/{id}/reject

     */
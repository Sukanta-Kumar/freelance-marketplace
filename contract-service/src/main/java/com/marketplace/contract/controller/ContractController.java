package com.marketplace.contract.controller;

import com.marketplace.contract.dto.contract.ContractResponse;
import com.marketplace.contract.dto.contract.CreateContractRequest;
import com.marketplace.contract.service.ContractService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {
    private final ContractService contractService;

    @PostMapping("/internal")
    public ResponseEntity<ContractResponse> createContract(@Valid @RequestBody CreateContractRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(contractService.createContract(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getContractById(@PathVariable Long id){
        return ResponseEntity.ok(contractService.getCotractById(id));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ContractResponse>> getContractsByClientId (@PathVariable Long clientId){
        return ResponseEntity.ok(contractService.getContractsByClientId(clientId));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<ContractResponse>> getContractsByFreelancerId(@PathVariable Long freelancerId){
        return ResponseEntity.ok(contractService.getContractsByFreelancerId(freelancerId));
    }

    @PatchMapping("/{id}/complete")
    // @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ContractResponse> completeContract(@PathVariable Long id) {
        return ResponseEntity.ok(contractService.completeContract(id));
    }

    @PatchMapping("/{id}/cancel")
    // @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ContractResponse> cancelContract(@PathVariable Long id) {
        return ResponseEntity.ok(contractService.cancelContract(id));
    }
}

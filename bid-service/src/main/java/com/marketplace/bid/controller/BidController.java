package com.marketplace.bid.controller;

import com.marketplace.bid.dto.BidRequest;
import com.marketplace.bid.dto.BidResponse;
import com.marketplace.bid.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {
    private final BidService bidService;

    @PostMapping
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<BidResponse> createBid(@RequestBody BidRequest bidRequest){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bidService.createBid(bidRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BidResponse> getBid(@PathVariable Long id){
        return ResponseEntity.status(HttpStatus.FOUND).body(bidService.getBidById(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<BidResponse>> getBidByProjectId(@PathVariable Long projectId){
        return ResponseEntity.ok(bidService.getBidByProjectId(projectId));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<BidResponse>> getBidByFreelancerId(@PathVariable Long freelancerId){
        return ResponseEntity.ok(bidService.getBidByFreelancerId(freelancerId));
    }

    @PutMapping("/{id}")
        @PreAuthorize("hasAnyRole('FREELANCER', 'ADMIN')")
    public ResponseEntity<BidResponse> updateBid(@PathVariable Long id, @RequestBody BidRequest bidRequest){
        return ResponseEntity.ok(bidService.updateBid(id,bidRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FREELANCER', 'ADMIN')")
    public ResponseEntity<Void> deleteBid(@PathVariable Long id){
        bidService.deleteBid(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<BidResponse> acceptBid(@PathVariable Long id){
        return ResponseEntity.ok(bidService.acceptBid(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<BidResponse> rejectBid(@PathVariable Long id){
        return ResponseEntity.ok(bidService.rejectBid(id));
    }
}
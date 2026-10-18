package com.marketplace.bid.service;

import com.marketplace.bid.dto.BidRequest;
import com.marketplace.bid.dto.BidResponse;

import java.util.List;

public interface BidService {
    BidResponse createBid(BidRequest bidRequest);

    BidResponse getBidById(Long id);

    List<BidResponse> getBidByProjectId(Long projectId);

    List<BidResponse> getBidByFreelancerId(Long freelancerId);

    BidResponse updateBid(Long id, BidRequest bidRequest);

    void deleteBid(Long id);

    BidResponse acceptBid(Long id);

    BidResponse rejectBid(Long id);
}

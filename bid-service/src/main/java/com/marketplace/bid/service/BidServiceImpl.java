package com.marketplace.bid.service;

import com.marketplace.bid.client.ProjectClient;
import com.marketplace.bid.client.ProjectResponse;
import com.marketplace.bid.client.ProjectStatus;
import com.marketplace.bid.dto.BidRequest;
import com.marketplace.bid.dto.BidResponse;
import com.marketplace.bid.entity.Bid;
import com.marketplace.bid.entity.BidStatus;
import com.marketplace.bid.exception.ApiException;
import com.marketplace.bid.exception.ResourceNotFoundException;
import com.marketplace.bid.mapper.BidMapper;
import com.marketplace.bid.repository.BidRepository;
import com.marketplace.bid.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {

    private final BidRepository bidRepository;
    private final BidMapper bidMapper;
    private final ProjectClient projectClient;
    private final SecurityUtil securityUtil;

    @Override
    public BidResponse createBid(BidRequest bidRequest) {
        ProjectResponse project = projectClient.getProjectById(bidRequest.getProjectId());
        if(project.getStatus() != ProjectStatus.OPEN){
            throw new ApiException("Bids Can be submitted only for open Project");
        }

        Bid bid = bidMapper.toEntity(bidRequest);

        bid.setFreelancerId(securityUtil.getCurrentUserId());

        Bid savedBid = bidRepository.save(bid);

        return bidMapper.toResponse(savedBid);
    }

    @Override
    public BidResponse getBidById(Long id) {
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bid", "BidId", id));

        return bidMapper.toResponse(bid);
    }

    @Override
    public List<BidResponse> getBidByProjectId(Long projectId) {
        List<Bid> bids = bidRepository.findByProjectId(projectId);

        return bids
                .stream()
                .map(bid -> bidMapper.toResponse(bid))
                .toList();
    }

    @Override
    public List<BidResponse> getBidByFreelancerId(Long freelancerId) {
        List<Bid> bids = bidRepository.findByFreelancerId(freelancerId);

        return bids
                .stream()
                .map(bid -> bidMapper.toResponse(bid))
                .toList();
    }

    @Override
    public BidResponse updateBid(Long id, BidRequest bidRequest) {
        Long currentUserId = securityUtil.getCurrentUserId();
        String currentUserRole = securityUtil.getCurrentUserRole();

        Bid bidFromDb = bidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bid", "BidId", id));

        if (!currentUserRole.equals("ADMIN") &&
                !bidFromDb.getFreelancerId().equals(currentUserId)){
            throw new ApiException("You can only update your own bid");
        }

        if (bidFromDb.getStatus() != BidStatus.PENDING){
            throw new ApiException("Only Pending bids can be updated");
        }

        bidFromDb.setAmount(bidRequest.getAmount());
        bidFromDb.setProposal(bidRequest.getProposal());
        bidFromDb.setEstimatedDays(bidRequest.getEstimatedDays());

        Bid updatedBid = bidRepository.save(bidFromDb);
        return bidMapper.toResponse(bidRepository.save(updatedBid));
    }

    @Override
    public void deleteBid(Long id) {
        Bid bidFromDb = bidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bid", "BidId", id));

        Long currentUserId = securityUtil.getCurrentUserId();
        String currentUserRole = securityUtil.getCurrentUserRole();
        if (!currentUserRole.equals("ADMIN") && !bidFromDb.getFreelancerId().equals(currentUserId)){
            throw new ApiException("You are Not Allow To Delete This Bid");
        }

        if (bidFromDb.getStatus() != BidStatus.PENDING){
            throw new ApiException("Only Pending bids can be Deleted");
        }

        bidRepository.delete(bidFromDb);
    }

    @Override
    public BidResponse acceptBid(Long id) {
        Bid bidFrmDb = bidRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Bid", "BidId", id));
        ProjectResponse project = projectClient.getProjectById(bidFrmDb.getProjectId());
        Long currentUserId = securityUtil.getCurrentUserId();
        String currentUserRole = securityUtil.getCurrentUserRole();

        if(!currentUserRole.equals("ADMIN") && !project.getClientId().equals(currentUserId)){
            throw new ApiException("You can only accept bids for your own project");
        }
        if (project.getStatus() != ProjectStatus.OPEN){
            throw new ApiException("Only Opened Project can accept bid");
        }
        if (bidFrmDb.getStatus() != BidStatus.PENDING){
            throw new ApiException("Only pending Bids Can be accepted");
        }

        bidFrmDb.setStatus(BidStatus.ACCEPTED);
        Bid acceptedBid = bidRepository.save(bidFrmDb);

        return bidMapper.toResponse(acceptedBid);
    }

    @Override
    public BidResponse rejectBid(Long id) {
        Bid bidFrmDb = bidRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Bid", "BidId", id));
        ProjectResponse project = projectClient.getProjectById(bidFrmDb.getProjectId());
        Long currentUserId = securityUtil.getCurrentUserId();
        String currentUserRole = securityUtil.getCurrentUserRole();

        if(!currentUserRole.equals("ADMIN") && !project.getClientId().equals(currentUserId)){
            throw new ApiException("You can only reject bids for your own project");
        }
        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new ApiException("Bids can only be rejected for OPEN projects");
        }

        bidFrmDb.setStatus(BidStatus.REJECTED);
        Bid acceptedBid = bidRepository.save(bidFrmDb);
        return bidMapper.toResponse(acceptedBid);
    }
}

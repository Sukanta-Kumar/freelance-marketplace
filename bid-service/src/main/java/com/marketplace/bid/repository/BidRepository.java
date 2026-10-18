package com.marketplace.bid.repository;

import com.marketplace.bid.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByProjectId(Long projectId);

    List<Bid> findByFreelancerId(Long freelancerId);
}

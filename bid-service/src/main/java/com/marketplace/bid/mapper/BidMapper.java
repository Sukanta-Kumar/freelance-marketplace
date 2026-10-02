package com.marketplace.bid.mapper;

import com.marketplace.bid.dto.BidRequest;
import com.marketplace.bid.dto.BidResponse;
import com.marketplace.bid.entity.Bid;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BidMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "freelancerId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Bid toEntity(BidRequest request);

    BidResponse toResponse(Bid bid);
}

package com.marketplace.contract.mapper;

import com.marketplace.contract.dto.payment.PaymentResponse;
import com.marketplace.contract.entity.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentResponse toResponse(Payment payment);
}

package com.marketplace.contract.config;

import com.marketplace.contract.entity.MilestoneStatus;
import com.marketplace.contract.exception.ApiException;
import org.springframework.stereotype.Component;

@Component
public class MilestoneStateMachine {
    public void validateTransition(MilestoneStatus currentStatus, MilestoneStatus targetStatus){
        boolean isValid = switch (currentStatus) {
            case PENDING -> targetStatus == MilestoneStatus.IN_PROGRESS;
            case IN_PROGRESS -> targetStatus == MilestoneStatus.SUBMITTED;
            case SUBMITTED -> targetStatus == MilestoneStatus.APPROVED
                    || targetStatus == MilestoneStatus.REJECTED;
            case REJECTED -> targetStatus == MilestoneStatus.IN_PROGRESS;
            case APPROVED -> targetStatus == MilestoneStatus.PAID;
            case PAID -> false;
        };

        if (!isValid){
            throw new ApiException("Cannot transition milestone from " + currentStatus + " to " + targetStatus);
        }
    }
}

/*
Start: PENDING -> IN_PROGRESS
Submit Work: IN_PROGRESS -> SUBMITTED
Client Reviews: SUBMITTED -> APPROVED or REJECTED
Work Again: REJECTED -> IN_PROGRESS
Payment (Internal): APPROVED -> PAID
 */
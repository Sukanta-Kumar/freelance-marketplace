package com.marketplace.contract.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "project-service")
public interface ProjectClient {
    @GetMapping("/api/projects/{id}")
    ProjectResponse getProjectById(@PathVariable Long id);

    @PatchMapping("/api/projects/{id}/status")
    ProjectResponse updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateProjectStatusRequest updateStatusRequest
    );
}

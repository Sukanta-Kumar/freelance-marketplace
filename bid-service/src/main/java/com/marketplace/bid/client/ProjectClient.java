package com.marketplace.bid.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "project-service")
public interface ProjectClient {

    @GetMapping("/api/projects/{id}")
    ProjectResponse getProjectById(@PathVariable Long id);
}

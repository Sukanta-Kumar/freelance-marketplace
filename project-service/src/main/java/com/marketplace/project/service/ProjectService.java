package com.marketplace.project.service;

import com.marketplace.project.dto.ProjectRequest;
import com.marketplace.project.dto.ProjectResponse;
import com.marketplace.project.dto.UpdateStatusRequest;

import java.util.List;

public interface ProjectService {
    ProjectResponse addProject(ProjectRequest projectRequest);

    List<ProjectResponse> getAllProjects();

    ProjectResponse getProjectById(Long id);

    ProjectResponse updateProject(ProjectRequest projectRequest, Long id);

    void deleteProject(Long id);

    ProjectResponse updateStatus(Long id, UpdateStatusRequest updateStatusRequest);
}

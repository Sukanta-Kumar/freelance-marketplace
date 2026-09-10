package com.marketplace.project.service;

import com.marketplace.project.dto.ProjectRequest;
import com.marketplace.project.dto.ProjectResponse;
import com.marketplace.project.dto.UpdateStatusRequest;
import com.marketplace.project.entity.Project;
import com.marketplace.project.exception.ApiException;
import com.marketplace.project.exception.ResourceNotFoundException;
import com.marketplace.project.mapper.ProjectMapper;
import com.marketplace.project.repository.ProjectRepository;
import com.marketplace.project.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService{

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final SecurityUtil securityUtil;

    @Override
    public ProjectResponse addProject(ProjectRequest projectRequest) {
        Long currentUserId = securityUtil.getCurrentUserId();

        Project project = projectMapper.toEntity(projectRequest);
        project.setClientId(currentUserId);

        Project savedProject = projectRepository.save(project);

        return projectMapper.toResponse(savedProject);
    }

    @Override
    public List<ProjectResponse> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        if (projects.isEmpty()){
            throw new ApiException("Project not available now");
        }
        List<ProjectResponse> projectsResponse = projects.stream()
                .map(project -> projectMapper.toResponse(project))
                .toList();
        return projectsResponse;
    }

    @Override
    public ProjectResponse getProjectById(Long id) {
        Project projectFromDb = projectRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Project", "ProjectId", id));

        return projectMapper.toResponse(projectFromDb);
    }

    @Override
    public ProjectResponse updateProject(ProjectRequest projectRequest, Long id) {

        Project projectFromDb = projectRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Project", "ProjectId", id));

//        projectFromDb.setTitle(projectRequest.getTitle());
//        projectFromDb.setDescription(projectRequest.getDescription());
//        projectFromDb.setBudget(projectRequest.getBudget());
//        projectFromDb.setDeadline(projectRequest.getDeadline());

        /**
         * Since iam already using MapStruct, recommend adding an update mapping in ProjectMapper
         * rather than manually setting every field.
         * (Not required to update time also because already used @PreUpdate in Entity)
         */

        Long currentUserId = securityUtil.getCurrentUserId();
        String currentRole = securityUtil.getCurrentUserRole();
        // CLIENT can update only their own project
        // ADMIN can update any project
        if("CLIENT".equals(currentRole) && !projectFromDb.getClientId().equals(currentUserId)){
            throw new ApiException("You are Not Allowed to Update this project");
        }

        projectMapper.updateProjectFromRequest(projectRequest,projectFromDb);

        Project updated = projectRepository.save(projectFromDb);

        return projectMapper.toResponse(updated);
    }

    @Override
    public void deleteProject(Long id) {
        Project projectFromDb = projectRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Project", "ProjectId", id));

        Long currentUserId = securityUtil.getCurrentUserId();
        String currentRole = securityUtil.getCurrentUserRole();
        // CLIENT can delete only their own project
        // ADMIN can delete any project
        if("CLIENT".equals(currentRole) && !projectFromDb.getClientId().equals(currentUserId)){
            throw new ApiException("You are Not Allowed to Delete this project");
        }

        projectRepository.delete(projectFromDb);
    }

    @Override
    public ProjectResponse updateStatus(Long id, UpdateStatusRequest updateStatusRequest) {
        Project projectFromDb = projectRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Project", "ProjectId", id));

        Long currentUserId = securityUtil.getCurrentUserId();
        String currentRole = securityUtil.getCurrentUserRole();
        // CLIENT can update status only for their own project
        // ADMIN can update status of any project
        if("CLIENT".equals(currentRole) && !projectFromDb.getClientId().equals(currentUserId)){
            throw new ApiException("You are Not Allowed to Delete this project");
        }

        projectFromDb.setStatus(updateStatusRequest.getStatus());

        Project updatedProject = projectRepository.save(projectFromDb);
        return projectMapper.toResponse(updatedProject);
    }
}



/*
validation
----------------
CLIENT → can update/delete own project only
CLIENT → cannot update/delete another client's project → 403
ADMIN → can update/delete any project
FREELANCER → cannot update/delete projects → 403
 */
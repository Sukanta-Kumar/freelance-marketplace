package com.marketplace.project.controller;

import com.marketplace.project.dto.ProjectRequest;
import com.marketplace.project.dto.ProjectResponse;
import com.marketplace.project.dto.UpdateStatusRequest;
import com.marketplace.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
//    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<ProjectResponse> addProject(@RequestBody ProjectRequest projectRequest){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(projectService.addProject(projectRequest));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects(){
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id){
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
//    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<ProjectResponse> updateProjectById(@PathVariable Long id, @RequestBody ProjectRequest projectRequest){
        return ResponseEntity.ok(projectService.updateProject(projectRequest,id));
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id){
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
//    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<ProjectResponse> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest updateStatusRequest){
        return ResponseEntity.ok(projectService.updateStatus(id,updateStatusRequest));
    }
}

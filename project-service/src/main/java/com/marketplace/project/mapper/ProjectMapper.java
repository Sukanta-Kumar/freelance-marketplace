package com.marketplace.project.mapper;

import com.marketplace.project.dto.ProjectRequest;
import com.marketplace.project.dto.ProjectResponse;
import com.marketplace.project.entity.Project;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    Project toEntity(ProjectRequest request);

    ProjectResponse toResponse(Project project);

    /** update mapping */

    void updateProjectFromRequest(ProjectRequest request,
                                  @MappingTarget Project project
    );
}

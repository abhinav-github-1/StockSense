package com.stocksense.controller;

import com.stocksense.dto.ReorderRecommendationResponse;
import com.stocksense.service.ReorderRecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reorder")
public class ReorderRecommendationController {

    private final ReorderRecommendationService reorderService;

    public ReorderRecommendationController(ReorderRecommendationService reorderService) {
        this.reorderService = reorderService;
    }

    @GetMapping("/recommendations")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<ReorderRecommendationResponse>> getRecommendations() {
        return ResponseEntity.ok(reorderService.getRecommendations());
    }
}

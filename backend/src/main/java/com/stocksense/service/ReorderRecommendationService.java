package com.stocksense.service;

import com.stocksense.dto.ReorderRecommendationResponse;

import java.util.List;

public interface ReorderRecommendationService {

    List<ReorderRecommendationResponse> getRecommendations();
}

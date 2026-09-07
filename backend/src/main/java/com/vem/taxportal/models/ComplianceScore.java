package com.vem.taxportal.models;

import jakarta.persistence.Embeddable;
import java.time.LocalDateTime;

@Embeddable
public class ComplianceScore {
    private Integer score = 85;
    private String rating = "Good";
    private LocalDateTime lastEvaluated = LocalDateTime.now();

    public ComplianceScore() {}

    public ComplianceScore(Integer score, String rating, LocalDateTime lastEvaluated) {
        this.score = score != null ? score : 85;
        this.rating = rating != null ? rating : "Good";
        this.lastEvaluated = lastEvaluated != null ? lastEvaluated : LocalDateTime.now();
    }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public LocalDateTime getLastEvaluated() { return lastEvaluated; }
    public void setLastEvaluated(LocalDateTime lastEvaluated) { this.lastEvaluated = lastEvaluated; }
}

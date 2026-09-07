package com.vem.taxportal.models;

import jakarta.persistence.Embeddable;

@Embeddable
public class GisCoordinates {
    private Double lat = 11.5092;
    private Double lng = 77.2347;

    public GisCoordinates() {}

    public GisCoordinates(Double lat, Double lng) {
        this.lat = lat != null ? lat : 11.5092;
        this.lng = lng != null ? lng : 77.2347;
    }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
}

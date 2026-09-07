package com.vem.taxportal.models;

import jakarta.persistence.Embeddable;

@Embeddable
public class Location {
    private String district = "Erode";
    private String municipality = "Sathyamangalam Municipality";
    private String ward = "Ward 01";
    private String street = "Main Bazaar";
    private String doorNo = "1";
    private String pincode = "638401";

    public Location() {}

    public Location(String district, String municipality, String ward, String street, String doorNo, String pincode) {
        this.district = district != null ? district : "Erode";
        this.municipality = municipality != null ? municipality : "Sathyamangalam Municipality";
        this.ward = ward != null ? ward : "Ward 01";
        this.street = street != null ? street : "Main Bazaar";
        this.doorNo = doorNo != null ? doorNo : "1";
        this.pincode = pincode != null ? pincode : "638401";
    }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getMunicipality() { return municipality; }
    public void setMunicipality(String municipality) { this.municipality = municipality; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getDoorNo() { return doorNo; }
    public void setDoorNo(String doorNo) { this.doorNo = doorNo; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}

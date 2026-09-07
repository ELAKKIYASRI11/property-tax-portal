package com.vem.taxportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;

public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private LocalDate dateOfBirth;
    private Boolean isDifferentlyAbled;
    private String address;
    private String token;

    public AuthResponse() {}

    public AuthResponse(Long id, String name, String email, String role, String phone,
                        LocalDate dateOfBirth, Boolean isDifferentlyAbled, String address, String token) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.isDifferentlyAbled = isDifferentlyAbled;
        this.address = address;
        this.token = token;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @JsonProperty("_id")
    public Long get_id() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    @JsonProperty("isDifferentlyAbled")
    public Boolean getIsDifferentlyAbled() { return isDifferentlyAbled; }
    public void setIsDifferentlyAbled(Boolean differentlyAbled) { isDifferentlyAbled = differentlyAbled; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
